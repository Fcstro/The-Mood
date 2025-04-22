Here’s a refined version of the README.md with corrected formatting and consistency:


# The Mood API

Welcome to The Mood API documentation! This API allows users to create and share short messages called "Moods" with their followers. It includes features for creating, reading, updating, and deleting Moods, following and unfollowing users, liking and commenting on Moods, and retrieving user timelines and profiles. The API is secured with JSON Web Tokens (JWT) for authentication and authorization.

---


## Developed By:
- Castro, Fredderico  
- Concepcion, Paul Dexter  
- Caincoy, Cristian  
- Alvarez, John Dexter  
- Chica, Ralp Clarence  

---

## Account Endpoints

### 1. Create Account
- **Method:** `POST`
- **Endpoint:** `/account`
- **Description:** Create a new user account.
- **Request Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "recordIndex": 1
    }
  }
  ```

### 2. Login
- **Method:** `POST`
- **Endpoint:** `/account/login`
- **Description:** Authenticate a user and return a JWT token.
- **Request Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "identifier": "string", // username or email
    "password": "string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "token": "jwt_token",
      "userId": 1,
      "username": "string",
      "profileImage": "string"
    }
  }
  ```

### 3. Get Profile
- **Method:** `GET`
- **Endpoint:** `/account/profile`
- **Description:** Retrieve the authenticated user's profile information.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "username": "string",
      "fullname": "string",
      "profileImage": "string",
      "headerImage": "string",
      "followers": 10,
      "following": 5
    }
  }
  ```
### 4. Reset Password
- **Method:** `POST`
- **Endpoint:** `/account/password/forget`
- **Description:** Send a password reset email to the user.
- **Request Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
### 5. Update Profile
- **Method:** `PUT`
- **Endpoint:** `/account`
- **Description:** Update the authenticated user's profile information.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "fullname": "string",
    "username": "string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "User profile updated successfully"
  }
  ```

### 6. Logout
- **Method:** `POST`
- **Endpoint:** `/account/logout`
- **Description:** Log out the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

  ```
### 7. Reset Password
- **Method:** `POST`
- **Endpoint:** `/account/password/reset`
- **Description:** Send a password reset email to the user.
- **Request Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Password reset email sent"
  }
  ```

### 8. Search Posts
- **Method:** `GET`
- **Endpoint:** `/account/search/users?q=user`
- **Description:** Search for moods and users based on a query.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  ```json
  {
    "q": "search user"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    
    "users": [
      {
        "id": 2,
        "username": "string",
        "profileImage": "string"
      }
    ]
  }

### 9. Follow User
- **Method:** `POST`
- **Endpoint:** `/account/follow`
- **Description:** Follow a user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "followeeId": 2
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Successfully followed the user"
  }
  ```

### 10. Unfollow User
- **Method:** `POST`
- **Endpoint:** `/account/unfollow`
- **Description:** Unfollow a user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "followeeId": 2
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Successfully unfollowed the user"
  }
  ```

### 11. Get Following Users
- **Method:** `GET`
- **Endpoint:** `/account/following`
- **Description:** Retrieve a list of users that the authenticated user is following.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "following": [
     {
            "userId": 1,
            "username": "string",
            "profileImage": "string"
        },
        {
            "userId": 2,
            "username": "string",
            "profileImage": "string"
        }
    ]
  }
  ```

### 12. Get Followers
- **Method:** `GET`
- **Endpoint:** `/account/followers`
- **Description:** Retrieve a list of users that are following the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "followers": [
      {
            "userId": 1,
            "username": "string",
            "profileImage": "string"
        },
        {
            "userId": 2,
            "username": "string",
            "profileImage": "string"
        }
    ]
  }
  ```

### 14. Upload Profile Image
- **Method:** `POST`
- **Endpoint:** `/account/profile-image`
- **Description:** Upload a new profile image for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:**
  - `profileImage: File`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Profile image uploaded successfully",
    "data": {
      "profileImagePath": "uploads/1-abc123.jpg"
    }
  }
  ```

### 15. Update Profile Image
- **Method:** `PUT`
- **Endpoint:** `/account/profile-image`
- **Description:** Update the profile image for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:**
  - `profileImage: File`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Profile image updated successfully",
    "data": {
      "profileImagePath": "uploads/1-def456.jpg"
    }
  }
  ```

### 16. Delete Profile Image
- **Method:** `DELETE`
- **Endpoint:** `/account/profile-image`
- **Description:** Delete the profile image of the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Profile image deleted successfully"
  }
  ```

### 17. Upload Header Image
- **Method:** `POST`
- **Endpoint:** `/account/header-image`
- **Description:** Upload a new header image for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:**
  - `headerImage: File`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Header image uploaded successfully",
    "data": {
      "headerImagePath": "uploads/1-ghi789.jpg"
    }
  }
  ```

### 18. Update Header Image
- **Method:** `PUT`
- **Endpoint:** `/account/header-image`
- **Description:** Update the header image for the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Request Body:**
  - `headerImage: File`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Header image updated successfully",
    "data": {
      "headerImagePath": "uploads/1-jkl012.jpg"
    }
  }
  ```

### 19. Delete Header Image
- **Method:** `DELETE`
- **Endpoint:** `/account/header-image`
- **Description:** Delete the header image of the authenticated user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Header image deleted successfully"
  }
  ```

---

## Mood Endpoints

### 1. Create Mood
- **Method:** `POST`
- **Endpoint:** `/moods`
- **Description:** Create a new mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`

- **Request Body:**
  ```json
  {
    "content": "string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Mood created successfully",
    "data": {
      "moodId": 1
    }
  }
  ```

### 2. Get All User Moods
- **Method:** `GET`
- **Endpoint:** `/moods`
- **Description:** Retrieve all moods of the authenticated user's account.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  ```json
  {
    "q": "search term"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "content": "string",
        "created_at": "2023-10-01T12:00:00Z"
      },
      {
        "id": 2,
        "content": "string",
        "created_at": "2023-10-02T12:00:00Z"
      }
    ]
  }
  ```

### 3. Update Mood
- **Method:** `PUT`
- **Endpoint:** `/moods/:moodId`
- **Description:** Update an existing mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "content": "updated string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Mood updated successfully"
  }
  ```

### 4. Delete Mood
- **Method:** `DELETE`
- **Endpoint:** `/moods/:moodId`
- **Description:** Delete a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Mood deleted successfully"
  }
  ```

### 5. Search Posts
- **Method:** `GET`
- **Endpoint:** `GET /moods/search?q=your_search_term`
- **Description:** Search for moods and users based on a query.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Query Parameters:**
  ```json
  {
    "q": "search term"
  }
  ```
- **Example Response:**
  ```json
  
     "success": true,
    "data": {
        "posts": [
            {
                "id": 26,
                "user_id": 4,
                "username": "string",
                "profile_image": "string",
                "content": "string",
                "created_at": "string",
                "updated_at": "string",
                "original_mood_id": null,
                "original_mood_author":null
            }
        ],
        "users": [
            {
                "id": 1,
                "username": "string",
                "profile_image": null
            }
          ]
      }

  ```

### 6. Like Mood
- **Method:** `POST`
- **Endpoint:** `/moods/:moodId/like`
- **Description:** Like a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Mood liked successfully"
  }
  ```

### 7. Unlike Mood
- **Method:** `POST`
- **Endpoint:** `/moods/:moodId/unlike`
- **Description:** Unlike a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Mood unliked successfully"
  }
  ```

### 8. Get Likes
- **Method:** `GET`
- **Endpoint:** `/moods/:moodId/likes`
- **Description:** Get the number of likes for a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "moodId": 1,
      "likeCount": 5
    }
  }
  ```

### 9. Create Comment
- **Method:** `POST`
- **Endpoint:** `/moods/:moodId/comments`
- **Description:** Create a comment on a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "content": "string",
    "parentCommentId": null 
    // optional put the CommentId of the comment you want to reply to 
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "commentId": 1
    }
  }
  ```

### 10. Get Comments
- **Method:** `GET`
- **Endpoint:** `/moods/:moodId/comments`
- **Description:** Retrieve comments for a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "content": "string",
        "created_at": "2023-10-01T12:00:00Z",
        "replies": []
      }
    ]
  }
  ```

### 11. Update Comment
- **Method:** `PUT`
- **Endpoint:** `/moods/:moodId/comments/:commentId`
- **Description:** Update a comment.
- **Request Headers:**
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "content": "updated string"
  }
  ```
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Comment updated successfully"
  }
  ```

### 12. Delete Comment
- **Method:** `DELETE`
- **Endpoint:** `/moods/:moodId/comments/:commentId`
- **Description:** Delete a comment from a mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Comment deleted successfully"
  }
  ```

### 13. Like Comment
- **Method:** `POST`
- **Endpoint:** `/moods/:moodId/comments/:commentId/like`
- **Description:** Like a comment.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Comment liked successfully"
  }
  ```

### 14. Unlike Comment
- **Method:** `POST`
- **Endpoint:** `/moods/:moodId/comments/:commentId/unlike`
- **Description:** Unlike a comment.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Comment unliked successfully"
  }
  ```

### 15. Get Comment Likes
- **Method:** `GET`
- **Endpoint:** `/moods/:moodId/comments/:commentId/likes`
- **Description:** Get the number of likes for a comment.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "commentId": 1,
      "likeCount": 3
    }
  }
  ```

### 16. Repost Mood
- **Method:** `POST`
- **Endpoint:** `/moods/:moodId/remood`
- **Description:** Repost an existing mood.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Mood reposted successfully",
    "data": {
      "moodId": 2,
      "originalMoodId": 1,
      "originalAuthor": "string",
      "originalContent": "string",
      "originalCreatedAt": "2023-10-01T12:00:00Z"
    }
  }
  ```

### 17. Hashtag Search
- **Method:** `GET`
- **Endpoint:** `/moods/hashtag/:hashtag`
- **Description:** Search for moods and comments by hashtag.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": {
      "moods": [
        {
          "moodId": 1,
          "moodContent": "string",
          "createdAt": "2023-10-01T12:00:00Z",
          "likeCount": 5,
          "comments": []
        }
      ]
    }
  }
  ```

### 18. Get For You
- **Method:** `GET`
- **Endpoint:** `/moods/for-you`
- **Description:** Get personalized mood recommendations for the user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "username": "string",
        "userId": 1,
        "moodId": 1,
        "moodContent": "string",
        "createdAt": "2023-10-01T12:00:00Z",
        "likeCount": 5


      }
    ]
  }

### 19. Get Following Feed
- **Method:** `GET`
- **Endpoint:** `/moods/following-feed`
- **Description:** Get personalized mood recommendations for the user.
- **Request Headers:**
  - `Authorization: Bearer <token>`
- **Example Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "username": "string",
        "userId": 1,
        "moodId": 1,
        "moodContent": "string",
        "createdAt": "2023-10-01T12:00:00Z",
        "likeCount": 5


      }
    ]
  }
  ```
  ```
