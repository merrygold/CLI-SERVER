# CLI-REPL-SERVER

## Introduction

CLI-REPL-SERVER is a server application designed to complement the CLI REPL project. Its primary function is to provide file storage capabilities for the CLI REPL tool. CLI-REPL-SERVER exposes three APIs that allow users to upload, retrieve, and delete files.

## File Storage

CLI-REPL-SERVER offers a file storage system that enables users to store and manage files efficiently. This functionality is essential for tasks such as uploading CSV files for chart generation in the CLI REPL tool.

1. **Installation**: Clone this repository and install the necessary dependencies.
   ```shell
   git clone [https://github.com/merrygold/CLI-SERVER.git]
   cd server
   npm i 
   node server.js

## APIs

### 1. Upload

- **Endpoint**: `/upload`
- **Method**: POST
- **Description**: This API allows users to upload files to the server. It is specifically designed to work seamlessly with CLI REPL for uploading CSV files.

### 2. Retrieve (Draw Chart)

- **Endpoint**: `/drawchart/:filename`
- **Method**: GET
- **Description**: The "drawchart" API is used to retrieve files for chart generation within CLI REPL. Users can specify the filename as a parameter, and the server will provide the requested file for drawing charts.

### 3. Delete

- **Endpoint**: `/delete/:filename`
- **Method**: DELETE
- **Description**: The "delete" API allows users to delete files from the server by specifying the filename as a parameter. This feature helps maintain a clean and organized storage environment.

## Usage

To use CLI-REPL-SERVER in conjunction with CLI REPL, set up and configure the server to handle file storage. Ensure that the server is accessible to the CLI REPL tool, allowing users to upload, retrieve, and delete files as needed.

Thank you for using CLI-REPL-SERVER! If you have any questions or require further assistance, please refer to the documentation or reach out for support.
