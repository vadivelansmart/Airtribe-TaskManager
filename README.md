# Airtribe Task Management API

These API allows you to manage tasks with functionalities like creating, updating, deleting, filter, sort and retrieving tasks .

Table of Contents
- Installation
- Usage
- Endpoints
- Dependencies
- Contributing
- License

## Installation

1. Clone the repository : git clone https://github.com/vadivelansmart/Airtribe-TaskManager.git
2. Navigate to the project directory: cd Airtribe-TaskManager
3. Install dependencies using `npm install`.


## Usage

1.Start the server: npm start
2.Access the API endpoints at http://localhost:3000  by using a tool like Postman.

## Endpoints

- `GET /tasks`: Get a list of tasks with optional filters for completion status and sorting.
- `GET /tasks/:id`: Get a specific task by its ID.
- `POST /tasks`: Create a new task.
- `DELETE /tasks/:id`: Delete a task by its ID.
- `PUT /tasks/:id`: Update a task by its ID.
- `GET /tasks/priority/:level`: Get tasks by priority level.

## Dependencies

- Express.js
- Nodemon
- fs (File System)
- Other custom utility functions for task management

## Author

A.VADIVELAN

## License

This project is licensed under the MIT License - see the [LICENSE.md](link-to-license-file) file for details.
