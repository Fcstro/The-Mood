
import { connection } from '../core/database.js';
import Hashtag from './hashtag.js';

class Mood {
  async create(userId, content, originalMoodId = null) {
    try {
        const [result] = await connection.execute(
            'INSERT INTO moods (user_id, content, created_at, original_mood_id) VALUES (?, ?, NOW(), ?)',
            [userId, content, originalMoodId]
        );

        const hashtags = this.extractHashtags(content);
        if (hashtags.length > 0) {
            await Hashtag.associateMoodWithHashtags(result.insertId, hashtags); // Associate hashtags with the mood
        }

        return result;
    } catch (err) {
        console.error('<error> mood.create', err);
        throw err;
    }
  }

  extractHashtags(content) {
    const regex = /#(\w+)/g; 
    const matches = content.match(regex);
    return matches ? matches.map(tag => tag.substring(1)) : []; 
  }

  async getAllByUser (userId) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getAllByUser ', err);
        throw err;
    }
  }


  async update(moodId, userId, content) {
    try {
        const [result] = await connection.execute(
            'UPDATE moods SET content = ? WHERE id = ? AND user_id = ?',
            [content, moodId, userId]
        );

        const hashtags = this.extractHashtags(content);
        await Hashtag.associateMoodWithHashtags(moodId, hashtags);

        return result;
    } catch (err) {
        console.error('<error> mood.update', err);
        throw err;
    }
  } 

  extractHashtags(content) {
    const regex = /#(\w+)/g; 
    const matches = content.match(regex);
    return matches ? matches.map(tag => tag.substring(1)) : []; 
  }


  async delete(moodId, userId) {
    try {
        const [result] = await connection.execute(
            'DELETE FROM moods WHERE id = ? AND user_id = ?',
            [moodId, userId]
        );
        return result;
    } catch (err) {
        console.error('<error> mood.delete', err);
        throw err;
    }
  } 

  async like(moodId, userId) {
    try {
      // Check if the user has already liked the mood
      const [existingLike] = await connection.execute(
        'SELECT * FROM likes WHERE mood_id = ? AND user_id = ?',
        [moodId, userId]
      );

      if (existingLike.length > 0) {
        throw new Error('You have already liked this mood');
      }

      // Insert a new like into the database
      await connection.execute(
        'INSERT INTO likes (mood_id, user_id) VALUES (?, ?)',
        [moodId, userId]
      );

      return { success: true, message: 'Mood liked successfully' };
    } catch (err) {
      console.error('<error> mood.like', err);
      throw err;
    }
  }

  async unlike(moodId, userId) {
    try {
      // Remove the like from the database
      const result = await connection.execute(
        'DELETE FROM likes WHERE mood_id = ? AND user_id = ?',
        [moodId, userId]
      );

      if (result[0].affectedRows === 0) {
        throw new Error('You have not liked this mood yet');
      }

      return { success: true, message: 'Mood unliked successfully' };
    } catch (err) {
      console.error('<error> mood.unlike', err);
      throw err;
    }
  }


  async getLikes(moodId) {
    try {
        const [results] = await connection.execute(
            'SELECT COUNT(*) as likeCount FROM likes WHERE mood_id = ?',
            [moodId]
        );
      return results[0].likeCount;
    } catch (err) {
        console.error('<error> mood.getLikes', err);
        throw err;
    }
  }
  async search(query) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM moods WHERE content LIKE ? ORDER BY created_at DESC',
            [`%${query}%`]
        );
        return results;
    } catch (err) {
        console.error('<error> mood.search', err);
        throw err;
    }
  }
  async getMoodById(moodId) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM moods WHERE id = ?',
            [moodId]
        );
        return results.length > 0 ? results : []; // Return an empty array if no results
    } catch (err) {
        console.error('<error> mood.getMoodById', err);
        throw err;
    }
}
  async checkRepostExists(userId, originalMoodId) {
    const query = 'SELECT * FROM moods WHERE user_id = ? AND original_mood_id = ?';
    const [rows] = await connection.execute(query, [userId, originalMoodId]);
    return rows.length > 0; 
  }
  async searchByHashtag(hashtag) {
    try {
        const [results] = await connection.execute(
            `SELECT m.* FROM moods m
              JOIN mood_hashtags mh ON m.id = mh.mood_id
              JOIN hashtags h ON mh.hashtag_id = h.id
              WHERE h.tag = ?;`,
            [hashtag]
        );
        return results;
    } catch (err) {
        console.error('<error> comment.searchByHashtag', err);
        throw err;
    }
  }
  async getAllMoods() {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM moods ORDER BY created_at DESC'
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getAllMoods', err);
        throw err;
    }
  }

  async getLatestMoods() {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM moods ORDER BY created_at DESC LIMIT 10' // Fetch the latest 10 moods
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getLatestMoods', err);
        throw err;
    }
}

async getTopLikedMoods() {
    try {
        const [results] = await connection.execute(
            `SELECT m.*, COUNT(l.user_id) as likeCount 
             FROM moods m 
             LEFT JOIN likes l ON m.id = l.mood_id 
             GROUP BY m.id 
             ORDER BY likeCount DESC 
             LIMIT 10` // Fetch top 10 liked moods
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getTopLikedMoods', err);
        throw err;
    }
}

async getTopCommentedMoods() {
    try {
        const [results] = await connection.execute(
            `SELECT m.*, COUNT(c.id) as commentCount 
             FROM moods m 
             LEFT JOIN comments c ON m.id = c.mood_id 
             GROUP BY m.id 
             ORDER BY commentCount DESC 
             LIMIT 10` 
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getTopCommentedMoods', err);
        throw err;
    }
  }
  async getMoodsByUserIds(userIds) {
    try {
        if (userIds.length === 0) {
            return []; d
        }

        // Create a string of placeholders for the SQL query
        const placeholders = userIds.map(() => '?').join(', ');

        const [results] = await connection.execute(
            `SELECT * FROM moods WHERE user_id IN (${placeholders}) ORDER BY created_at DESC`,
            userIds // Pass the userIds array directly
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getMoodsByUser Ids', err);
        throw err;
    }
  }
  async getById(userId) {
    try {
        const [results] = await connection.execute(
            'SELECT id, username FROM users WHERE id = ?',
            [userId]
        );
        console.log('Query results for userId:', userId, results);
        return results[0]; // Return the first result
    } catch (err) {
        console.error('<error> user.getById', err);
        throw err;
    }
  }

  async getOriginalAuthorByMoodId(originalMoodId) {
    try {
        // Fetch the user ID of the original mood
        const [results] = await connection.execute(
            'SELECT user_id FROM moods WHERE id = ?',
            [originalMoodId]
        );

        if (results.length === 0) {
            return null; // No original mood found
        }

        const originalUserId = results[0].user_id;

        // Fetch the original author's details
        const [userDetails] = await connection.execute(
            'SELECT id, username, profile_image FROM users WHERE id = ?',
            [originalUserId]
        );

        return userDetails.length > 0 ? userDetails[0] : null; // Return user details or null
    } catch (err) {
        console.error('<error> mood.getOriginalAuthorByMoodId', err);
        throw err;
    }
}
  async getLikesCount(moodId) {
    try {
        const [results] = await connection.execute(
            'SELECT COUNT(*) as likeCount FROM likes WHERE mood_id = ?',
            [moodId]
        );
        return results[0].likeCount;
    } catch (err) {
        console.error('<error> mood.getLikesCount', err);
        throw err;
    }
  }

  async getUsersWhoLiked(moodId) {
    try {
        const [results] = await connection.execute(
            `SELECT u.id, u.username, u.profile_image 
            FROM likes l 
            JOIN users u ON l.user_id = u.id 
            WHERE l.mood_id = ?`,
            [moodId]
        );
        return results; // Return the list of users who liked the mood
    } catch (err) {
        console.error('<error> mood.getUsersWhoLiked', err);
        throw err;
    }
  }
  async getAllMoodsByUser (userId) {
    try {
        const [results] = await connection.execute(
            'SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return results;
    } catch (err) {
        console.error('<error> mood.getAllMoodsByUser ', err);
        throw err;
    }
}
async getLikedMoodsByUserId(userId) {
  try {
      const [results] = await connection.execute(
          `SELECT m.* FROM moods m
           JOIN likes l ON m.id = l.mood_id
           WHERE l.user_id = ?`,
          [userId]
      );
      return results; // Return the list of moods liked by the user
  } catch (err) {
      console.error('<error> mood.getLikedMoodsByUser Id', err);
      throw err;
  }
}
  
}

export default Mood;