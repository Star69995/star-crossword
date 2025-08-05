API Documentation
Introduction
This API provides endpoints for managing crosswords, word lists, and user information.

Endpoints
User Endpoints
POST /api/users/ - Register a new user
POST /api/login/ - Login a user
PATCH /api/users/:id - Update a user's information
PUT /api/users/:id - Update a user's information
Crossword Endpoints
GET /api/crosswords/:crossword_id - Get a crossword by ID
DELETE /api/crosswords/:crossword_id - Delete a crossword by ID
PUT /api/crosswords/:crossword_id - Update a crossword by ID
GET /api/crosswords/my-crosswords - Get a user's crosswords
PATCH /api/crosswords/:crossword_id/like - Like a crossword
PUT /api/crosswords/:crossword_id/solved - Mark a crossword as solved
DELETE /api/crosswords/:crossword_id/solved - Unmark a crossword as solved
PATCH /api/crosswords/:crossword_id/visibility - Update a crossword's visibility
Word List Endpoints
POST /api/wordLists - Create a new word list
GET /api/wordLists - Get all word lists
GET /api/wordLists/:list_id - Get a word list by ID
PUT /api/wordLists/:list_id - Update a word list by ID
GET /api/wordLists/my-wordLists - Get a user's word lists
Authentication
All endpoints require authentication using an auth token. The token can be obtained by logging in or registering a new user.

Request Body
The request body should be in JSON format.

Response
The response will be in JSON format.

Note: This is a sample README file and may need to be modified to fit your specific use case.