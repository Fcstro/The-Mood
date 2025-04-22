// components/Post.js
import { CommentModal } from './comment-modal.js';
import axios from 'axios';

export function Post({ 
    username, 
    content, 
    likeCount, 
    likers = [], 
    postId, 
    userprofileimage, 
    onLike = () => {}, 
    onRemood = () => {}, 
    onDelete = () => {} 
}) {
    const postContainer = document.createElement('div');
    postContainer.className = 'post';
    const defaultProfilePicture = 'icons/default.png';

    const profileImage = userprofileimage;
    let profileOutput = '';
    if (profileImage) {
        profileOutput = profileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/');
    }

    const profileImageSrc = profileImage && profileImage !== 'null' 
        ? profileOutput 
        : defaultProfilePicture;

    // Initialize counts and state
    let likes = likeCount || 0;
    let isLiked = likers.some(liker => liker.id === parseInt(localStorage.getItem('userId'))) || false; 

    postContainer.innerHTML = `
        <div class="mood-holder">
            <div class="mood-header">
                <img src="${profileImageSrc}" alt="${username}'s profile picture" class="post-user-pic">
                <span class="mood-username">${username}</span>
                <div class="post-actions">
                    <button class="nav-btn" id="nav-toggle">⋮</button> 
                    <div class="nav-menu" id="nav-menu">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                    </div>
                </div>
            </div>
            <div class="mood-content">
                <textarea disabled>${content}</textarea>
                <button class="save-btn" style="display: none;" disabled>Save</button>
                <button class="cancel-btn" style="display: none;">Cancel</button>
            </div>
            <footer class="mood-actions">
                <button class="like-btn">
                    <img src="${isLiked ? '/icons/heart.png' : '/icons/no-heart.png'}" alt="Like" class="like-icon">
                    <span class="likes-count">${likes}</span>
                </button>
                <button class="comment-btn">Comment <span class="comments-count"></span></button>
                <button class="remood-btn">
                    <img src="/icons/remood.png" alt="Re-Mood" class="remood-icon">
                </button>
            </footer>
        </div>
    `;

    // Toggle navigation menu
    const navToggle = postContainer.querySelector('#nav-toggle');
    const navMenu = postContainer.querySelector('#nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Edit button logic
    const textarea = postContainer.querySelector('textarea');
    const saveButton = postContainer.querySelector('.save-btn');
    const cancelButton = postContainer.querySelector('.cancel-btn');

    postContainer.querySelector('.edit-btn').addEventListener('click', () => {
        textarea.disabled = false; // Enable the textarea
        saveButton.style.display = 'inline-block'; // Show the save button
        cancelButton.style.display = 'inline-block'; // Show the cancel button
        textarea.focus(); // Focus on the textarea
    });

    // Enable/disable save button based on textarea content
    textarea.addEventListener('input', () => {
        saveButton.disabled = textarea.value.trim() === ''; // Disable if empty
    });

    // Save button logic
    saveButton.addEventListener('click', async () => {
        const updatedContent = textarea.value; // Get the updated content

        // Show confirmation dialog
        const confirmSave = confirm("Save Change/s?");
        if (!confirmSave) {
            return; // If the user clicks "No", exit the function
        }

        try {
            await axios.put(`http://localhost:3000/v1/moods/${postId}`, { content: updatedContent }, {
                headers: {
                    'apikey': '{ public_key}',
                    'token': localStorage.getItem('token')
                }
            });
            content = updatedContent; // Update the content variable
            textarea.disabled = true; // Disable the textarea
            saveButton.style.display = 'none'; // Hide the save button
            cancelButton.style.display = 'none'; // Hide the cancel button
            textarea.value = content; // Reset the textarea to the updated content
        } catch (error) {
            console.error('Error updating the post:', error);
        }
    });

    // Cancel button logic
    cancelButton.addEventListener('click', () => {
        textarea.disabled = true; // Disable the textarea
        saveButton.style.display = 'none'; // Hide the save button
        cancelButton.style.display = 'none'; // Hide the cancel button
        textarea.value = content; // Reset the textarea to the original content
    });

    // Delete button logic
    postContainer.querySelector('.delete-btn').addEventListener('click', async () => {
        const confirmDelete = confirm('Are you sure you want to delete this post?');
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/v1/moods/${postId}`, {
                    headers: {
                        'apikey': '{public_key}',
                        'token': localStorage.getItem('token')
                    }
                });
                onDelete(); // Callback function for deleting the post
                postContainer.remove(); // Remove the post from the DOM
            } catch (error) {
                console.error('Error deleting the post:', error);
            }
        }
    });

    // Like button logic
    postContainer.querySelector('.like-btn').addEventListener('click', async () => {
        try {
            if (isLiked) {
                // Unlike the post
                await axios.post(`http://localhost:3000/v1/moods/${postId}/unlike`, {}, {
                    headers: {
                        'apikey': '{public_key}',
                        'token': localStorage.getItem('token')
                    }
                });
                likes -= 1;
            } else {
                // Like the post
                await axios.post(`http://localhost:3000/v1/moods/${postId}/like`, {}, {
                    headers: {
                        'apikey': '{public_key}',
                        'token': localStorage.getItem('token')
                    }
                });
                likes += 1;
            }
            isLiked = !isLiked; // Toggle like state
            updateHeartState(postContainer, isLiked); // Update the heart icon
            updateStats(postContainer); // Update counts
            onLike(); // Callback function
        } catch (error) {
            console.error('Error liking/unliking the post:', error);
        }
    });

    // Repost button logic
    postContainer.querySelector('.remood-btn').addEventListener('click', async () => {
        try {
            await axios.post(`http://localhost:3000/v1/moods/${postId}/remood`, {}, {
                headers: {
                    'apikey': '{public_key}',
                    'token': localStorage.getItem('token')
                }
            });
            alert('You reposted a mood'); // Show notification
            if (typeof onRemood === 'function') {
                onRemood(); // Callback function
            }
        } catch (error) {
            console.error('Error reposting the mood:', error);
        }
    });

    // Comment button logic
    postContainer.querySelector('.comment-btn').addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default action
        const currentUser   = {
            username: username,
            profilePic: profileImageSrc // Replace with the actual path to the profile picture
        };

        CommentModal(postId, () => {
            console.log('Comment modal closed Post');
        }, currentUser , async () => {
            console.log('Refreshing comments after new comment submission');
            // Fetch updated comments if needed
        });
    });

    function updateHeartState(container, liked) {
        const heartIcon = container.querySelector('.like-icon');
        heartIcon.src = liked ? '/icons/heart.png' : '/icons/no-heart.png';
        heartIcon.alt = liked ? 'Unlike' : 'Like';
    }

    function updateStats(container) {
        const likesCount = container.querySelector('.likes-count');
        likesCount.textContent = likes;
    }

    return postContainer;
}