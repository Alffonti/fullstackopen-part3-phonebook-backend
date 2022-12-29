# Phonebook

The web application aims to implement a Node application that returns a hardcoded list of phonebook entries from the address http://localhost:3001/api/persons

The application can be started with the `npm start` command.

The **nodemon** package was installed in order to restart the server whenever changes are made and saved to a file in the source code. The `npm run dev` command was added to run the application and the nodemon _index.js_ file.

A single phonebook entry can be accessed through the http://localhost:3001/api/persons/:id endpoint.

The `Number.MAX_SAFE_INTEGER` constant is used as the range when generating a new id for a new phonebook entry so that the likelihood of creating duplicate ids is small.

The request for creating a new phonebook entry is not allowed to succeed, if:

- The name or number is missing
- The name already exists in the phonebook

The server responds with the appropriate status code, and also send back information that explains the reason for the error.

The **morgan** middleware was added to the application for logging. The format was based on the tinty configuration. A `data` token was added to show the data sent in HTTP POST requests.

The **cors** middleware was added to allow HTTP requests from other origins.

## Resources

- [Express API reference](https://expressjs.com/en/4x/api.html)

	- [morgan](https://github.com/expressjs/morgan#morgan)

	- [cors](https://expressjs.com/en/resources/middleware/cors.html)

- [REST Client Usage](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage)
