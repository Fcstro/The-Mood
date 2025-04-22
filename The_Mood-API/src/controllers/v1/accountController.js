import jwt from 'jsonwebtoken';
import User from '../../models/user.js';



class AccountController {
  constructor() {
    this.user = new User();
  }

  /**
   * Create account controller
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async create(req, res) {
    const { username, password, firstName, lastName, email } = req.body || {};

    try {
        // Check if username, password, firstName, lastName, and email are provided
        if (!username || !password || !firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username, password, first name, last name, and email are required',
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }

        // Combine first name and last name into fullname
        const fullname = `${firstName} ${lastName}`;

        // Check if the username already exists
        const userExists = await this.user.exists(username);
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists',
            });
        }

        // Check if the email already exists
        const emailExists = await this.user.emailExists(email);
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists',
            });
        }

        // Create the user account
        const response = await this.user.create(username, password, fullname, email);

        // Respond with success and the record index
        res.status(201).json({
            success: true,
            message: 'User  registered successfully',
            data: {
                recordIndex: response?.insertId,
            },
        });
    } catch (err) {
        console.error('<error> account.create', err); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the account',
        });
    }
  }

 /**
 * Login Controller
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
async login(req, res) {
  try {
      const { identifier, password } = req.body || {}; // Change to identifier

      // Check if identifier and password are provided
      if (!identifier || !password) {
          return res.status(400).json({
              success: false,
              message: 'Identifier (username or email) and password are required',
          });
      }

      // Verify user credentials
      const result = await this.user.verify(identifier, password); // Pass identifier

      // If user is not found or password is incorrect
      if (!result?.id) {
          return res.status(401).json({
              success: false,
              message: 'Invalid username/email or password',
          });
      }

      const token = jwt.sign({ id: result.id, username: result.username }, process.env.API_SECRET_KEY, {
          expiresIn: '30d',
      });

      res.status(200).json({
          success: true,
          message: "Logged in Successfully",
          data: {
              token,
              userId: result.id,
              username: result.username,
              fullname: result.fullname, // Include fullname in the response
              profileImage: result.profile_image,
          },
      });
  } catch (err) {
      console.error('<error> account.login', err);
      res.status(500).json({
          success: false,
          message: 'An error occurred while logging in',
      });
  }
}
  
async profile(req, res) {
    try {
        const userId = req.user.id; // Get user ID from the authenticated request

        // Fetch user information using the user ID
        const userInfo = await this.user.getById(userId);

        if (!userInfo || !userInfo.id) {
            return res.status(404).json({
                success: false,
                message: 'User  not found',
            });
        }

        // Get follower and following counts
        const followers = await this.user.getFollowerCount(userInfo.id);
        const following = await this.user.getFollowingCount(userInfo.id);

        res.json({
            success: true,
            data: {
                userId: userInfo.id,
                username: userInfo.username,
                email: userInfo.email,
                fullname: userInfo.fullname,
                profileImage: userInfo.profile_image,
                headerImage: userInfo.header_image,
                followers,
                following,
            }
        });
    } catch (err) {
        console.error('<error> account.profile', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the profile. Please try again later.',
        });
    }
}

  /**
 * forgot password controller
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
async forgotPassword(req, res) {
  const { email } = req.body;

  try {
      // Validate email
      if (!email) {
          return res.status(400).json({
              success: false,
              message: 'Email is required',
          });
      }

      // Validate email format using regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({
              success: false,
              message: 'Invalid email format',
          });
      }

      // Generate reset token and save it
      const token = await this.user.generatePasswordResetToken(email);
      
      // Here you would send the email with the reset link containing the token
      // For example: `http://yourapp.com/reset-password?token=${token}`
      // You can use a mailing service like Nodemailer for this.

      res.status(200).json({
          success: true,
          message: 'Password reset email sent',
      });
  } catch (err) {
      console.error('<error> account.resetPassword', err);
      res.status(500).json({
          success: false,
          message: 'An error occurred while sending the password reset email',
      });
  }
}

  /**
 * Reset password controller
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
async resetPassword(req, res) {
  const { currentPassword, newPassword } = req.body; // Expecting current and new passwords

  try {
      // Validate input
      if (!currentPassword || !newPassword) {
          return res.status(400).json({
              success: false,
              message: 'Current password and new password are required',
          });
      }

      // Check if the new password is different from the current password
      if (currentPassword === newPassword) {
          return res.status(400).json({
              success: false,
              message: 'New password must be different from the current password',
          });
      }

      // Verify user credentials
      const userId = req.user.id; // Get user ID from the authenticated request
      const user = await this.user.verify(req.user.username, currentPassword); // Verify current password

      // If user is not found or password is incorrect
      if (!user) {
          return res.status(401).json({
              success: false,
              message: 'Invalid current password',
          });
      }

      // Update the password in the database
      await this.user.updatePassword(userId, newPassword); // Assuming you have a method to update the password

      res.status(200).json({
          success: true,
          message: 'Password updated successfully',
      });
  } catch (err) {
      console.error('<error> account.resetPassword', err);
      res.status(500).json({
          success: false,
          message: 'An error occurred while resetting the password',
      });
  }
}

/**
 * Search users controller
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {void}
 */
async searchUsers(req, res) {
    const { q } = req.query;
    const userId = req.user.id; // Get the authenticated user's ID

    try {
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Query parameter is required',
            });
        }

        // Fetch users based on the search query
        const users = await this.user.search(q);

        // Check if the authenticated user is following each of the returned users
        const followingStatus = await Promise.all(users.map(async (user) => {
            const isFollowing = await this.user.isFollowing(userId, user.id); // Check if the authenticated user follows this user
            return {
                id: user.id,
                username: user.username,
                profileImage: user.profile_image,
                fullname: user.fullname, // Include full name
                followBack: isFollowing, // Include follow status
            };
        }));

        res.status(200).json({
            success: true,
            users: followingStatus,
        });
    } catch (err) {
        console.error('<error> account.searchUsers', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while searching for users',
        });
    }
    }

   /**
   * Follow a user
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
   async follow(req, res) {
    const followerId = req.user.id; 
    const { followeeId } = req.body;

    try {
        if (!followeeId) {
            return res.status(400).json({
                success: false,
                message: 'Followee ID is required',
            });
        }

        // Check if the user is trying to follow themselves
        if (followerId === followeeId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot follow yourself',
            });
        }

        const result = await this.user.follow(followerId, followeeId);
        if (result.affectedRows === 0) {
            return res.status(409).json({
                success: false,
                message: 'You are already following this user',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Successfully followed the user',
        });
    } catch (err) {
        console.error('<error> account.follow', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while following the user',
        });
    }
  }

  /**
   * Unfollow a user
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async unfollow(req, res) {
    const followerId = req.user.id; // Assuming user ID is stored in req.user after authentication
    const { followeeId } = req.body;

    try {
      if (!followeeId) {
        return res.status(400).json({
          success: false,
          message: 'Followee ID is required',
        });
      }

      await this.user.unfollow(followerId, followeeId);
      res.status(200).json({
        success: true,
        message: 'Successfully unfollowed the user',
      });
    } catch (err) {
      console.error('<error> account.unfollow', err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while unfollowing the user',
      });
    }
  }

  /**
   * Get a list of users that are following the authenticated user
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async getFollowers(req, res) {
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    try {
        const followers = await this.user.getFollowers(userId);
        
        // Fetch profiles of the followers
        const followerProfiles = await Promise.all(followers.map(async (follower) => {
            const userProfile = await this.user.getByIds(follower.follower_id);
            const followBack = await this.user.isFollowing(userId, follower.follower_id); // Check if the authenticated user follows this follower
            return {
                userId: userProfile.id,
                username: userProfile.username,
                profileImage: userProfile.profile_image,
                fullname: userProfile.fullname, // Include full name
                followBack // Include followBack status
            };
        }));

        // Get the list of users that the authenticated user follows
        const following = await this.user.getFollowing(userId);
        const followingIds = following.map(f => f.followee_id); // Extract followee IDs

        // Create a response that includes all followers and their follow status
        const response = followerProfiles.map(follower => ({
            ...follower,
            followBack: followingIds.includes(follower.userId) // Check if the authenticated user follows this follower
        }));

        res.status(200).json({
            success: true,
            followers: response,
        });
    } catch (err) {
        console.error('<error> account.getFollowers', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the list of followers',
        });
    }
}

  /**
   * Get a list of users that a user is following
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async getFollowing(req, res) {
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication

    try {
        const following = await this.user.getFollowing(userId);
        
        // Fetch profiles of the users being followed
        const followingProfiles = await Promise.all(following.map(async (follow) => {
            const userProfile = await this.user.getByIds(follow.followee_id);
            return {
                userId: userProfile.id,
                username: userProfile.username,
                profileImage: userProfile.profile_image,
                fullname: userProfile.fullname // Include full nameA
            };
        }));

        res.status(200).json({
            success: true,
            following: followingProfiles,
        });
    } catch (err) {
        console.error('<error> account.getFollowing', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the list of followed users',
        });
    }
  }

  /**
   * Update user profile
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async updateProfile(req, res) {
    const userId = req.user.id; // Get user ID from the authenticated request
    const { firstName, lastName, username, email } = req.body; // Get new information from the request body

    try {
        // Combine first name and last name into fullname
        const fullname = (firstName && lastName) ? `${firstName} ${lastName}` : null;

        // Validate input: at least one of fullname, username, or email must be provided
        if (!fullname && !username && !email) {
            return res.status(400).json({
                success: false,
                message: 'At least one field (fullname, username, or email) is required to update',
            });
        }

        // Check if the new username already exists
        if (username) {
            const usernameExists = await this.user.exists(username);
            if (usernameExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already exists',
                });
            }
        }

        // Check if the new email already exists
        if (email) {
            const emailExists = await this.user.emailExists(email, userId); // Pass userId to exclude current user
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists',
                });
            }
        }

        // Prepare the updates object
        const updates = {};
        if (fullname) updates.fullname = fullname; // Only add fullname if both first and last names are provided
        if (username) updates.username = username;
        if (email) updates.email = email; // Include email in the updates

        // Check if there are any updates to apply
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update',
            });
        }

        // Update user information
        const result = await this.user.update(userId, updates);
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'User  not found or no changes made',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User  profile updated successfully',
        });
    } catch (err) {
        console.error('<error> account.updateProfile', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the profile',
        });
    }
}
  /**
   * Logout Controller
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async logout(req, res) {
   

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }
  

   
  async uploadProfileImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please upload a valid image.',
        });
      }
  
      const userId = req.user.id; // Assuming you have user ID from authentication
      const profileImagePath = req.file.path;
  
      await this.user.updateProfileImage(userId, profileImagePath);
  
      res.status(200).json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: { profileImagePath },
      });
    } catch (err) {
      console.error('<error> account.uploadProfileImage', err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while uploading the profile image',
      });
    }
  }

  async uploadHeaderImage(req, res) {
    try {
      const userId = req.user.id;
      const headerImagePath = req.file.path;

      await this.user.updateHeaderImage(userId, headerImagePath);

      res.status(200).json({
        success: true,
        message: 'Header image uploaded successfully',
        data: { headerImagePath },
      });
    } catch (err) {
      console.error('<error> account.uploadHeaderImage', err);
      res.status(500).json({
        success: false,
        message: 'An error occurred while uploading the header image',
      });
    }
  }
  async updateProfileImage(req, res) {
    try {
        const userId = req.user.id; // Assuming you have user ID from authentication
        const profileImagePath = req.file.path;

        // Update the profile image in the database
        await this.user.updateProfileImage(userId, profileImagePath);

        res.status(200).json({
            success: true,
            message: 'Profile image updated successfully',
            data: { profileImagePath },
        });
    } catch (err) {
        console.error('<error> account.updateProfileImage', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the profile image',
        });
    }
}

async deleteProfileImage(req, res) {
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        // Set the profile_image column to NULL
        await this.user.updateProfileImage(userId, null);

        res.status(200).json({
            success: true,
            message: 'Profile image deleted successfully',
        });
    } catch (err) {
        console.error('<error> account.deleteProfileImage', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the profile image',
        });
    }
}

async updateHeaderImage(req, res) {
    try {
        const userId = req.user.id; // Assuming you have user ID from authentication
        const headerImagePath = req.file.path;

        // Update the header image in the database
        await this.user.updateHeaderImage(userId, headerImagePath);

        res.status(200).json({
            success: true,
            message: 'Header image updated successfully',
            data: { headerImagePath },
        });
    } catch (err) {
        console.error('<error> account.updateHeaderImage', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the header image',
        });
    }
}

async deleteHeaderImage(req, res) {
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        // Set the header_image column to NULL
        await this.user.updateHeaderImage(userId, null);

        res.status(200).json({
            success: true,
            message: 'Header image deleted successfully',
        });
    } catch (err) {
        console.error('<error> account.deleteHeaderImage', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the header image',
        });
    }
  }
  async getProfileById(req, res) {
    const { userId } = req.params; // Get userId from the request parameters

    try {
        // Fetch user information by ID
        const userInfo = await this.user.getById(userId);

        if (!userInfo) {
            return res.status(404).json({
                success: false,
                message: 'User  not found',
            });
        }

        // Get follower and following counts
        const followers = await this.user.getFollowerCount(userId);
        const following = await this.user.getFollowingCount(userId);

        res.json({
            success: true,
            data: {
                userId: userInfo.id,
                username: userInfo.username,
                profileImage: userInfo.profile_image,
                fullname: userInfo.fullname,
                followers,
                following,
            }
        });
    } catch (err) {
        console.error('<error> account.getProfileById', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving the user profile',
        });
    }
}
}

export default AccountController;


