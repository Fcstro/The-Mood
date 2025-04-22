
    import Mood from '../../models/mood.js';
    import Comment from '../../models/comment.js';
    import User from '../../models/user.js';
   


    class MoodController {
    constructor() {
        this.mood = new Mood(); // Create an instance of Mood
        this.user = new User(); // Create an instance of User
    
    }


    async create(req, res) {
        const { content } = req.body;
        const userId = req.user.id;

        try {
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const result = await this.mood.create(userId, content); // Use the instance

            // Check if the mood was created successfully
            if (result.affectedRows > 0) {
                return res.status(201).json({
                    success: true,
                    message: 'Mood created successfully',
                    data: {
                        moodId: result.insertId,
                    },
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Mood creation failed',
                });
            }
        } catch (err) {
            console.error('<error> mood.create', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the mood',
            });
        }
    }

    async getAll(req, res) {
        try {
            // Extract the user ID from the query parameters
            const targetUserId = req.query.userId; // Assuming the user ID is passed as a query parameter
    
            // Validate the user ID
            if (!targetUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'User  ID is required',
                });
            }
    
            // Fetch all moods created by the specified user
            const moods = await this.mood.getAllMoodsByUser(targetUserId); // You will need to implement this method
    
            // Check if the user has any moods
            if (moods.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No moods found for this user',
                });
            }
    
            // Map through each mood to include user details, like count, likers, comments, and replies
            const structuredMoods = await Promise.all(moods.map(async (mood) => {
                const user = await this.user.getByIds(mood.user_id); // Fetch user details for each mood
                
                // Fetch likes for the mood
                const likeCount = await this.mood.getLikes(mood.id); // Get the count of likes
                const likers = await this.mood.getUsersWhoLiked(mood.id); // Fetch users who liked the mood
    
                // Fetch comments for the mood
                const comments = await Comment.getAllByMood(mood.id); // Assuming you have a method to get comments by mood ID
                const structuredComments = await Promise.all(comments.map(async (comment) => {
                    const commenter = await this.user.getByIds(comment.user_id); // Fetch user details for each comment
    
                    // Get like count and users who liked the comment
                    const commentLikeCount = await Comment.getLikes(comment.id);
                    const usersWhoLikedComment = await Comment.getUsersWhoLiked(comment.id);
    
                    // Fetch replies for the comment
                    const replies = await Comment.getReplies(comment.id); // Assuming you have a method to get replies by comment ID
                    const structuredReplies = await Promise.all(replies.map(async (reply) => {
                        const replyUser  = await this.user.getByIds(reply.user_id); // Fetch user details for each reply
                        const replyLikeCount = await Comment.getLikes(reply.id); // Fetch likes for the reply
                        const usersWhoLikedReply = await Comment.getUsersWhoLiked(reply.id); // Fetch users who liked the reply
    
                        return {
                            ...reply,
                            user: {
                                userId: replyUser .id,
                                username: replyUser .username,
                                profileImage: replyUser .profile_image,
                            },
                            likeCount: replyLikeCount,
                            usersWhoLiked: usersWhoLikedReply, // List of users who liked the reply
                        };
                    }));
    
                    return {
                        ...comment,
                        user: {
                            userId: commenter.id,
                            username: commenter.username,
                            profileImage: commenter.profile_image,
                        },
                        likeCount: commentLikeCount, // Like count for the comment
                        usersWhoLiked: usersWhoLikedComment, // List of users who liked the comment
                        replies: structuredReplies,
                    };
                }));
    
                // Get original author details if this mood is a repost
                const originalMoodAuthor = mood.original_mood_id ? await this.mood.getOriginalAuthorByMoodId(mood.original_mood_id) : null;
    
                return {
                    ...mood,
                    user: {
                        userId: user.id,
                        username: user.username,
                        profileImage: user.profile_image,
                    },
                    likeCount: likeCount, // This should be a number now
                    likers: likers, // This should be an array of likers
                    commentCount: structuredComments.length,
                    comments: structuredComments,
                    originalMoodAuthor: originalMoodAuthor ? {
                        id: originalMoodAuthor.id,
                        username: originalMoodAuthor.username,
                        profileImage: originalMoodAuthor.profile_image,
                    } : null, // Include original author details
                };
            }));
    
            // Send the structured response
            res.status(200).json({
                success: true,
                data: structuredMoods,
            });
        } catch (err) {
            console.error('<error> mood.getAllMoods', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving moods',
            });
        }
    }

    async update(req, res) {
        const { moodId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        try {
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            const result = await this.mood.update(moodId, userId, content); // Use the instance
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mood not found or you do not have permission to update it',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mood updated successfully',
            });
        } catch (err) {
            console.error('<error> mood.update', err);
            res.status(500).json({
                success: false,
                message: 'nothing change',
            });
        }
    }

    async delete(req, res) {
        const { moodId } = req.params;
        const userId = req.user.id;

        try {
            const result = await this.mood.delete(moodId, userId); // Ensure this is correct
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Mood not found or you do not have permission to delete it',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mood deleted successfully',
            });
        } catch (err) {
            console.error('<error> mood.delete', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the mood',
            });
        }
    }

    async searchMoodsAndUsers(req, res) {
        const { q } = req.query;
        const userId = req.user.id; // Get the authenticated user's ID
    
        try {
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Query parameter is required',
                });
            }
    
            // Search for moods
            const posts = await this.mood.search(q);
            
            // Fetch additional user information for each mood
            const moodDetails = await Promise.all(posts.map(async (mood) => {
                const user = mood.user_id ? await this.user.getByIds(mood.user_id) : null; // Fetch user details
                
                // Get original author details using the new method in the Mood model
                const originalMoodAuthor = mood.original_mood_id ? await this.mood.getOriginalAuthorByMoodId(mood.original_mood_id) : null;
    
                return {
                    id: mood.id,
                    user_id: mood.user_id,
                    username: user ? user.username : 'Unknown User', 
                    profile_image: user ? user.profile_image : null, 
                    content: mood.content,
                    created_at: mood.created_at,
                    updated_at: mood.updated_at,
                    original_mood_id: mood.original_mood_id, 
                    original_mood_author: originalMoodAuthor ? {
                        id: originalMoodAuthor.id,
                        username: originalMoodAuthor.username,
                        profile_image: originalMoodAuthor.profile_image,
                    } : null,
                };
            }));
    
            // Search for users
            const users = await this.user.search(q); // This now searches by username and full name
    
            // Check if the authenticated user is following each of the returned users
            const usersWithFollowingStatus = await Promise.all(users.map(async (user) => {
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
                data: {
                    posts: moodDetails,
                    users: usersWithFollowingStatus,
                },
            });
        } catch (err) {
            console.error('<error> mood.searchMoodsAndUsers', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while searching for moods and users',
            });
        }
    }

    async likeMood(req, res) {
        const { moodId } = req.params;
        const userId = req.user.id; // Assuming you have user ID from the JWT token

        try {
            // Check if the mood exists
            const [moodExists] = await this.mood.getMoodById(moodId);
            if (!moodExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Mood not found',
                });
            }

            const result = await this.mood.like(moodId, userId);
            res.status(200).json(result);
        } catch (err) {
            console.error('<error> mood.likeMood', err);
            res.status(500).json({
                success: false,
                message: err.message || 'An error occurred while liking the mood',
            });
        }
    }

    async unlikeMood(req, res) {
        const { moodId } = req.params;
        const userId = req.user.id; 

        try {
        const result = await this.mood.unlike(moodId, userId);
        res.status(200).json(result);
        } catch (err) {
        console.error('<error> mood.unlikeMood', err);
        res.status(500).json({
            success: false,
            message: err.message || 'An error occurred while unliking the mood',
        });
        }
    }

    async getLikes(req, res) {
        const { moodId } = req.params;
    
        try {
            // Get the count of likes
            const likeCount = await this.mood.getLikesCount(moodId); // Use a new method to get the count
            // Get the users who liked the mood
            const usersWhoLiked = await this.mood.getUsersWhoLiked(moodId); // New method to get user details
    
            res.status(200).json({
                success: true,
                data: {
                    moodId,
                    likeCount,
                    users: usersWhoLiked, // Include the list of users who liked the mood
                },
            });
        } catch (err) {
            console.error('<error> mood.getLikes', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving likes',
            });
        }
    }



    async createComment(req, res) {
        const { moodId } = req.params;
        const { content, parentCommentId } = req.body; // Accept parentCommentId
        const userId = req.user.id;
    
        try {
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }
    
            // If parentCommentId is provided, check if it is a reply
            if (parentCommentId) {
                const parentComment = await Comment.getById(parentCommentId); // Assuming you have a method to get a comment by ID
                if (parentComment && parentComment.parent_comment_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'You cannot reply to a reply comment',
                    });
                }
            }
    
            // Create the comment and associate hashtags
            const result = await Comment.create(userId, moodId, content, parentCommentId); // Pass parentCommentId
            res.status(201).json({
                success: true,
                data: {
                    commentId: result.insertId,
                },
            });
        } catch (err) {
            console.error('<error> mood.createComment', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while creating the comment',
            });
        }
    }

    async getComments(req, res) {
        const { moodId } = req.params;
    
        try {
            const comments = await Comment.getAllByMood(moodId);
            
            const structuredComments = await Promise.all(comments.map(async (comment) => {
                const user = await this.user.getByIds(comment.user_id);
                const replies = await Comment.getReplies(comment.id); // Fetch replies with user details and like counts
                const replyCount = replies.length;
    
                const likeCount = await Comment.getLikes(comment.id);
                const usersWhoLiked = await Comment.getUsersWhoLiked(comment.id);
    
                return {
                    ...comment,
                    user: {
                        userId: user.id,
                        username: user.username,
                        profileImage: user.profile_image,
                    },
                    replyCount,
                    replies: replies, // Replies already include user details, like counts, and users who liked
                    likeCount,
                    usersWhoLiked,
                };
            }));
    
            res.status(200).json({
                success: true,
                data: structuredComments.filter(comment => !comment.parent_comment_id), // Only return top-level comments
            });
        } catch (err) {
            console.error('<error> mood.getComments', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving comments',
            });
        }
    }

    async likeComment(req, res) {
        const { commentId } = req.params;
        const userId = req.user.id;

        try {
            // Check if the user has already liked the comment
            const alreadyLiked = await Comment.hasLiked(userId, commentId);
            if (alreadyLiked) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already liked this comment',
                });
            }

            await Comment.like(userId, commentId);
            res.status(200).json({
                success: true,
                message: 'Comment liked successfully',
            });
        } catch (err) {
            console.error('<error> mood.likeComment', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while liking the comment',
            });
        }
    }

    async unlikeComment(req, res) {
        const { commentId } = req.params;
        const userId = req.user.id;

        try {
        await Comment.unlike(userId, commentId);
        res.status(200).json({
            success: true,
            message: 'Comment unliked successfully',
        });
        } catch (err) {
        console.error('<error> mood.unlikeComment', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while unliking the comment',
        });
        }
    }

    async getCommentLikes(req, res) {
        const { commentId } = req.params;

        try {
        const likeCount = await Comment.getLikes(commentId);
        res.status(200).json({
            success: true,
            data: {
            commentId,
            likeCount,
            },
        });
        } catch (err) {
        console.error('<error> mood.getCommentLikes', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving comment likes',
        });
        }
    }
    async updateComments(req, res) {
        const { moodId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        try {
            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: 'Content is required',
                });
            }

            // Assuming you have a method in the Comment model to update a comment
            const result = await Comment.update(commentId, userId, content);
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found or you do not have permission to update it',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
            });
        } catch (err) {
            console.error('<error> mood.updateComments', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating the comment',
            });
        }
    }
    async deleteComment(req, res) {
        const { commentId } = req.params; // Get commentId from the request parameters
        const userId = req.user.id; // Get user ID from the authenticated request

        try {
            // Call the delete method in the Comment model
            const result = await Comment.delete(commentId, userId);
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found or you do not have permission to delete it',
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully',
            });
        } catch (err) {
            console.error('<error> mood.deleteComment', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while deleting the comment',
            });
        }
    }

    async repost(req, res) {
        const { moodId } = req.params; // Get the original mood ID from the request parameters
        const userId = req.user.id; // Get the user ID from the authenticated request

        try {
            // Check if the mood exists
            const [moodExists] = await this.mood.getMoodById(moodId);
            if (!moodExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Mood not found',
                });
            }

            // Determine the original_mood_id
            const originalMoodId = moodExists.original_mood_id || moodExists.id; // Use original_mood_id if it exists, otherwise use the current mood's ID

            // Check if the user has already reposted this mood
            const repostExists = await this.mood.checkRepostExists(userId, originalMoodId);
            if (repostExists) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already reposted this mood.',
                });
            }

            // Get the original mood's details
            const [originalMood] = await this.mood.getMoodById(originalMoodId); 
            const [originalMoodAuthor] = await this.user.getByIdRM(originalMood.user_id); 

            // Create a new mood as a repost
            const result = await this.mood.create(userId, moodExists.content, originalMoodId); 

            res.status(201).json({
                success: true,
                message: 'Mood reposted successfully',
                data: {
                    moodId: result.insertId, 
                    originalMoodId: originalMoodId, 
                    originalAuthor: originalMoodAuthor.username, 
                    originalContent: originalMood.content, 
                    originalCreatedAt: originalMood.created_at 
                },
            });
        } catch (err) {
            console.error('<error> mood.repost', err.message, err.stack); 
            res.status(500).json({
                success: false,
                message: 'An error occurred while reposting the mood',
            });
        }
    }

    async hashtagSearch(req, res) {
        const { hashtag } = req.params;
    
        try {
            if (!hashtag) {
                return res.status(400).json({
                    success: false,
                    message: 'Hashtag is required',
                });
            }
    
            // Fetch moods associated with the hashtag
            const moodsWithHashtag = await this.mood.searchByHashtag(hashtag);
            const moodResponseData = await Promise.all(moodsWithHashtag.map(async (mood) => {
                const likeCount = await this.mood.getLikes(mood.id);
                const user = await this.user.getByIds(mood.user_id); // Fetch user details for the mood
    
                // Fetch original author details if this mood is a repost
                let originalAuthor = null;
                if (mood.original_mood_id) {
                    originalAuthor = await this.mood.getOriginalAuthorByMoodId(mood.original_mood_id);
                }
    
                // Fetch users who liked the mood
                const usersWhoLiked = await this.mood.getUsersWhoLiked(mood.id);
                const likedUsersDetails = usersWhoLiked.map(liker => ({
                    userId: liker.id,
                    username: liker.username,
                    profileImage: liker.profile_image,
                }));
    
                // Fetch comments for the mood
                const comments = await Comment.getAllByMood(mood.id);
                const structuredComments = await Promise.all(comments.map(async (comment) => {
                    const commenter = await this.user.getByIds(comment.user_id); // Fetch commenter details
                    const commentLikesCount = await Comment.getLikes(comment.id); // Get likes count for the comment
                    const usersWhoLikedComment = await Comment.getUsersWhoLiked(comment.id); // Get users who liked the comment
                    const likedCommentUsersDetails = usersWhoLikedComment.map(liker => ({
                        userId: liker.id,
                        username: liker.username,
                        profileImage: liker.profile_image,
                    }));
    
                    // Fetch replies for the comment
                    const replies = await Comment.getReplies(comment.id);
                    const structuredReplies = await Promise.all(replies.map(async (reply) => {
                        const replyUser  = await this.user.getByIds(reply.user_id); // Fetch reply user details
                        const replyLikesCount = await Comment.getLikes(reply.id); // Get likes count for the reply
                        const usersWhoLikedReply = await Comment.getUsersWhoLiked(reply.id); // Get users who liked the reply
                        const likedReplyUsersDetails = usersWhoLikedReply.map(liker => ({
                            userId: liker.id,
                            username: liker.username,
                            profileImage: liker.profile_image,
                        }));
    
                        return {
                            commentId: reply.id,
                            content: reply.content,
                            parentCommentId: reply.parent_comment_id,
                            createdAt: reply.created_at,
                            user: {
                                userId: replyUser .id,
                                username: replyUser .username,
                                profileImage: replyUser .profile_image,
                            },
                            likeCount: replyLikesCount,
                            likedUsers: likedReplyUsersDetails // Include users who liked the reply
                        };
                    }));
    
                    return {
                        commentId: comment.id,
                        content: comment.content,
                        createdAt: comment.created_at,
                        user: {
                            userId: commenter.id,
                            username: commenter.username,
                            profileImage: commenter.profile_image,
                        },
                        likeCount: commentLikesCount,
                        likedUsers: likedCommentUsersDetails, // Include users who liked the comment
                        replies: structuredReplies, // Include structured replies
                    };
                }));
    
                return {
                    moodId: mood.id,
                    moodContent: mood.content,
                    createdAt: mood.created_at,
                    user: {
                        userId: user.id,
                        username: user.username,
                        profileImage: user.profile_image,
                    },
                    originalMoodId: mood.original_mood_id,
                    originalAuthor: originalAuthor ? {
                        id: originalAuthor.id,
                        username: originalAuthor.username,
                        profileImage: originalAuthor.profile_image,
                    } : null,
                    likeCount: likeCount,
                    likedUsers: likedUsersDetails, // Include the details of users who liked the post
                    comments: structuredComments, // Include structured comments
                    commentCount: structuredComments.length, // Count of comments
                };
            }));
    
            res.status(200).json({
                success: true,
                data: {
                    moods: moodResponseData,
                },
            });
        } catch (err) {
            console.error('<error> mood.hashtag Search:', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching moods.',
            });
        }
    }
    async getForYou(req, res) {
        try {
            // Fetch the latest, top liked, and top commented moods
            const latestMoods = await this.mood.getLatestMoods();
            const topLikedMoods = await this.mood.getTopLikedMoods();
            const topCommentedMoods = await this.mood.getTopCommentedMoods();
    
            // Combine the moods and ensure uniqueness
            const combinedMoods = [...latestMoods, ...topLikedMoods, ...topCommentedMoods];
            const uniqueMoods = Array.from(new Set(combinedMoods.map(mood => mood.id)))
                .map(id => combinedMoods.find(mood => mood.id === id))
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
    
            // Prepare the response data
            const moodResponseData = await Promise.all(uniqueMoods.map(async (mood) => {
                const likeCount = await this.mood.getLikes(mood.id);
                const comments = await Comment.getAllByMood(mood.id); 
                const user = await this.user.getByIds(mood.user_id); // Use getByIds
    
                return {
                    moodId: mood.id,
                    moodContent: mood.content,
                    createdAt: mood.created_at,
                    user: {
                        userId: user.id,
                        username: user.username,
                        profileImage: user.profile_image,
                    },
                    originalMoodId: mood.original_mood_id || null,
                    originalAuthor: mood.original_mood_id ? await this.mood.getOriginalAuthorByMoodId(mood.original_mood_id) : null,
                    likeCount: likeCount,
                    likedUsers: await this.mood.getUsersWhoLiked(mood.id), // Fetch users who liked the mood
                    comments: await Promise.all(comments.map(async (comment) => {
                        const commentUser  = await this.user.getByIds(comment.user_id);
                        const commentLikes = await Comment.getLikes(comment.id);
                        const replies = await Comment.getReplies(comment.id);
    
                        return {
                            commentId: comment.id,
                            content: comment.content,
                            createdAt: comment.created_at,
                            user: {
                                userId: commentUser .id,
                                username: commentUser .username,
                                profileImage: commentUser .profile_image,
                            },
                            likeCount: commentLikes,
                            likedUsers: await Comment.getUsersWhoLiked(comment.id),
                            replies: await Promise.all(replies.map(async (reply) => {
                                const replyUser  = await this.user.getByIds(reply.user_id);
                                return {
                                    commentId: reply.id,
                                    content: reply.content,
                                    parentCommentId: reply.parent_comment_id,
                                    createdAt: reply.created_at,
                                    user: {
                                        userId: replyUser .id,
                                        username: replyUser .username,
                                        profileImage: replyUser .profile_image,
                                    },
                                    likeCount: await Comment.getLikes(reply.id),
                                    likedUsers: await Comment.getUsersWhoLiked(reply.id),
                                };
                            })),
                        };
                    })),
                };
            }));
    
            // Send the JSON response
            res.status(200).json({
                success: true,
                data: moodResponseData,
            });
        } catch (err) {
            console.error('<error> mood.getForYou', err);
            res.status(500).json({
                success: false,
                message: 'An error occurred while retrieving moods for you',
            });
        }
        }
        
        async getFollowingFeed(req, res) {
            const userId = req.user.id; // Get the authenticated user's ID
        
            try {
                const following = await this.user.getFollowing(userId);
                const followingIds = following.map(f => f.followee_id); // Extract followee IDs
        
                if (followingIds.length === 0) {
                    return res.status(200).json({
                        success: true,
                        data: [], // No following users
                    });
                }
        
                const moods = await this.mood.getMoodsByUserIds(followingIds);
        
                const moodResponseData = await Promise.all(moods.map(async (mood) => {
                    const likeCount = await this.mood.getLikes(mood.id);
                    const comments = await Comment.getAllByMood(mood.id);
                    const user = await this.user.getByIds(mood.user_id); 
        
                    return {
                        moodId: mood.id,
                        moodContent: mood.content,
                        createdAt: mood.created_at,
                        user: {
                            userId: user.id,
                            username: user.username,
                            profileImage: user.profile_image, // Include profile image
                        },
                        originalMoodId: mood.original_mood_id || null,
                        originalAuthor: mood.original_mood_id ? await this.mood.getOriginalAuthorByMoodId(mood.original_mood_id) : null,
                        likeCount: likeCount,
                        likedUsers: await this.mood.getUsersWhoLiked(mood.id), // Fetch users who liked the mood
                        comments: await Promise.all(comments.map(async (comment) => {
                            const commentUser  = await this.user.getByIds(comment.user_id);
                            const commentLikes = await Comment.getLikes(comment.id);
                            const replies = await Comment.getReplies(comment.id);
        
                            return {
                                commentId: comment.id,
                                content: comment.content,
                                createdAt: comment.created_at,
                                user: {
                                    userId: commentUser .id,
                                    username: commentUser .username,
                                    profileImage: commentUser .profile_image,
                                },
                                likeCount: commentLikes,
                                likedUsers: await Comment.getUsersWhoLiked(comment.id),
                                replies: await Promise.all(replies.map(async (reply) => {
                                    const replyUser  = await this.user.getByIds(reply.user_id);
                                    return {
                                        commentId: reply.id,
                                        content: reply.content,
                                        parentCommentId: reply.parent_comment_id,
                                        createdAt: reply.created_at,
                                        user: {
                                            userId: replyUser .id,
                                            username: replyUser .username,
                                            profileImage: replyUser .profile_image,
                                        },
                                        likeCount: await Comment.getLikes(reply.id),
                                        likedUsers: await Comment.getUsersWhoLiked(reply.id),
                                    };
                                })),
                            };
                        })),
                    };
                }));
        
                // Send the JSON response
                res.status(200).json({
                    success: true,
                    data: moodResponseData,
                });
            } catch (err) {
                console.error('<error> mood.getFollowingFeed', err);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while retrieving the following feed',
                });
            }
        }
        async getLikedMoodsByUser (req, res) {
            const { userId } = req.params; // Get the user ID from the request parameters
        
            try {
                // Fetch the moods liked by the user
                const likedMoods = await this.mood.getLikedMoodsByUserId(userId);
        
                // Map through each liked mood to include user details, like count, comments, etc.
                const structuredMoods = await Promise.all(likedMoods.map(async (mood) => {
                    const moodUser  = await this.user.getByIds(mood.user_id); // Fetch user details for each mood
                    
                    // Fetch likes for the mood
                    const likeCount = await this.mood.getLikes(mood.id);
                    const likedUsers = await this.mood.getUsersWhoLiked(mood.id); // Fetch users who liked the mood
        
                    // Fetch comments for the mood
                    const comments = await Comment.getAllByMood(mood.id); // Assuming you have a method to get comments by mood ID
        
                    return {
                        moodId: mood.id,
                        moodContent: mood.content,
                        createdAt: mood.created_at,
                        user: {
                            userId: moodUser .id,
                            username: moodUser .username,
                            profileImage: moodUser .profile_image,
                        },
                        originalMoodId: mood.original_mood_id || null,
                        originalAuthor: mood.original_mood_id ? await this.mood.getOriginalAuthorByMoodId(mood.original_mood_id) : null,
                        likeCount: likeCount,
                        likedUsers: likedUsers,
                        comments: await Promise.all(comments.map(async (comment) => {
                            const commentUser  = await this.user.getByIds(comment.user_id);
                            const commentLikes = await Comment.getLikes(comment.id);
                            const replies = await Comment.getReplies(comment.id);
        
                            return {
                                commentId: comment.id,
                                content: comment.content,
                                createdAt: comment.created_at,
                                user: {
                                    userId: commentUser .id,
                                    username: commentUser .username,
                                    profileImage: commentUser .profile_image,
                                },
                                likeCount: commentLikes,
                                likedUsers: await Comment.getUsersWhoLiked(comment.id),
                                replies: await Promise.all(replies.map(async (reply) => {
                                    const replyUser  = await this.user.getByIds(reply.user_id);
                                    return {
                                        commentId: reply.id,
                                        content: reply.content,
                                        parentCommentId: reply.parent_comment_id,
                                        createdAt: reply.created_at,
                                        user: {
                                            userId: replyUser .id,
                                            username: replyUser .username,
                                            profileImage: replyUser .profile_image,
                                        },
                                        likeCount: await Comment.getLikes(reply.id),
                                        likedUsers: await Comment.getUsersWhoLiked(reply.id),
                                    };
                                })),
                            };
                        })),
                    };
                }));
        
                // Send the structured response
                res.status(200).json({
                    success: true,
                    data: structuredMoods,
                });
            } catch (err) {
                console.error('<error> mood.getLikedMoodsByUser ', err);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while retrieving liked moods',
                });
            }
        }
    }

    export default MoodController;

