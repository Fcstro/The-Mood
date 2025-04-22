import { UserCard } from '../components/usercard.js';
import { UserLayout } from '../layouts/userLayout.js';
import axios from 'axios';

export async function renderFollowerPage(container, spa) {
    const mainContent = document.createElement('div');
    mainContent.className = 'user-profile';

    mainContent.innerHTML = `
        <div class="follow-content">
            <div class="follow-main-content">
                <h2>Following</h2>
                <div class="follow-line"></div>
                <div id="following-list"></div>
                <h2>Followers</h2>
                <div class="follow-line"></div>
                <div id="followers-list"></div>
            </div>
        </div>
    `;

    UserLayout(container, mainContent);

    const token = localStorage.getItem('token');
    try {
        const followersResponse = await axios.get('http://localhost:3000/v1/account/followers', {
            headers: {
                'token': `${token}`,
                'apikey': '{public_key}'
            }
        });

        const followingResponse = await axios.get('http://localhost:3000/v1/account/following', {
            headers: {
                'token': `${token}`,
                'apikey': '{public_key}'
            }
        });

        const followersList = document.getElementById('followers-list');
        const followingList = document.getElementById('following-list');

        // Create a set of following user IDs for quick lookup
        const followingIds = new Set(followingResponse.data.following.map(user => user.id));

        // Populate followers
        followersResponse.data.followers.forEach(user => {
            const userCard = UserCard({ ...user, followBack: followingIds.has(user.id) }, async () => {
                await refreshData(); // Refresh UI on toggle
            });
            followersList.appendChild(userCard);
        });

        // Populate following
        followingResponse.data.following.forEach(user => {
            // All users in this list are followed by the current user
            const userCard = UserCard({ ...user, followBack: true }, async () => {
                await refreshData(); // Refresh UI on toggle
            });
            followingList.appendChild(userCard);
        });

        async function refreshData() {
            followersList.innerHTML = '';
            followingList.innerHTML = '';
            await renderFollowerPage(container, spa); // Reload the page to sync UI
        }
    } catch (error) {
        console.error('Error fetching followers or following:', error);
        alert('Failed to load followers or following data.');
    }
}