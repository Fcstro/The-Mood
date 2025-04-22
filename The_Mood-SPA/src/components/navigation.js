import axios from 'axios';

export async function Navigation(root, spa) {
    console.log("Rendering Navigation...");

    const defaultProfilePicture = 'icons/default.png';
    const token = localStorage.getItem('token'); // Assuming you have a token for authentication

    if (!token) {
        console.error('Token not found in localStorage');
        alert('Please log in again.');
        spa.redirect('/login');
        return;
    }

    // Function to fetch user profile data
    async function fetchUserProfile() {
        try {
            const response = await axios.get('http://localhost:3000/v1/account/profile', {
                headers: {
                    'token': token,
                    'apikey': '{public_key}' // Replace with your actual public key
                }
            });
            return response.data.data; // Assuming the data structure contains the user info
        } catch (error) {
            console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                spa.redirect('/login');
            } else {
                alert('Failed to load profile data. Please try again later.');
            }
            return null; // Return null if there's an error
        }
    }

    // Fetch user profile data
    const userProfile = await fetchUserProfile();
    if (!userProfile) {
        return; // Exit if user profile could not be fetched
    }

    const profileImage = userProfile.profileImage || null;
    const fullname = userProfile.fullname || 'Guest';
    const username = userProfile.username || 'guest_username';

    let profileImageSrc = profileImage 
        ? profileImage.replace(/.*?\\uploads\\/, 'uploads/').replace(/\\/g, '/') 
        : defaultProfilePicture;

    root.innerHTML = `
        <a href="/" class="nav-link"><img src="https://res.cloudinary.com/dw44z8kbk/image/upload/v1730560781/Home_lebguq.png" alt="Home" class="nav-icon">Home</a>
        <a href="/explore" class="nav-link"><img src="https://res.cloudinary.com/dw44z8kbk/image/upload/v1730560781/Search_smx52q.png" alt="Explore" class="nav-icon">Explore</a>
        <a href="/followers" class="nav-link"><img src="https://res.cloudinary.com/dw44z8kbk/image/upload/v1730560781/Group_5_scq4z3.png" alt="Followers" class="nav-icon">Followers</a>
        <a href="/user" class="nav-link"><img src="https://res.cloudinary.com/dw44z8kbk/image/upload/v1730560781/person_u38h0w.png" alt="Profile" class="nav-icon">Profile</a>
        <a href="/settings" class="nav-link"><img src="https://res.cloudinary.com/dw44z8kbk/image/upload/v1730560781/Settings_xfd1qk.png" alt="Settings" class="nav-icon">Settings</a>
    
        <div class="profile">
            <img src="${profileImageSrc}" alt="Profile Picture" onerror="this.src='${defaultProfilePicture}';">
            <p class="name">${fullname}</p>
            <p class="username">@${username}</p>
        </div>
    `;

    const links = root.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const path = link.getAttribute('href');
            spa.redirect(path); 
        });
    });
}