# Sam Perry Test 1 Answers

## Part 1

1) A raw socket is a low level endpoint for network communication. It is the foundation of networking communication, but it only provides the raw essentials for network communication such as being able to send a stream of bytes or providing an IP address. An Http server not only wraps the low-level implementation in its own methods, but provides error handling in the form of Http statuses, serialization from raw bytes into either JSON or XML, and gives structure to messages. HTTP allows a client sending a message to send a Request, and a server to response with a Response. Requests and Responses give structure to messages by allowing users to set fields with important data and attach headers to the message. Raw sockets are not exposed in HTTP so that HTTP can control the structure and mechanics around sending messages. This allows them to enforce common behavior used across systems. If raw sockets were exposed, it would be much harder to enforce a structure across all systems.

2) The request/response system is the model that describes the fundamental unit of how client and servers communicate. A client sends a request to a server, usually for some resource or task to be performed, and the server receives the request, interprets it, and sends a response back to the client. In a TCP command server, the user must specify the structure of both the request and response. In HTTP, requests and responses often contain JSON data and a myriad of features such as headers, status codes for error handling, and added security measures (if using HTTPS). An express route handler implements the HTTP request/response as Javascript objects. It provides a request and response object with fields that can be populated by the programmer, while it abstracts the lower level portions of HTTP.

3) A stateless API means that it does not hold any context from previous requests sent. In other words, when a client sends a request to a server, the request has all the needed context for the server to process the request. The request will contain any authorization, token, and data required for the server to function properly. Stateless API's are very scalable because any request can go to any server on the network. This means we can easily add more servers to our network than we could in a stateless API. However, this can limit some features we can have like persistent login between sessions, since the server would need to store the login information outside of just a request.

4)  | Situation | Status Code|
    | --------- | ---------- |
    |A new resource was successfully created | 201 CREATED - this is the status code representing objects being successfully created.|
    |The client requested an item that does not exist | 404 NOT FOUND - this is the status code commonly returned when an cannot be found, like if it does not exist.|
    |The client sent JSON missing a required field | 400 BAD REQUEST - commonly sent when a request is malformed, such as when a JSON body is missing a required field.|
    |The server had an unexpected error | 500 INTERNAL SERVER ERROR - this code indicates that an exception was thrown in the server code, or if the sever generally experienced an error independent of the client.|
    |A successful request returns JSON data | 200 OK - this code is generally used for when a successful operation is completed, and is often accompanied by a JSON body.|

## Part 2

1)  | Action | URI |
    | ------ | --- |
    | getting all tasks | GET /tasks/ |
    | getting one task by id | GET /tasks/:id |
    | creating a task | POST /tasks |
    | replacing a task | PUT /tasks/:id |
    | partially updating a task | PATCH /tasks/:id |
    | deleting a task | DELETE /tasks/:id |

2) getting all tasks - safe and idempotent, does not change the state of the server and can be repeated an unlimited amount of times without changing the state
   getting one task by id - safe and idempotent, does not change the state of the server and gets the same task over and over without changing the state.
   creating a task - neither, creating a new tasks alters the state of the server by adding a resource to manage, and when repeated creates a new task each time.
   replacing a task - idempotent only, updating a task changes the state of a resource, and therefore the server, however, once the resource is changed repeated request will not alter the sever state any longer.
   partially updating a task - mostly neither, but could idempotent. If the request only changes a constant value, then the server state does not change after a repeated request and it is idempotent. If the request results in the server taking some action, such as appending to an array, then it is neither nor idempotent.
   deleting a task - idempotent only, deleting a task changes the state of the server, but repeated requests cannot delete a resource that isn't there, so the server state remains the same.

3)  Valid creation of a task JSON:
    ```json
    { 
        "title": "Do Lab 5",
        "course": "CS-453",
        "completed": false
    }
    ```
## Part 3
Implemented in `server/server.js`

## Part 4
The tasks of logging and validating incoming objects are middleware concerns because we must call these for multiple routes. In the case of logging, this is called with every request and response the server processes. Since validation and logging are used so often, it is better to define them once in their own source file and reuse them in each route, rather than redefine them again in each route. This keeps our codebase modular and clean.

# Parts 5-6
Implemented in `client/client.js` and `server/openapi.yaml`

## Part 7
1) The difference between the express router implementation and the OpenAPI specification is that the router is the in-code implementation of an API and the OpenAPI specification is a file documenting the structure of the API. In an express router, we are directly implementing the fields and functionality of the API while in the OpenAPI schema, we are providing documentation detailing the required fields, version, schema, and more.

2) If the documentation for an API is not kept up-to-date, the code and the OpenAPI specification will begin to drift apart. One example of this is if a field in an API has been deprecated, but is not updated in the .yml or .json file. This means that anyone wishing to use this API will being referring to documentation that claims that this field is still present, and could lead to erroneous results. Another example of how code and documentation can drift apart is if a new endpoint is added but never documented. If the OpenAPI specification is missing this endpoint, clients may not be aware of its existence and will be unable to use this endpoint.

3) Inaccurate API documentation is problematic for developers because it makes it harder for them to use the api correctly. If the documentation is out of date, developers may not be able to find important information such as URIs, fields, and schemas. This means that developers could build erroneous applications off of this documentation.
