# API Endpoints Documentation

## Base URL

[http://localhost:3000/api](http://localhost:3000/api)

---

## 🔑 Authentication (Login)
**Route:** `/login`

### `POST /api/login`
- **Description:** Login with email and password.
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

## 🔑 Authentication (Login)
**Route:** `/login`

### `POST /api/login`
- **Description:** Login with email and password.
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

-   **Response:**
```json
{
  "message": "Login successful",
  "user": { "userName": "string" },
  "token": "jwt-token"
}
```
___

## 👤 Users

**Route:** /users

### POST /api/users

-   **Description:** Register a new user.
-   **Body:**

```json
{
  "userName": "string",
  "email": "string",
  "password": "string",
  "isContentCreator": false
}
```

### GET /api/users/me

-   **Auth:** ✅ Bearer Token
-   **Description:** Get logged in user info.

### GET /api/users/:id

-   **Auth:** ✅ Bearer Token
-   **Description:** Get user info by ID (only self).

### PUT /api/users/:id

-   **Auth:** ✅ Bearer Token
-   **Description:** Update user info (only self).

### PATCH /api/users/:id

-   **Auth:** ✅ Bearer Token
-   **Description:** Update only the isContentCreator field.

### DELETE /api/users/:id

-   **Auth:** ✅ Bearer Token
-   **Description:** Delete own account.
___

## 📝 Word Lists

**Route:** /wordlists

### POST /api/wordlists

-   **Auth:** ✅ Bearer Token (content creators only)
-   **Description:** Create a new word list.

### GET /api/wordlists

-   **Description:** Get all public word lists.

### GET /api/wordlists/my-wordlists

-   **Auth:** ✅ Bearer Token
-   **Description:** Get user’s own word lists.

### GET /api/wordlists/:id

-   **Auth:** Optional
-   **Description:** Get word list by ID (only if public or creator).

### PUT /api/wordlists/:id

-   **Auth:** ✅ Bearer Token (content creators only)
-   **Description:** Update word list by ID.

### DELETE /api/wordlists/:id

-   **Auth:** ✅ Bearer Token (only creator)
-   **Description:** Delete word list.

### PATCH /api/wordlists/:id/like

-   **Auth:** ✅ Bearer Token
-   **Description:** Toggle like/unlike for a word list.

### PATCH /api/wordlists/:id/visibility

-   **Auth:** ✅ Bearer Token (only creator)
-   **Description:** Toggle visibility (public/private).
___

## ✏️ Crosswords

**Route:** /crosswords

### POST /api/crosswords

-   **Auth:** ✅ Bearer Token (content creators only)
-   **Description:** Create a new crossword.

### GET /api/crosswords

-   **Description:** Get all public crosswords.

### GET /api/crosswords/my-crosswords

-   **Auth:** ✅ Bearer Token
-   **Description:** Get user’s own crosswords.

### GET /api/crosswords/:id

-   **Auth:** Optional
-   **Description:** Get crossword by ID (only if public or creator).

### PUT /api/crosswords/:id

-   **Auth:** ✅ Bearer Token (content creators only)
-   **Description:** Update crossword by ID.

### DELETE /api/crosswords/:id

-   **Auth:** ✅ Bearer Token (only creator)
-   **Description:** Delete crossword.

### PATCH /api/crosswords/:id/like

-   **Auth:** ✅ Bearer Token
-   **Description:** Toggle like/unlike for a crossword.

### PATCH /api/crosswords/:id/visibility

-   **Auth:** ✅ Bearer Token (only creator)
-   **Description:** Toggle visibility (public/private).

### PUT /api/crosswords/:id/solved

-   **Auth:** ✅ Bearer Token
-   **Description:** Mark crossword as solved.

### DELETE /api/crosswords/:id/solved

-   **Auth:** ✅ Bearer Token
-   **Description:** Mark crossword as unsolved.
___

## ⛔ Unmatched Routes

If no endpoint matched, server responds:

```
"no action matched"
```
