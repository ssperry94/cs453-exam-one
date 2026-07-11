# cs453-exam-one
The first take home exam for UAH's CS453

## Structure
| File | Purpose |
| ---- | ------- |
| `ANSWERS.md` | Contains all written answers to the take home test |
| `package.json` | contains all run commands and dependencies for the project (one in root, client, and server directories.) |
| `package-lock.json` | locks dependencies to specific version (one for root, client, and server directories.) |
| `server/server.js` | contains implementation of all routes and web server |
| `server/openapi.yaml` | contains the OpenAPI Specification for the Task API |
| `server/middleware/middleware.js` | contains the implementation of the logger and validation middleware |
| `client/client.js` | contains the implementation of the client to interact with the API |

## How to run
1) From the root directory, install all dependencies
```bash
npm install
```

2) Start the server
```bash
npm run server
```

3) In a separate terminal, start the client
```bash
npm run client
```

## How to use the client
The client is a terminal based application. It prompts the user for input (1-8) and fires a specific endpoint based on what the user wants. The client then displays the output of the response sent by the server. A table detailing the user input and the endpoint that is fired is detailed below:

| User Input | Endpoint |
| ---------- | -------- |
|1 | GET /api/tasks |
|2 | GET /api/tasks/{id} |
|3 | POST /api/tasks |
|4 | PUT /api/tasks/{id} |
|5 | PATCH /api/tasks/{id} |
|6 | DELETE /api/tasks/{id} |
|7 | GET /health |

Note that 8 exits the client gracefully.
