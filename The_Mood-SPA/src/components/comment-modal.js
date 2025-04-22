// components/CommentModal.js
import axios from "axios";

export function CommentModal(postId, onClose, currentUser  , refreshComments) {
    const modal = document.createElement('div');
    modal.className = 'comment-modal';
    modal.innerHTML = `
        <div class="comment-modal-content">
            <span class="comment-close-button">&times;</span>
            <h2>Comments</h2>
            <div id="comments-list" class="comments-list"></div>
            <textarea id="comment-input" placeholder="Add a comment..."></textarea>
            <button class="submit-comment" id="submit-comment">Submit</button>
        </div>
    `;

    const closeButton = modal.querySelector('.comment-close-button');
    const submitButton = modal.querySelector('#submit-comment');
    const commentsList = modal.querySelector('#comments-list');
    const commentInput = modal.querySelector('#comment-input');

    async function fetchComments() {
        try {
            const response = await axios.get(`http://localhost:3000/v1/moods/${postId}/comments`, {
                headers: {
                    'apikey': '{public_key}',
                    'token': localStorage.getItem('token')
                }
            });

            if (response.data.success) {
                const comments = response.data.data;
                commentsList.innerHTML = ''; // Clear existing comments
                comments.reverse().forEach(comment => {
                    const commentElement = createCommentElement(comment);
                    commentsList.appendChild(commentElement);
                });
            } else {
                console.error('Error fetching comments:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    }

    fetchComments();

    closeButton.addEventListener('click', () => {
        modal.remove();
        onClose();
    });

    submitButton.addEventListener('click', async () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            try {
                const newCommentData = {
                    content: commentText,
                    user: currentUser  ,
                    liker: [],
                    likeCount: 0,
                    usersWhoLiked: [],
                    replies: []
                };

                const response = await axios.post(`http://localhost:3000/v1/moods/${postId}/comments`, newCommentData, {
                    headers: {
                        'apikey': '{public_key}',
                        'token': localStorage.getItem('token')
                    }
                });

                await fetchComments();

                commentInput.value = ''; // Clear the input
                commentsList.scrollTop = commentsList.scrollHeight; // Scroll to the bottom
            } catch (error) {
                console.error('Error adding the comment:', error.response ? error.response.data : error.message);
            }
        }
    });

    function createCommentElement(comment) {
        const { id, content, user = {}, likeCount: initialLikeCount, usersWhoLiked = [], replies = [] } = comment;
        const commentElement = document.createElement('div');
        let isLiked = usersWhoLiked.some(liker => liker.id === parseInt(localStorage.getItem('userId')));
        let likeCount = initialLikeCount || 0;
        const defaultProfilePicture = 'icons/default.png';

        const profileImage = user.profileImage || defaultProfilePicture;
        const profileImageSrc = profileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/');

        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <img src="${profileImageSrc}" alt="${user.username ? user.username : 'User  '}'s profile picture" class="comment-profilepic">
                <span class="comment-username">${user.username ? user.username : 'Unknown User'}</span>
            </div>
            <p>${content}</p>
            <div class="comment-actions">
                <button class="like-btn">
                    <img src="${isLiked ? '/icons/heart.png' : '/icons/no-heart.png'}" alt="Like" class="like-icon">
                    <span class="likes-count">${likeCount}</span>
                </button>
                <button class ="reply-btn">Reply</button>
            </div>
            <div class="replies-list"></div>
        `;

        // Handle replies
        const repliesList = commentElement.querySelector('.replies-list');
        // Reverse replies to show the newest at the bottom
        replies.reverse().forEach(reply => {const replyElement = createReplyElement(reply);
            repliesList.appendChild(replyElement);
        });

        // Add event listener for the like button
        commentElement.querySelector('.like-btn').addEventListener('click', async () => {
            try {
                if (isLiked) {
                    await axios.post(`http://localhost:3000/v1/moods/${postId}/comments/${id}/unlike`, {}, {
                        headers: {
                            'apikey': '{public_key}',
                            'token': localStorage.getItem('token')
                        }
                    });
                    likeCount -= 1;
                } else {
                    await axios.post(`http://localhost:3000/v1/moods/${postId}/comments/${id}/like`, {}, {
                        headers: {
                            'apikey': '{public_key}',
                            'token': localStorage.getItem('token')
                        }
                    });
                    likeCount += 1;
                }
                isLiked = !isLiked;
                updateHeartState(commentElement, isLiked);
                updateStats(commentElement, likeCount);
            } catch (error) {
                console.error('Error liking/unliking the comment:', error.response ? error.response.data : error.message);
            }
        });

        // Add event listener for the reply button
        commentElement.querySelector('.reply-btn').addEventListener('click', async () => {
            const replyText = prompt("Enter your reply:");
            if (replyText) {
                const newReplyData = {
                    content: replyText,
                    user: currentUser ,
                    parentCommentId: id,
                    likeCount: 0,
                    usersWhoLiked: []
                };
                try {
                    await axios.post(`http://localhost:3000/v1/moods/${postId}/comments`, newReplyData, {
                        headers: {
                            'apikey': '{public_key}',
                            'token': localStorage.getItem('token')
                        }
                    });
                    await fetchComments();
                    const newReplyElement = createReplyElement(newReplyData);
                    repliesList.appendChild(newReplyElement); // Append new reply at the end
                } catch (error) {
                    console.error('Error adding the reply:', error.response ? error.response.data : error.message);
                }
            }
        });

        return commentElement;
    }

    function createReplyElement(reply) {
        const { content, user, likeCount: initialLikeCount = 0, usersWhoLiked = [] } = reply;
        const replyElement = document.createElement('div');
        let isLiked = usersWhoLiked.some(liker => liker.id === parseInt(localStorage.getItem('userId')));
        let likes = initialLikeCount;
        const defaultProfilePicture = 'icons/default.png';

        const profileImage = user.profileImage || defaultProfilePicture;
        const profileImageSrc = profileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/');

        replyElement.className = 'reply';
        replyElement.innerHTML = `
            <div class="reply-header">
                <img src="${profileImageSrc}" alt="${user.username}'s profile picture" class="reply-profilepic">
                <span class="reply-username">${user.username}</span>
            </div>
            <p>${content}</p>
            <div class="reply-actions">
                <button class="like-btn">
                    <img src="${isLiked ? '/icons/heart.png' : '/icons/no-heart.png'}" alt="Like" class="like-icon">
                    <span class="likes-count">${likes}</span>
                </button>
            </div>
        `;

        replyElement.querySelector('.like-btn').addEventListener('click', async () => {
            try {
                if (isLiked) {
                    await axios.post(`http://localhost:3000/v1/moods/${postId}/comments/${reply.id}/unlike`, {}, {
                        headers: {
                            'apikey': '{public_key}',
                            'token': localStorage.getItem('token')
                        }
                    });
                    likes -= 1;
                } else {
                    await axios.post(`http://localhost:3000/v1/moods/${postId}/comments/${reply.id}/like`, {}, {
                        headers: {
                            'apikey': '{public_key}',
                            'token': localStorage.getItem('token')
                        }
                    });
                    likes += 1;
                }
                isLiked = !isLiked;
                updateHeartState(replyElement, isLiked);
                updateStats(replyElement, likes);
            } catch (error) {
                console.error('Error liking/unliking the reply:', error);
            }
        });

        return replyElement;
    }

    function updateHeartState(container, liked) {
        const heartIcon = container.querySelector('.like-icon');
        heartIcon.src = liked ? '/icons/heart.png' : '/icons/no-heart.png';
        heartIcon.alt = liked ? 'Unlike' : 'Like';
    }

    function updateStats(container, likes) {
        const likesCount = container.querySelector('.likes-count');
        if (likesCount) {
            likesCount.textContent = likes;
        }
    }

    document.body.appendChild(modal);
}