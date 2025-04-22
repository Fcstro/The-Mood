
import { connection } from '../core/database.js';
import Hashtag from './hashtag.js'

class Comment {
  async create(userId, moodId, content, parentCommentId = null) {
    try {
        const [result] = await connection.execute(
            'INSERT INTO comments (user_id, mood_id, content, created_at, parent_comment_id) VALUES (?, ?, ?, NOW(), ?)',
            [userId, moodId, content, parentCommentId]
        );

       
        const hashtags = this.extractHashtags(content);
        await Hashtag.associateCommentWithHashtags(result.insertId, hashtags);

        return result;
    } catch (err) {
        console.error('<error> comment.create', err);
        throw err;
    }
  }

  extractHashtags(content) {
      const regex = /#(\w+)/g; // Regex to find hashtags
      const matches = content.match(regex);
      return matches ? matches.map(tag => tag.substring(1)) : []; // Remove '#' and return tags
  }


  async getAllByMood(moodId) {
    try {
      const [results] = await connection.execute(
        'SELECT * FROM comments WHERE mood_id = ? ORDER BY created_at DESC',
        [moodId]
      );
      return results;
    } catch (err) {
      console.error('<error> comment.getAllByMood', err);
      throw err;
    }
  }

  async like(userId, commentId) {
    try {
      const [result] = await connection.execute(
        'INSERT INTO comment_likes (user_id, comment_id) VALUES (?, ?)',
        [userId, commentId]
      );
      return result;
    } catch (err) {
      console.error('<error> comment.like', err);
      throw err;
    }
  }

  async unlike(userId, commentId) {
    try {
      const [result] = await connection.execute(
        'DELETE FROM comment_likes WHERE user_id = ? AND comment_id = ?',
        [userId, commentId]
      );
      return result;
    } catch (err) {
      console.error('<error> comment.unlike', err);
      throw err;
    }
  }

  async getLikes(commentId) {
    try {
      const [results] = await connection.execute(
        'SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?',
        [commentId]
      );
      return results[0].likeCount;
    } catch (err) {
      console.error('<error> comment.getLikes', err);
      throw err;
    }
  }
  async update(commentId, userId, content) {
    try {
        const [result] = await connection.execute(
            'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?',
            [content, commentId, userId]
        );
        return result;
    } catch (err) {
        console.error('<error> comment.update', err);
        throw err;
    }
  }
  async delete(commentId, userId) {
    try {
        const [result] = await connection.execute(
            'DELETE FROM comments WHERE id = ? AND user_id = ?',
            [commentId, userId]
        );
        return result; // Return the result to check if the deletion was successful
    } catch (err) {
        console.error('<error> comment.delete', err);
        throw err;
    }
    }
  async searchByHashtag(hashtag) {
    try {
        const [results] = await connection.execute(
            `SELECT c.* FROM comments c
            JOIN comment_hashtags ch ON c.id = ch.comment_id
            JOIN hashtags h ON ch.hashtag_id = h.id
            WHERE h.tag = ?`,
            [hashtag]
        );
        return results;
    } catch (err) {
        console.error('<error> comment.searchByHashtag', err);
        throw err;
    }
    }
  async checkLikeExists(userId, commentId) {
      try {
        const [results] = await connection.execute(
            'SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?',
            [userId, commentId]
        );
        return results; // Return the results to check if the like exists
    } catch (err) {
                console.error('<error> comment.checkLikeExists', err);
        throw err;
    }
  }
  async getById(commentId) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM comments WHERE id = ?',
            [commentId]
        );
        return results[0]; // Return the first result
    } catch (err) {
        console.error('<error> comment.getById', err);
        throw err;
    }
  }
  async hasLiked(userId, commentId) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM comment_likes WHERE user_id = ? AND comment_id = ?',
            [userId, commentId]
        );
        return results.length > 0; // Return true if the user has liked the comment
    } catch (err) {
        console.error('<error> comment.hasLiked', err);
        throw err;
    }
  }
  async getByIds(userId) {
    if (userId === undefined) {
        console.error('<error> user.getById: userId is undefined');
        return null; // Return null or handle the error as needed
    }
    try {
        const [results] = await connection.execute(
            'SELECT id, username, profile_image, fullname FROM users WHERE id = ?', // Include profile_image
            [userId]
        );
        return results[0]; 
    } catch (err) {
        console.error('<error> user.getById', err);
        throw err;
    }
  }
  async getReplies(commentId) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM comments WHERE parent_comment_id = ? ORDER BY created_at DESC',
            [commentId]
        );

        // For each reply, fetch the user details, like count, and users who liked it
        const structuredReplies = await Promise.all(results.map(async (reply) => {
            const user = await this.getByIds(reply.user_id); // Fetch user details for the reply
            const likeCount = await this.getLikes(reply.id);
            const usersWhoLiked = await this.getUsersWhoLiked(reply.id);
            return {
                ...reply,
                user: {
                    userId: user.id,
                    username: user.username,
                    profileImage: user.profile_image,
                },
                likeCount,
                usersWhoLiked,
            };
        }));

        return structuredReplies; // Return the replies with user details and like information
    } catch (err) {
        console.error('<error> comment.getReplies', err);
        throw err;
    }
}
  async getLikes(commentId) {
    try {
        const [results] = await connection.execute(
            'SELECT COUNT(*) as likeCount FROM comment_likes WHERE comment_id = ?',
            [commentId]
        );
        return results[0].likeCount;
    } catch (err) {
        console.error('<error> comment.getLikes', err);
        throw err;
    }
}

async getUsersWhoLiked(commentId) {
    try {
        const [results] = await connection.execute(
            `SELECT u.id, u.username, u.profile_image 
             FROM comment_likes cl 
             JOIN users u ON cl.user_id = u.id 
             WHERE cl.comment_id = ?`,
            [commentId]
        );
        return results; // Return the list of users who liked the comment
    } catch (err) {
        console.error('<error> comment.getUsersWhoLiked', err);
        throw err;
    }
}
}

export default new Comment();