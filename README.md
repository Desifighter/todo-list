# Todo List App

Welcome to the Todo List App, a simple web application that allows users to manage their tasks in a todo list. Users can add tasks, mark them as completed, and organize them into different categories. The project includes routes for "/", representing the general todo list, and "/work" for tasks related to work.

## Getting Started

Follow these steps to set up the Todo List App on your local machine:

1. Clone the repository:

   ```bash
   git clone https://github.com/desifighter/todo-list.git
   ```
2. Navigate to the project directory:

   ```bash
   cd todo-list
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Set up your environment variables:

   - Create a `.env` file in the project root.
   - Add the following variables:

     ```dotenv
     PORT=3000
     MONGO_URI=your_mongo_db_uri
     ```

     Replace `your_mongo_db_uri` with your actual MongoDB connection string.
5. Start the application:

   ```bash
   npm start
   ```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Usage

### Adding Tasks

1. Visit the "/" route to view the general todo list or "/work" for work-related tasks.
2. Use the input field to add a new task.
3. Click "Add" to add the task to the list.

### Managing Tasks

- Mark tasks as completed by checking the checkbox next to each task.
- Delete tasks by clicking the delete button associated with each task.

## Routes

- **/ (Home):** View and manage tasks in the general todo list.
- **/work:** View and manage tasks specifically related to work.

## Dependencies

- **body-parser:** ^1.18.3
- **dotenv:** ^16.3.1
- **ejs:** ^2.6.1
- **express:** ^4.16.3
- **lodash:** ^4.17.11
- **mongoose:** ^8.0.2

## Contributing

If you'd like to contribute to this project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:

   ```bash
   git checkout -b feature/new-feature
   ```
3. Make your changes and commit them:

   ```bash
   git commit -m "Add new feature"
   ```
4. Push your changes to your fork:

   ```bash
   git push origin feature/new-feature
   ```
5. Open a pull request on the main repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to customize this README to suit your project's specific details and requirements. Happy task managing!
