# Anythink Market API Documentation

## Overview

The Anythink Market API is a RESTful API built with Node.js and Express, providing endpoints for a marketplace application where users can list items, comment, favorite items, and follow other users.

**Base URL:** `http://localhost:3000/api`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Token <JWT_TOKEN>
```

Authentication levels:
- **Required**: Endpoint requires authentication (returns 401 if not authenticated)
- **Optional**: Endpoint works with or without authentication (provides additional data when authenticated)

## Response Format

### Success Response
```json
{
  "item": { ... },
  "items": [ ... ],
  "user": { ... }
}
```

### Error Response
```json
{
  "errors": {
    "field": ["error message"]
  }
}
```

## Endpoints

### Authentication & Users

#### Register a New User
```
POST /api/users
```

**Request Body:**
```json
{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "token": "jwt.token.here",
    "bio": null,
    "image": null,
    "role": "user"
  }
}
```

**Events Triggered:** `user_created`

---

#### Login
```
POST /api/users/login
```

**Request Body:**
```json
{
  "user": {
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "token": "jwt.token.here",
    "bio": "User bio",
    "image": "https://example.com/avatar.jpg",
    "role": "user"
  }
}
```

**Errors:**
- `422` - Missing email or password

---

#### Get Current User
```
GET /api/user
```

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "token": "jwt.token.here",
    "bio": "User bio",
    "image": "https://example.com/avatar.jpg",
    "role": "user"
  }
}
```

---

#### Update Current User
```
PUT /api/user
```

**Authentication:** Required

**Request Body:**
```json
{
  "user": {
    "username": "newusername",
    "email": "newemail@example.com",
    "bio": "New bio",
    "image": "https://example.com/new-avatar.jpg",
    "password": "newpassword"
  }
}
```

**Response:** `200 OK` - Returns updated user object

---

### Profiles

#### Get User Profile
```
GET /api/profiles/:username
```

**Authentication:** Optional

**Response:** `200 OK`
```json
{
  "profile": {
    "username": "johndoe",
    "bio": "User bio",
    "image": "https://example.com/avatar.jpg",
    "following": false
  }
}
```

---

#### Follow User
```
POST /api/profiles/:username/follow
```

**Authentication:** Required

**Response:** `200 OK` - Returns profile with `following: true`

---

#### Unfollow User
```
DELETE /api/profiles/:username/follow
```

**Authentication:** Required

**Response:** `200 OK` - Returns profile with `following: false`

---

### Items

#### List Items
```
GET /api/items
```

**Authentication:** Optional

**Query Parameters:**
- `limit` (number, default: 100) - Number of items to return
- `offset` (number, default: 0) - Offset for pagination
- `tag` (string) - Filter by tag
- `seller` (string) - Filter by seller username
- `favorited` (string) - Filter by username who favorited

**Response:** `200 OK`
```json
{
  "items": [
    {
      "slug": "awesome-item-abc123",
      "title": "Awesome Item",
      "description": "This is an awesome item for sale",
      "image": "https://example.com/item.jpg",
      "createdAt": "2026-01-14T10:00:00.000Z",
      "updatedAt": "2026-01-14T10:00:00.000Z",
      "tagList": ["electronics", "gadgets"],
      "favorited": false,
      "favoritesCount": 5,
      "seller": {
        "username": "johndoe",
        "bio": "Seller bio",
        "image": "https://example.com/avatar.jpg",
        "following": false
      }
    }
  ],
  "itemsCount": 100
}
```

---

#### Get User Feed
```
GET /api/items/feed
```

**Authentication:** Required

**Query Parameters:**
- `limit` (number, default: 20)
- `offset` (number, default: 0)

**Response:** `200 OK` - Returns items from followed users

---

#### Create Item
```
POST /api/items
```

**Authentication:** Required

**Request Body:**
```json
{
  "item": {
    "title": "New Item",
    "description": "Item description",
    "image": "https://example.com/item.jpg",
    "tagList": ["tag1", "tag2"]
  }
}
```

**Response:** `200 OK` - Returns created item

**Events Triggered:** `item_created`

---

#### Get Single Item
```
GET /api/items/:slug
```

**Authentication:** Optional

**Response:** `200 OK` - Returns item object

---

#### Update Item
```
PUT /api/items/:slug
```

**Authentication:** Required (must be item seller)

**Request Body:**
```json
{
  "item": {
    "title": "Updated Title",
    "description": "Updated description",
    "image": "https://example.com/new-image.jpg",
    "tagList": ["new", "tags"]
  }
}
```

**Response:** `200 OK` - Returns updated item

**Errors:**
- `403` - Not the item seller

---

#### Delete Item
```
DELETE /api/items/:slug
```

**Authentication:** Required (must be item seller)

**Response:** `204 No Content`

**Errors:**
- `403` - Not the item seller

---

#### Favorite Item
```
POST /api/items/:slug/favorite
```

**Authentication:** Required

**Response:** `200 OK` - Returns item with updated favorite status

---

#### Unfavorite Item
```
DELETE /api/items/:slug/favorite
```

**Authentication:** Required

**Response:** `200 OK` - Returns item with updated favorite status

---

### Comments

#### Get All Comments (Admin)
```
GET /api/comments
```

**Response:** `200 OK`
```json
[
  {
    "id": "comment_id",
    "body": "Comment text",
    "createdAt": "2026-01-14T10:00:00.000Z",
    "seller": {
      "username": "commenter",
      "bio": "Bio",
      "image": "https://example.com/avatar.jpg",
      "following": false
    }
  }
]
```

---

#### Get Item Comments
```
GET /api/items/:slug/comments
```

**Authentication:** Optional

**Response:** `200 OK`
```json
{
  "comments": [
    {
      "id": "comment_id",
      "body": "Comment text",
      "createdAt": "2026-01-14T10:00:00.000Z",
      "seller": {
        "username": "commenter",
        "bio": "Bio",
        "image": "https://example.com/avatar.jpg",
        "following": false
      }
    }
  ]
}
```

---

#### Add Comment to Item
```
POST /api/items/:slug/comments
```

**Authentication:** Required

**Request Body:**
```json
{
  "comment": {
    "body": "This is a great item!"
  }
}
```

**Response:** `200 OK` - Returns created comment

---

#### Delete Comment
```
DELETE /api/comments/:id
```

**Response:** `204 No Content`

**Errors:**
- `404` - Comment not found

---

#### Delete Item Comment
```
DELETE /api/items/:slug/comments/:id
```

**Authentication:** Required (must be comment author)

**Response:** `204 No Content`

**Errors:**
- `403` - Not the comment author

---

### Tags

#### Get All Tags
```
GET /api/tags
```

**Response:** `200 OK`
```json
{
  "tags": [
    "electronics",
    "clothing",
    "books",
    "furniture"
  ]
}
```

---

### Health Check

#### Ping
```
GET /api/ping
```

**Response:** `200 OK`
```json
{
  "message": "pong"
}
```

---

## Data Models

### User
```javascript
{
  username: String,      // Unique, alphanumeric only
  email: String,        // Unique, valid email format
  bio: String,          // Optional
  image: String,        // URL to profile image
  role: String,         // "user" or "admin"
  favorites: [ObjectId], // Array of favorited item IDs
  following: [ObjectId], // Array of followed user IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Item
```javascript
{
  slug: String,          // Unique identifier
  title: String,         // Required
  description: String,   // Required
  image: String,         // URL to item image
  favoritesCount: Number,
  comments: [ObjectId],  // Array of comment IDs
  tagList: [String],     // Array of tags
  seller: ObjectId,      // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  body: String,
  seller: ObjectId,      // Reference to User
  item: ObjectId,        // Reference to Item
  createdAt: Date,
  updatedAt: Date
}
```

---

## Events

The API emits the following events for external integrations:

- `user_created` - Triggered when a new user registers
- `item_created` - Triggered when a new item is created

Events are sent via the event library configured in the application.

---

## Error Codes

- `200` - Success
- `204` - Success (No Content)
- `401` - Unauthorized (authentication required or failed)
- `403` - Forbidden (authenticated but not authorized)
- `404` - Resource not found
- `422` - Validation error
- `500` - Internal server error
