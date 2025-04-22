import axios from 'axios';
import { HomepageLayout } from '../layouts/homeLayout.js';
import { Post } from '../components/post.js';
import { Repost } from '../components/repost.js';

const defaultProfilePicture = 'icons/default.png';

// Function to fetch profile image from the server
async function fetchProfileImage() {
    try {
        const response = await axios.get('http://localhost:3000/v1/account/profile', {
            headers: {
                'apikey': '{public_key}',
                'token': localStorage.getItem('token')
            }
        });

        if (response.data.success) {
            const rawProfileImage = response.data.data.profileImage;
            console.log("Raw profile image:", rawProfileImage);

            // Check if rawProfileImage is empty or undefined
            if (!rawProfileImage) {
                console.log("No profile image found, using default.");
                return defaultProfilePicture; // Return default if empty
            }

            // Process the raw profile image path
            let output = rawProfileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/');
            console.log("Processed profile image path:", output);

            return output;
        } else {
            console.error('Failed to fetch profile data:', response.data);
            return defaultProfilePicture; // Return default if API call fails
        }
    } catch (error) {
        console.error('Error fetching profile image:', error);
        return defaultProfilePicture; // Return default on error
    }
}

export async function renderHomePage(container) {
    container.innerHTML = ''; 
    const mainContent = document.createElement('div');
    mainContent.className = 'home-page';

    // Fetch profile image
    const profileImageSrc = await fetchProfileImage();

    mainContent.innerHTML = `
    <header class="tabs">
        <button class="active" id="for-you-tab">For you</button>
        <button id="following-tab">Following</button>
    </header>

    <div class="post-box">
        <img src="${profileImageSrc}" alt="Profile Picture" class="avatar">
        <textarea id="mood-textarea" placeholder="Want to share your Mood?..." rows="6" cols="4"></textarea>
        <footer>
            <button class="mood-btn" id="post-mood-btn">
                <img src="/icons/mood.png" alt="Re-Mood">
                <p>Post Mood</p>
            </button>
        </footer>
    </div>
    <div id="posts-container"></div>
    <button id="back-to-top" class="back-to-top">
        <img src="/icons/mood.png" alt="Back to Top" class="img-to-top">
        <p>Back to Top </p>
    </button>`;

    // Add event listeners for tab switching
    const forYouTab = mainContent.querySelector('#for-you-tab');
    const followingTab = mainContent.querySelector('#following-tab');

    forYouTab.addEventListener('click', (event) => {
        event.preventDefault();
        forYouTab.classList.add('active');
        followingTab.classList.remove('active');
        resetPosts();
        fetchForYouPosts(); // Fetch and display "For you" content
    });

    followingTab.addEventListener('click', (event) => {
        event.preventDefault();
        followingTab.classList.add('active');
        forYouTab.classList.remove('active');
        resetPosts();
        fetchFollowingPosts(); // Fetch and display "Following" content
    });

    // Add event listener for posting mood
    const postMoodButton = mainContent.querySelector('#post-mood-btn');
    const moodTextarea = mainContent.querySelector('#mood-textarea');

    postMoodButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default button behavior
        const moodText = moodTextarea.value.trim();

        if (moodText) {
            const token = localStorage.getItem('token'); // Retrieve the token
            if (!token) {
                alert('You need to be logged in to post a mood.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:3000/v1/moods/', {
                    content: moodText
                }, {
                    headers: {
                        'token': `${token}`,
                        'apikey': '{public_key}'
                    }
                });
                console.log('Mood posted successfully:', response.data);
                alert('Mood successfully posted!'); // Alert for successful posting
                moodTextarea.value = ''; // Clear the textarea after posting
                fetchForYouPosts(); // Refresh posts
            } catch (error) {
                console.error('Error posting mood:', error);
                alert('Failed to post mood. Please try again.'); // Alert for error
            }
        } else {
            alert('Please enter a mood before posting.');
        }
    });

    // Add event listener for infinite scrolling
    window.addEventListener('scroll', handleScroll);

    // Add event listener for back to top button
    const backToTopButton = mainContent.querySelector('#back-to-top');
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let currentPage = 1;
    let loading = false;

    // Function to reset posts and pagination
    function resetPosts() {
        currentPage = 1;
        loading = false;
        const postsContainer = mainContent.querySelector('#posts-container');
        postsContainer.innerHTML = ''; // Clear existing posts
    }

    // Function to fetch and display "For you" posts
    async function fetchForYouPosts() {
        if (loading) return;
        loading = true;

        try {
            const response = await axios.get('http://localhost:3000/v1/moods/for-you', {
                headers: {
                    'apikey': '{public_key}',
                    'token': localStorage.getItem('token')
                },
                params: {
                    page: currentPage
                }
            });
            displayPosts(response.data.data);
            loading = false;
            currentPage++;
        } catch (error) {
            console.error('Error fetching "For You" posts:', error);
          
            loading = false;
        }
    }

    // Function to fetch and display "Following" posts
    async function fetchFollowingPosts() {
        if (loading) return;
        loading = true;

        try {
            const response = await axios.get('http://localhost:3000/v1/moods/following-feed', {
                headers: {
                    'apikey': '{public_key}',
                    'token': localStorage.getItem('token')
                },
                params: {
                    page: currentPage
                }
            });
            displayPosts(response.data.data);
            loading = false;
            currentPage++;
        } catch (error) {
            console.error('Error fetching "Following" posts:', error);
            
            loading = false;
        }
    }

    // Function to display posts in the posts container
    function displayPosts(posts) {
        const postsContainer = mainContent.querySelector('#posts-container');

        posts.forEach(mood => {
            if (mood.originalMoodId) {
                // Render as Repost
                const repost = Repost({
                    username: mood.user.username,
                    content: mood.moodContent,
                    likeCount: mood.likeCount,
                    likers: mood.likedUsers,
                    postId: mood.moodId,
                    userprofileimage: mood.user.profileImage,
                    originalprofileimage: mood.originalAuthor.profile_image,
                    originalpostId: mood.originalMoodId,
                    originalusername: mood.originalAuthor.username
                });
                postsContainer.appendChild(repost);
            } else {
                // Render as Post
                const post = Post({
                    username: mood.user.username,
                    content: mood.moodContent,
                    likeCount: mood.likeCount,
                    likers: mood.likedUsers,
                    postId: mood.moodId,
                    userprofileimage: mood.user.profileImage
                });
                postsContainer.appendChild(post);
            }
        });
    }

    // Function to handle infinite scrolling
    function handleScroll() {
        const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
        const pageHeight = document.documentElement.scrollHeight;

        if (scrollPosition >= pageHeight - 100) { // Adjust the threshold as needed
            const activeTab = mainContent.querySelector('.tabs button.active');
            if (activeTab.id === 'for-you-tab') {
                fetchForYouPosts();
            } else if (activeTab.id === 'following-tab') {
                fetchFollowingPosts();
            }
        }

        // Show/hide back to top button
        const backToTopButton = mainContent.querySelector('#back-to-top');
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Fetch "For you" posts on initial load
    fetchForYouPosts();

    // Use the HomepageLayout function to render the page
    HomepageLayout(container, mainContent);
}