import axios from 'axios';

export function UserCard(user, onFollowToggle) {
    const defaultProfilePicture = '../icons/default.png';

    const card = document.createElement('div');
    card.className = 'user-result';
    
    // Ensure the profile image is correctly formatted
    const profileImage = user.profileImage ? user.profileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/') : defaultProfilePicture;

    const buttonText = user.followBack ? 'Unfollow' : 'Follow';

    card.innerHTML = `
        <img src="${profileImage}" alt="${user.username}'s profile picture" class="user-avatar">
        <div class="user-info">
            <h3 class="user-name">${user.fullname || user.username}</h3>
            <div class="user-details">
                <p class="user-username">@${user.username}</p>
            </div>
            <div class="follow-button-div">
                <button class="follow-button" data-user-id="${user.userId || user.id}">
                    ${buttonText}
                </button>
            </div>
        </div>
    `;

    const followButton = card.querySelector('.follow-button');
    followButton.addEventListener('click', async () => {
        const userId = user.userId || user.id; 
        const payload = { followeeId: userId };

        try {
            if (user.followBack) {
                await axios.post('http://localhost:3000/v1/account/unfollow', payload, {
                    headers: {
                        'token': localStorage.getItem('token'),
                        'apikey': '{public_key}',
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post('http://localhost:3000/v1/account/follow', payload, {
                    headers: {
                        'token': localStorage.getItem('token'),
                        'apikey': '{public_key}',
                        'Content-Type': 'application/json'
                    }
                });
            }

            user.followBack = !user.followBack; // Toggle the followBack state
            followButton.textContent = user.followBack ? 'Unfollow' : 'Follow'; // Update button text
            followButton.classList.toggle('following', user.followBack); // Optionally toggle a class for styling
            onFollowToggle(userId); // Notify parent component
        } catch (error) {
            console.error('Error toggling follow state:', error);
            alert('An error occurred while trying to follow/unfollow the user.');
        }
    });

    return card;
}