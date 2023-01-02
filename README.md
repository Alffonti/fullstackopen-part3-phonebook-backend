# Phonebook

Application's link: https://fullstackopen-phonebook.cyclic.app/

The web application aims to implement a Node application that returns a list of phonebook entries from the address https://fullstackopen-phonebook.cyclic.app/api/persons

The application can be started with the `npm start` command.

The **nodemon** package was installed in order to restart the server whenever changes are made and saved to a file in the source code. The `npm run dev` command was added to run the application and the nodemon _index.js_ file.

A single phonebook entry can be accessed through the https://fullstackopen-phonebook.cyclic.app/api/persons/:id endpoint.

The `Number.MAX_SAFE_INTEGER` constant is used as the range when generating a new id for a new phonebook entry so that the likelihood of creating duplicate ids is small.

The request for creating a new phonebook entry is not allowed to succeed, if:

- The name or number is missing
- The name already exists in the phonebook

The server responds with the appropriate status code, and also send back information that explains the reason for the error.

The **morgan** middleware was added to the application for logging. The format was based on the tinty configuration. A `data` token was added to show the data sent in HTTP POST requests.

A custom **error-handler** middleware was added to the application and attached as the last middleware to use. The error handler is executed by invoking the `next()` function with the error object as parameter.

The following error is sent to the browser if the id query parameter is invalid.
```
{ error: 'malformatted id' }
```

## Validation

The name of a person must be at least three characters long in order to store it in the application's database.

The phone numbers must have the following format:
- has length of 8 or more
- if formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers

The validation rule is set in the respective fields in the schema.

The following object was added to the third parameter of the findOneAndUpdate method in order to run the validation when editing a person.

```
{ runValidators: true, context: 'query' }
```

## Same origin policy and CORS

The **cors** middleware was added to allow HTTP requests from other origins.

## Serving static files from the backend

The **static** middleware is used to serve the static files (production build of the frontend) from the backend.

## Deployment

The application was deployed to **Cyclic**. It was chosen over Render and Fly.io because Apps do not have to sleep, wake up, spin up or recycle even on free tier. And no credit card is needed.

The node/express-backend resides in the Cyclic server. When the root address (https://notes-backend.cyclic.app/) is accessed, the browser loads and executes the React app that fetches the json-data from the Cyclic server.

## Streamlining deploying of the frontend

The following npm-scripts were added to the `package.json` in order to create a new production build of the frontend from the CLI.

```json
{
  "scripts": {
  //...
	"build:ui": "rm -rf build && cd ../notes-frontend/ && npm run build && cp -r build ../notes-backend",
	"deploy": "git push origin main",
	"deploy:full": "npm run build:ui && git add . && git commit -m uibuild && npm run deploy",
  }
}
```

## MongoDB

The Mongoose library was installed to provide schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

The communication between the backend and MongoDB was extracted into its own module `model/note.js`

The `findbyId()`, `findByIdAndDelete()`, and `findByIdAndUpdate()` methods were used to get, delete or update a person from the phonebook, respectively.

## Linting

The **ESlint** package was installed as a development dependency in order to perform static analysis of the code.

The `.eslintrc.js` file was created (after answering some configuration questions) by running the following command:
```
npx eslint --init
```

The following npm-script was added to to check every file in the project by ESlint.

```
{
  // ...
  "scripts": {
    "start": "node index.js",
    // ...
    "lint": "eslint ."
  },
  // ...
}
```

The `build` directory was ignored by ESlint by creating a `.eslintignore` file in the project's root.

The `VSCode ESlint plugin` was installed in order to run the linter continuously and see errors (which are underlined with a red line) in the code immediately.


## Enviroment variables

A `.env` file was created at the root of the project, after installing the **dotenv** library, to define environment variables in development mode.

The environment variables defined in the .env file can be taken into use with the expression `require('dotenv').config()` and can be referenced in the code with the `process.env` syntax.

The environment variables were defined direclty in the Cyclic dashboard to reference those variables in production mode.

## Resources

- [Express API reference](https://expressjs.com/en/4x/api.html)

	- [morgan](https://github.com/expressjs/morgan#morgan)

	- [cors](https://expressjs.com/en/resources/middleware/cors.html)

- [REST Client Usage](https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage)

- [Regular Expressions - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)

- [ESlint](https://eslint.org/)
