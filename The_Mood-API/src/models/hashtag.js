import { connection } from '../core/database.js';

class Hashtag {
  async createIfNotExists(tag) {
    try {
        const [result] = await connection.execute(
            'INSERT INTO hashtags (tag) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
            [tag]
        );
        return result.insertId; // This should return the ID of the existing or newly created hashtag
    } catch (err) {
        console.error('<error> hashtag.createIfNotExists', err);
        throw err;
    }
}

 

  async associateMoodWithHashtags(moodId, tags) {
    if (tags.length === 0) return; // Skip if no tags

    try {
        const promises = tags.map(async (tag) => {
            // Create the hashtag if it doesn't exist
            const hashtagId = await this.createIfNotExists(tag); // Ensure the hashtag exists
            return connection.execute(
                'INSERT INTO mood_hashtags (mood_id, hashtag_id) VALUES (?, ?)',
                [moodId, hashtagId]
            );
        });
        await Promise.all(promises);
    } catch (err) {
        console.error('<error> hashtag.associateMoodWithHashtags', err);
        throw err;
    }
  }

  async associateCommentWithHashtags(commentId, tags) {
    if (tags.length === 0) return; // Skip if no tags

    try {
        const promises = tags.map(async (tag) => {
            // Create the hashtag if it doesn't exist
            const hashtagId = await this.createIfNotExists(tag); // Ensure the hashtag exists
            return connection.execute(
                'INSERT INTO comment_hashtags (comment_id, hashtag_id) VALUES (?, ?)',
                [commentId, hashtagId]
            );
        });
        await Promise.all(promises);
    } catch (err) {
        console.error('<error> hashtag.associateCommentWithHashtags', err);
        throw err;
    }
  }
}

export default new Hashtag();