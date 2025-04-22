// user-modal.js
import axios from 'axios';

export function createUserModal(onSave,fetchUserProfile,mainContent) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Edit Profile</h2>
        <form id="edit-profile-form">
            <div> 
                <label for="profile-pic">Profile Picture:</label>
                <br>
                <input type="file" id="profile-pic" accept="image/*">
                <button type="button" class="profile-delete-btn" id="delete-profile">Delete</button>
                <div id="profile-pic-buttons" style="display: none;" class="button-container">
                    <button type="button" class="profile-save-btn" id="save-profile-pic">Save</button>
                    <button type="button" class="profile-cancel-btn" id="cancel-profile-pic">Cancel</button>
                </div>
            </div>
            <br>
            <div> 
                <label for="profile-header">Profile Header:</label>
                <br>
                <input type="file" id="profile-header" accept="image/*">
                <button type="button" class="profile-delete-btn" id="delete-header">Delete</button>
                <div id="profile-header-buttons" style="display: none;" class="button-container">
                    <button type="button" class="profile-save-btn" id="save-profile-header">Save</button>
                    <button type="button" class="profile-cancel-btn" id="cancel-profile-header">Cancel</button>
                </div>
            </div>
        </form>
    </div>
`;

    document.body.appendChild(modal); // Append modal to the body first

    const closeButton = modal.querySelector('.close-button');
    const profilePicInput = modal.querySelector('#profile-pic');
    const profileHeaderInput = modal.querySelector('#profile-header');
    const profilePicButtons = modal.querySelector('#profile-pic-buttons');
    const profileHeaderButtons = modal.querySelector('#profile-header-buttons');

    // Close modal
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    // Show Save and Cancel buttons when a file is selected for Profile Picture
    profilePicInput.addEventListener('change', () => {
        profilePicButtons.style.display = profilePicInput.files.length > 0 ? 'block' : 'none';
    });

    // Show Save and Cancel buttons when a file is selected for Profile Header
    profileHeaderInput.addEventListener('change', () => {
        profileHeaderButtons.style.display = profileHeaderInput.files.length > 0 ? 'block' : 'none';
    });

    // Check if buttons exist before adding event listeners
    const cancelProfilePicButton = profilePicButtons.querySelector('#cancel-profile-pic');
    if (cancelProfilePicButton) {
        cancelProfilePicButton.addEventListener('click', () => {
            profilePicInput.value = '';
            profilePicButtons.style.display = 'none';
        });
    }

    const cancelProfileHeaderButton = profileHeaderButtons.querySelector('#cancel-profile-header');
    if (cancelProfileHeaderButton) {
        cancelProfileHeaderButton.addEventListener('click', () => {
            profileHeaderInput.value = '';
            profileHeaderButtons.style.display = 'none';
        });
    }


    // Save Profile Picture
    const saveProfilePicButton = profilePicButtons.querySelector('#save-profile-pic');
    if (saveProfilePicButton) {
        saveProfilePicButton.addEventListener('click', async () => {
            const file = profilePicInput.files[0];
            if (file) {
                const confirmSave = window.confirm("Are you sure you want to save the profile picture?");
                if (confirmSave) {
                    const formData = new FormData();
                    formData.append('profileImage', file);

                    try {
                        const response = await axios.put('http://localhost:3000/v1/account/profile-image', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'token': localStorage.getItem('token'),
                                'apikey':'{public_key}'
                            }
                        });
                        if (response.data.success) {
                            onSave('profile-pic', response.data.data.profileImagePath);
                            fetchUserProfile(mainContent);
                            alert('Profile picture saved successfully!');
                            modal.remove();
                        } else {
                            alert('Failed to save profile picture: ' + response.data.message);
                        }
                    } catch (error) {
                        console.error('Error saving profile picture:', error);
                        alert('An error occurred while saving the profile picture.');
                    }
                }
            }
            profilePicButtons.style.display = 'none';
        });
    }

    // Save Profile Header
    const saveProfileHeaderButton = profileHeaderButtons.querySelector('#save-profile-header');
    if (saveProfileHeaderButton) {
        saveProfileHeaderButton.addEventListener('click', async () => {
            const file = profileHeaderInput.files[0];
            if (file) {
                const confirmSave = window.confirm("Are you sure you want to save the profile header?");
                if (confirmSave) {
                    const formData = new FormData();
                    formData.append('headerImage', file);

                    try {
                        const response = await axios.put('http://localhost:3000/v1/account/header-image', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'token': localStorage.getItem('token'),
                                'apikey':'{public_key}'
                            }
                        });
                        if (response.data.success) {
                            onSave('profile-header', response.data.data.headerImagePath);
                            fetchUserProfile(mainContent);
                            alert('Profile header saved successfully!');
                            modal.remove();
                        } else {
                            alert('Failed to save profile header: ' + response.data.message);
                        }
                    } catch (error) {
                        console.error('Error saving profile header:', error);
                        alert('An error occurred while saving the profile header.');
                    }
                }
            }
            profileHeaderButtons.style.display = 'none';
        });
    }

        // Delete Profile Picture
        const deleteProfilePicButton = modal.querySelector('#delete-profile');
        if (deleteProfilePicButton) {
            deleteProfilePicButton.addEventListener('click', async () => {
                console.log("Delete Profile Picture button clicked");
                const confirmDelete = window.confirm("Are you sure you want to delete the profile picture?");
                if (confirmDelete) {
                    console.log("Confirmed deletion");
                    try {
                        const response = await axios.delete('http://localhost:3000/v1/account/profile-image', {
                            headers: {
                                'token': localStorage.getItem('token'),
                                'apikey':'{public_key}'
                            }
                        });
                        console.log("Response from server:", response.data);
                        if (response.data.success) {
                            onSave('profile-pic', null);
                            fetchUserProfile(mainContent);
                            alert('Profile picture deleted successfully!');
                            modal.remove();
                        } else {
                            alert('Failed to delete profile picture: ' + response.data.message);
                        }
                    } catch (error) {
                        console.error('Error deleting profile picture:', error.response ? error.response.data : error);
                        alert('An error occurred while deleting the profile picture.');
                    }
                } else {
                    console.log("Deletion canceled");
                }
            }); // <-- Closing brace added here
        }

        // Delete Profile Header
        const deleteProfileHeaderButton = modal.querySelector('#delete-header');
        if (deleteProfileHeaderButton) {
            deleteProfileHeaderButton.addEventListener('click', async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete the profile header?");
                if (confirmDelete) {
                    try {
                        const response = await axios.delete('http://localhost:3000/v1/account/header-image', {
                            headers: {
                                'token': localStorage.getItem('token'),
                                'apikey':'{public_key}'
                            }
                        });
                        if (response.data.success) {
                            onSave('profile-header', null);
                            fetchUserProfile(mainContent);
                            alert('Profile header deleted successfully!');
                            modal.remove();
                        } else {
                            alert('Failed to delete profile header: ' + response.data.message);
                        }
                    } catch (error) {
                        console.error('Error deleting profile header:', error);
                        alert('An error occurred while deleting the profile header.');
                    }
                }
            });                                     
        }
}
