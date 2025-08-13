# Star Crossword

A web-based crossword puzzle platform for creating, solving, and sharing crosswords.

## Table of Contents
- Features
- Getting Started
- Components
- API Documentation
- Models
- Services
- Pages

## Features
- Create and edit crosswords with a user-friendly interface  
- Solve crosswords with an interactive grid and definitions area  
- Share crosswords with others and browse public crosswords  
- User authentication and authorization for content creators  
- Support for multiple languages (RTL and LTR)  

## Getting Started
To get started with the project, follow these steps:

1. **Clone the repository**:  
   ```bash
   git clone https://github.com/star69995/star-crossword.git
   ```

2. **Install dependencies**:
```
npm install
# or
yarn install
```

3. **Start the development server**:
```
npm start
# or
yarn start
```

Components
The project consists of the following components:

Crossword: The main crossword grid component

DefinitionsArea: The area where definitions are displayed

Grid: The grid component for displaying crossword clues

WordListCard: A card component for displaying word lists

ContentCard: A card component for displaying content (e.g., crosswords, word lists)

ActionButtons: A component for displaying action buttons (e.g., like, delete)

API Documentation
The project uses a RESTful API for interacting with the backend.

Crosswords

GET /crosswords – Get a list of all crosswords

GET /crosswords/:id – Get a single crossword by ID

POST /crosswords – Create a new crossword

PUT /crosswords/:id – Update a crossword

DELETE /crosswords/:id – Delete a crossword

Word Lists

GET /wordlists – Get a list of all word lists

GET /wordlists/:id – Get a single word list by ID

POST /wordlists – Create a new word list

PUT /wordlists/:id – Update a word list

DELETE /wordlists/:id – Delete a word list

Models
Crossword: A model for representing crosswords

WordList: A model for representing word lists

User: A model for representing users

Services
api.js: A service for making API requests to the backend

auth.js: A service for handling user authentication and authorization

Pages
Home: The main homepage

Login: The login page

Register: The registration page

Profile: The user profile page

CrosswordEditor: The crossword editor page

CrosswordSolver: The crossword solver page

WordListEditor: The word list editor page

WordListsBrowser: The word lists browser page

MyWordLists: The my word lists page