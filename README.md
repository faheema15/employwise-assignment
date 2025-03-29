# Users List Project

## Project Overview
This project is a React-based web application that fetches and displays a list of users from an API. Users can be edited or deleted using the interface. The project is built using React with Material UI for styling.

Deployed link: https://employwise-assignment-4j3l.vercel.app/

## Features
- Fetch users from an API.
- Display users in a responsive grid layout.
- Edit user details.
- Delete users.

## Technologies Used
- React
- TypeScript
- Material UI
- Axios (for API calls)

## Installation and Setup
### Prerequisites
Ensure you have the following installed before starting:
- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/faheema15/employwise-assignment.git
   cd employwise-assignment
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
   or if using yarn:
   ```sh
   yarn install
   ```
3. Start the development server:
   ```sh
   npm run edv
   ```
4. Open the application in your browser:
   ```
   http://localhost:5173/
   ```

## API Assumptions
- The project fetches users from `https://reqres.in/api/users`.
- User data includes `id`, `first_name`, `last_name`, `email`, and `avatar`.
- Editing a user updates state locally (not persisted in the API).
- Deleting a user removes them from the UI (not persisted in the API).

##  Strengths
- Responsive UI - Adapts well to different screen sizes, ensuring a great user experience across devices.
- Use of TypeScript – Enhances type safety and reduces potential runtime errors.
-  Modern Development Tools – Leveraging Vite for faster builds and efficient development.
-  Linting & Configurations – ESLint and TypeScript configurations help maintain code quality and consistency.

## Future Enhancements
- Integrate a backend to persist user changes.
