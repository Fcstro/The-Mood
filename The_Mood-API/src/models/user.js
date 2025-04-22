import { connection } from '../core/database.js';
import { encryptPassword } from '../utils/hash.js';
import crypto from 'crypto';

class User {
  constructor() {
    this.db = connection;
  }

  /**
   * Create user profile
   *
   * @param {String} username
   * @param {String} password
   * @param {String} fullname 
   *
   * @returns {Object}
   * @throws MySQL2 error
   *
   */
  async create(username, password, fullname, email) {
    try {
        const [results,] = await connection.execute(
            'INSERT INTO users(username, password, fullname, email) VALUES (?, ?, ?, ?)',
            [username, encryptPassword(password), fullname, email],
        );

        return results;
    } catch (err) {
        console.error('<error> user.create', err);
        throw err;
    }
  }

    /**
   * Verify if account exists
   *
   * @param {string} identifier - Username or email
   * @param {string} password
   * @returns {Object}
   * @throws {Error}
   */
    async verify(identifier, password) {
      try {
          const [results] = await connection.execute(
              'SELECT id, username, fullname, profile_image FROM users WHERE (username = ? OR email = ?) AND password = ?',
              [identifier, identifier, encryptPassword(password)],
          );
  
          return results?.[0];
      } catch (err) {
          console.error('<error> user.verify', err);
          throw err;
      }
  }

  /**
   * Get user's information
   *
   * @param {string} username 
   * @returns {Object}
   * @throws {Error}
   *
   */
  async get(username) {
    try {
        const [results] = await connection.execute(
            'SELECT id, fullname, profile_image, header_image, email FROM users WHERE username = ?',
            [username]
        );

        return results?.[0]; // Ensure you're returning the ID as well
    } catch (err) {
        console.error('<error> user.getInformation', err);
        throw err; // Rethrow the error to be caught in the profile method
    }
  }
  


  /**
   * Check if a user exists
   *
   * @param {string} username 
   * @returns {boolean}
   * @throws {Error}
   */
  async exists(username) {
    try {
      const [results,] = await connection.execute(
        'SELECT COUNT(*) as count FROM users WHERE username = ?',
        [username]
      );
      return results[0].count > 0;
    } catch (err) {
      console.error('<error> user.exists', err);
      throw err;
    }
  }

  /**
   * Generate password reset token
   *
   * @param {String} email
   * @returns {String} The generated token
   * @throws MySQL2 error
   */
  async generatePasswordResetToken(email) {
    const token = crypto.randomBytes(20).toString('hex');
    const expiration = Date.now() + 3600000;

    try {
      await connection.execute(
        'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
        [token, expiration, email]
      );
      return token;
    } catch (err) {
      console.error('<error> user.generatePasswordResetToken', err);
      throw err;
    }
  }

  /**
 * Search users by username or full name
 *
 * @param {String} query
 * @returns {Array} List of users matching the query
 * @throws MySQL2 error
 */
async search(query) {
  try {
      const [results] = await connection.execute(
          'SELECT id, username, profile_image, fullname FROM users WHERE username LIKE ? OR fullname LIKE ?',
          [`%${query}%`, `%${query}%`] // Search in both username and fullname
      );
      return results;
  } catch (err) {
      console.error('<error> user.search', err);
      throw err;
  }
}
  /**
   * Follow a user
   *
   * @param {number} followerId - The ID of the user who is following
   * @param {number} followeeId - The ID of the user to be followed
   * @returns {Promise<Object>}
   */
  async follow(followerId, followeeId) {
    try {
      const [result] = await connection.execute(
        'INSERT INTO followers (follower_id, followee_id) VALUES (?, ?)',
        [followerId, followeeId]
      );
      return result;
    } catch (err) {
      console.error('<error> user.follow', err);
      throw err;
    }
  }

  
  /**
   * Unfollow a user
   *
   * @param {number} followerId - The ID of the user who is unfollowing
   * @param {number} followeeId - The ID of the user to be unfollowed
   * @returns {Promise<Object>}
   */
  async unfollow(followerId, followeeId) {
    try {
      const [result] = await connection.execute(
        'DELETE FROM followers WHERE follower_id = ? AND followee_id = ?',
        [followerId, followeeId]
      );
      return result;
    } catch (err) {
      console.error('<error> user.unfollow', err);
      throw err;
    }
  }

  /**
   * Get a list of users that a user is following
   *
   * @param {number} userId - The ID of the user
   * @returns {Promise<Array>}
   */
  async getFollowing(userId) {
    try {
      const [results] = await connection.execute(
        'SELECT followee_id FROM followers WHERE follower_id = ?',
        [userId]
      );
      return results;
    } catch (err) {
      console.error('<error> user.getFollowing', err);
      throw err;
    }
  }
    /**
   * Update user information
   *
   * @param {number} userId - The ID of the user to update
   * @param {Object} updates - An object containing the fields to update
   * @returns {Promise<Object>}
   */
  async update(userId, updates) {
    const { fullname, username , email} = updates;
    const fields = [];
    const values = [];

    if (fullname) {
      fields.push('fullname = ?');
      values.push(fullname);
    }
    if (username) {
      fields.push('username = ?');
      values.push(username);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }

    values.push(userId);
    try {
      const [result] = await connection.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      return result;
    } catch (err) {
      console.error('<error> user.update', err);
      throw err;
    }
  }


  /**
 * Get a list of users that are following a user
 *
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array>}
 */
  async getFollowers(userId) {
    if (userId === undefined) {
      console.error('<error> user.getFollowers: userId is undefined');
      return []; // Return an empty array if userId is undefined
    }
  
    try {
      const [results] = await connection.execute(
        'SELECT follower_id FROM followers WHERE followee_id = ?',
        [userId]
      );
      return results;
    } catch (err) {
      console.error('<error> user.getFollowers', err);
      throw err;
    }
  }
  async getFollowerCount(userId) {
    try {
      const [results] = await connection.execute(
        'SELECT COUNT(*) as count FROM followers WHERE followee_id = ?',
        [userId]
      );
      return results[0].count;
    } catch (err) {
      console.error('<error> user.getFollowerCount', err);
      throw err;
    }
  }
  
  async getFollowingCount(userId) {
    try {
      const [results] = await connection.execute(
        'SELECT COUNT(*) as count FROM followers WHERE follower_id = ?',
        [userId]
      );
      return results[0].count;
    } catch (err) {
      console.error('<error> user.getFollowingCount', err);
      throw err;
    }
  } 
  async getById(userId) {
    try {
        const [results] = await connection.execute(
            'SELECT id, username, fullname, profile_image,email, header_image FROM users WHERE id = ?',
            [userId]
        );
        return results[0]; // Return the first result
    } catch (err) {
        console.error('<error> user.getById', err);
        throw err;
    }
  }

  async getByIdRM(userId) {
    try {
        const [results] = await connection.execute(
            'SELECT id, username, fullname, profile_image,email, header_image FROM users WHERE id = ?',
            [userId]
        );
        return results.length > 0 ? results : []; // Return an empty array if no results
    } catch (err) {
        console.error('<error> user.getById', err);
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

 

  async emailExists(email) {
    try {
        const [results] = await connection.execute(
            'SELECT COUNT(*) as count FROM users WHERE email = ?',
            [email]
        );
        return results[0].count > 0;
    } catch (err) {
        console.error('<error> user.emailExists', err);
        throw err;
    }
  }
  async updateProfileImage(userId, imagePath) {
    try {
      const [result] = await connection.execute(
        'UPDATE users SET profile_image = ? WHERE id = ?',
        [imagePath, userId]
      );
      return result;
    } catch (err) {
      console.error('<error> user.updateProfileImage', err);
      throw err;
    }
  }
  
  async updateHeaderImage(userId, imagePath) {
    try {
      const [result] = await connection.execute(
        'UPDATE users SET header_image = ? WHERE id = ?',
        [imagePath, userId]
      );
      return result;
    } catch (err) {
      console.error('<error> user.updateHeaderImage', err);
      throw err;
    }
  }
  async updatePassword(userId, newPassword) {
    try {
        const [result] = await connection.execute(
            'UPDATE users SET password = ? WHERE id = ?',
            [encryptPassword(newPassword), userId] // Encrypt the new password
        );
        return result;
    } catch (err) {
        console.error('<error> user.updatePassword', err);
        throw err;
    }
}
async isFollowing(followerId, followeeId) {
  try {
      const [results] = await connection.execute(
          'SELECT COUNT(*) as count FROM followers WHERE follower_id = ? AND followee_id = ?',
          [followerId, followeeId]
      );
      return results[0].count > 0; // Return true if the user is following
  } catch (err) {
      console.error('<error> user.isFollowing', err);
      throw err;
  }
}

  

}

export default User;