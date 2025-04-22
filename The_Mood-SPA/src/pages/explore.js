import { ExploreLayout } from '../layouts/exploreLayout.js';
import axios from 'axios';
import { UserCard } from '../components/usercard.js';
import { Post } from '../components/post.js';
import { Repost } from '../components/repost.js';

export function renderExplorePage(container) {
    const mainContent = document.createElement('div');
    mainContent.className = 'home-page';

    mainContent.innerHTML = `
    <main class="explore-content">
        <div class="explore-search">
            <input type="text" placeholder="Search...">
            <img src="https://res.cloudinary.com/dw44z8kbk/image/upload/v1730560781/Search_smx52q.png" alt="Search Icon" class="explore-search-icon">
        </div>
        <h1 class="explore-label">Explore</h1>
        <h2 class="result">Results</h2>
        
        <div class="user-results"></div>
  
        <div class="hashtag-results"></div>
  
        <div class="post-results"></div>
    </main>
    `;

    const searchInput = mainContent.querySelector('input[type="text"]');
    const userResultsContainer = mainContent.querySelector('.user-results');
    const hashtagResultsContainer = mainContent.querySelector('.hashtag-results');
    const postResultsContainer = mainContent.querySelector('.post-results');

    searchInput.addEventListener('input', async (event) => {
        const query = event.target.value.trim();
        
        if (query.startsWith('@') && query.length > 1) {
            await searchUsers(query.slice(1), userResultsContainer);
        } else {
            userResultsContainer.innerHTML = '';
        }

        if (query.startsWith('#') && query.length > 1) {
            await searchHashtags(query.slice(1), hashtagResultsContainer);
        } else {
            hashtagResultsContainer.innerHTML = '';
        }

        if (!query.startsWith('@') && !query.startsWith('#') && query.length > 0) {
            await searchPostsAndUsers(query, postResultsContainer, userResultsContainer);
        } else {
            postResultsContainer.innerHTML = '';
        }
    });

    ExploreLayout(container, mainContent);
}

async function searchUsers(query, container) {
    try {
        const response = await axios.get(`http://localhost:3000/v1/account/search/users?q=${query}`, {
            headers: {
                'token': localStorage.getItem('token'),
                'apikey': '{public_key}'
            }
        });

        container.innerHTML = '';

        if (Array.isArray(response.data.users)) {

            response.data.users.forEach(user => {
                const userCard = UserCard({
                    userId: user.id,
                    username: user.username,
                    profileImage: user.profileImage,
                    fullname: user.fullname,
                    followBack: user.followBack
                }, (userId) => {
                    console.log(`Follow state changed for user ID: ${userId}`);
                });
                console.log('followBack', user.following)
                container.appendChild(userCard);
            });
        } else {
            console.error('Unexpected response format:', response.data);
            alert('No users found or an error occurred.');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('An error occurred while searching for users.');
    }
}

async function searchHashtags(query, container) {
    try {
        const response = await axios.get(`http://localhost:3000/v1/moods/hashtag/${query}`, {
            headers: {
                'token': localStorage.getItem('token'),
                'apikey': '{public_key}'
            }
        });

        // Clear previous results
        container.innerHTML = '';

        if (response.data.success && Array.isArray(response.data.data.moods)) {
            response.data.data.moods.forEach(mood => {
                const moodData = {
                    username: mood.user.username,
                    content: mood.moodContent,
                    likeCount: mood.likeCount,
                    likers: mood.likedUsers,
                    postId: mood.moodId,
                    userprofileimage: mood.user.profileImage,
                    originalpostId: mood.originalMoodId,
                    originalusername: mood.originalAuthor ? mood.originalAuthor.username : null,
                    originalprofileimage: mood.originalAuthor ? mood.originalAuthor.profileImage : null
                };

                const moodComponent = mood.originalAuthor ? 
                    Repost(moodData) : 
                    Post(moodData);

                container.appendChild(moodComponent);
            });
        } else {
            console.error('Unexpected response format:', response.data);
            alert('No moods found or an error occurred.');
        }
    } catch (error) {
        console.error('Error fetching moods:', error);
        alert('An error occurred while searching for moods.');
    }
}

async function searchPostsAndUsers(query, postContainer, userContainer) {
    try {
        const response = await axios.get(`http://localhost:3000/v1/moods/search?q=${query}`, {
            headers: {
                'token': localStorage.getItem('token'),
                'apikey': '{public_key}'
            }
        });

        // Clear previous results
        postContainer.innerHTML = '';
        userContainer.innerHTML = '';

        if (response.data.success) {
            console.log('response',)
            // Render posts
            if (Array.isArray(response.data.data.posts)) {
                response.data.data.posts.forEach(post => {
                    console.log('Post Content', post.followBack);
                    const postData = {
                        username: post.username,
                        userId: post.user_id,
                        content: post.content,
                        likeCount: post.likeCount || 0,
                        likers: post.likedUsers || [],
                        postId: post.id,
                        userprofileimage: post.profile_image,
                        originalpostId: post.original_mood_id,
                        originalusername: post.original_mood_author ? post.original_mood_author.username : null,
                        originalprofileimage: post.original_mood_author ? post.original_mood_author.profile_image : null
                    };

                    const postComponent = post.original_mood_author ? 
                        Repost(postData) : 
                        Post(postData);

                    postContainer.appendChild(postComponent);
                });
            }

            // Render users
            if (Array.isArray(response.data.data.users)) {
                response.data.data.users.forEach(user => {
                    const userCard = UserCard(user, (userId) => {
                        console.log(`Follow state changed for user ID: ${userId}`);
                    });
                    userContainer.appendChild(userCard);
                });
            }
        } else {
            console.error('Unexpected response format:', response.data);
            alert('No posts or users found or an error occurred.');
        }
    } catch (error) {
        console.error('Error fetching posts and users:', error);
        alert('An error occurred while searching for posts and users.');
    }
}