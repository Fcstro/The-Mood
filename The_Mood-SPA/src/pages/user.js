import axios from 'axios'; // Import Axios
import { UserLayout } from '../layouts/userLayout.js';
import { Post } from '../components/post.js';
import { Repost } from '../components/repost.js'; // Import the Repost component
import { createUserModal } from '../components/user-modal.js'; // Import the modal

export function renderUserPage(container) {
    const mainContent = document.createElement('div');
    mainContent.className = 'user-profile';
    
    mainContent.innerHTML = `
        <div class="user-profile-header">
            <div class="user-cover-image">
                <img src="https://via.placeholder.com/300" alt="Header Pic" class="header-pic" id="header-pic-display">
            </div>
            <div class="user-profile-info">
                <img src="https://via.placeholder.com/300" alt="Profile Pic" class="profile-pic" id="profile-pic-display">
                    <div class="user-profile-details">
                        <h2 id="name-display">Loading...</h2>
                        <p id="username-display">Loading...</p>
                        <div class="user-follow-stats">
                            <span id="following-count">Loading...</span>
                            <span id="followers-count">Loading...</span>
                        </div>
                </div>
                <button class="user-edit-profile">Edit Profile</button>
            </div>
        </div>
    `;

    // Fetch user profile data
    fetchUserProfile(mainContent);
    fetchUserMoods(mainContent); // Fetch user moods

    // Handle the Edit Profile button click
    const editProfileButton = mainContent.querySelector('.user-edit-profile');
    editProfileButton.addEventListener('click', () => {
        createUserModal((username, profilePic) => {
            if (username) {
                mainContent.querySelector('#username-display').textContent = username;
            }
            if (profilePic) {
                mainContent.querySelector('#profile-pic-display').src = profilePic;
            }
            // Reload the user layout and refetch the moods
            reloadUserPage(container);
        }, fetchUserProfile, mainContent);
    });

    // Use the UserLayout function to render the page
    UserLayout(container, mainContent);
}

async function fetchUserProfile(mainContent) {
    try {
        const response = await axios.get('http://localhost:3000/v1/account/profile', {
            headers: {
                'apikey': '{public_key}',
                'token': localStorage.getItem('token') // Assuming you store the token in localStorage
            }
        });
        console.log('fetchUserProfile');

        const data = response.data;
        console.log("dataa",data)
        //profile-pic
        //################################################
        const defaultProfilePicture = 'icons/default.png';
        const profileImage = data.data.profileImage;
        let profileOutput = '';
        if (profileImage) {
            profileOutput = profileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/');
        }
        const profileImageSrc = profileImage && profileImage !== 'null' 
            ? profileOutput 
            : defaultProfilePicture;


        //header-pic
        //################################################
        const defaultHeaderPicture = 'icons/headerDefault.png';
        const headerImage = data.data.headerImage;
        let headerOutput = '';
        if (headerImage) {
            headerOutput = headerImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/');
        }
        const headerImageSrc = headerImage && headerImage !== 'null' 
            ? headerOutput 
            : defaultHeaderPicture;

        if (data.success) {
            const user = data.data;
            const at = '@';
            mainContent.querySelector('#name-display').textContent = user.fullname;
            mainContent.querySelector('#username-display').textContent = at.concat(user.username);
            mainContent.querySelector('#profile-pic-display').src = profileImageSrc;
            mainContent.querySelector('#header-pic-display').src = headerImageSrc;
            mainContent.querySelector('#following-count').textContent = `${user.following} Following`;
            mainContent.querySelector('#followers-count').textContent = `${user.followers} Followers`;
        } else {
            console.error(response.data.message);
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}

async function fetchUserMoods(mainContent) {
    const loggedInUserId = localStorage.getItem('userId'); 
    try {
        const response = await axios.get(`http://localhost:3000/v1/moods?userId=${loggedInUserId}`, {
            headers: {
                'apikey': '{public_key}',
                'token': localStorage.getItem('token')
            }
        });

        if (response.data.success) {
            const moods = response.data.data;
            moods.forEach(mood => {
                const moodElement = mood.originalMoodAuthor 
                    ? Repost({
                        username: mood.user.username,
                        userprofileimage: mood.user.profileImage,
                        originalusername: mood.originalMoodAuthor.username,
                        originalprofileimage: mood.originalMoodAuthor.profileImage,
                        originalpostId: mood.original_mood_id,
                        content: mood.content,
                        likeCount: mood.likeCount || 0,
                        likers: mood.likers || [],
                        postId: mood.id,
                        onLike: () => console.log(`${mood.user.username} liked/unliked the repost`),
                        onComment: () => console.log(`${mood.user.username} commented on the repost`),
                        onDelete: () => console.log(`${mood.user.username} deleted the repost`),
                    })
                    : Post({
                        username: mood.user.username,
                        userprofileimage: mood.user.profileImage,
                        content: mood.content,
                        likeCount: mood.likeCount || 0,
                        likers: mood.likers || [],
                        postId: mood.id,
                        onLike: () => console.log(`${mood.user.username} liked/unliked the post`),
                        onComment: () => console.log(`${mood.user.username} commented on the post`),
                        onDelete: () => console.log(`${mood.user.username} deleted the post`),
                    });
                mainContent.appendChild(moodElement);
            });
        } else {
            console.error(response.data.message);
        }
    } catch (error) {
        console.error('Error fetching user moods:', error);
    }
}

function reloadUserPage(container) {
    // Clear the container
    container.innerHTML = '';

    // Re-render the user page
    renderUserPage(container);
}