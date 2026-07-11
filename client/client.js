import { createInterface } from "node:readline/promises";
import { exit, stdin, stdout } from "node:process";

// Constants
const HOSTNAME = "localhost";
const PORT = 3000;
const URL_BASE = `http://${HOSTNAME}:${PORT}/`

// Create the interface
const readline = createInterface({
    input: stdin,
    output: stdout
});

// Constants for the urls
const ENDPOINTS = {
    health: URL_BASE + "health",
    task: URL_BASE + "api/tasks",
};
// ===================================== Helpers =====================================

// Sends a request with a JSON body
async function sendRequestWithBody(url, method, data) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        return {
            ok: response.ok,
            status: response.status,
            body: responseData
        };

    } catch (error) {
        console.error(`A error occurred while sending the request: ${error}`);
        return null;
    }
}

// Gets user input for a complete task
async function getUserMadeTask() {
    // Get all required task fields
    const title = await readline.question("Please enter the title of your task: ");
    const course = await readline.question("Please enter the course for your task: ");
    const isCompleted = await readline.question("Is this task complete [Y/N]: ");

    if (isCompleted.toUpperCase() !== "Y" && isCompleted.toUpperCase() !== "N") {
        console.log("Please make sure that you enter either \"Y\" or \"N\" exactly.");
        return null;
    }

    return {
        title: title,
        course: course,
        completed: isCompleted.toUpperCase() === "Y"
    };

}

// Gets the server stats
async function sendHealthCheck() {
    try {
        const response = await fetch(ENDPOINTS.health);

        if (!response.ok) {
            console.log(`Health Request errors occurred: ${response.error}`);
            return;
        }

        const serverStatus = await response.json();

        console.log(`Server status: ${serverStatus.status}`);
    } catch (error) {
        console.error(`Could not send request: ${error}`);
    }
}

// Gets all tasks from the server
async function getAllTasks() {
    try {
        const response = await fetch(ENDPOINTS.task);

        const tasks = await response.json();
        if (!response.ok) {
            console.log(`Error(s) occurred when getting all tasks: ${response.error}`);
            return;
        }

        console.log(`\nAll tasks: ${JSON.stringify(tasks)}\n`);
    } catch (error) {
        console.error(`Could not send request: ${error}\n`);
    }
}

// Gets a specific task by ID
async function getTask() {
    // Get the id from the user
    const id = await readline.question("Please enter the task id: ");

    if (id.trim() === "") {
        console.log("ID cannot be blank.");
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.task + `/${id.trim()}`);

        const task = await response.json();
        if (!response.ok) {
            console.log(`\nErrors occurred. Status: ${response.status}.\nError Message: ${JSON.stringify(task.error)}`);
            return;
        }

        console.log(`\nTask Found: ${JSON.stringify(task)}\n`);

    } catch (error) {
        console.error(`Could not send request: ${error}`);
        return;
    }
}

// Creates a new task
async function createTask() {
    const newTask = await getUserMadeTask();

    if (newTask == null) {
        return;
    }

    const response = await sendRequestWithBody(ENDPOINTS.task, "POST", newTask);

    if (response == null) {
        return;
    }

    if (!response.ok) {
        console.log(`\nErrors occurred. Status: ${response.status}.\nError Message: ${JSON.stringify(response.body.error)}`);
        return;
    }

    console.log(`New task created: ${JSON.stringify(response.body)}`);
    return;
}

// Replaces an existing task
async function replaceTask() {
    // Get the id from the user
    const id = await readline.question("Please enter the task id: ");

    if (id.trim() === "") {
        console.log("ID cannot be blank.");
        return;
    }

    const updatedTask = await getUserMadeTask();

    if (updatedTask == null) {
        return;
    }

    const response = await sendRequestWithBody(ENDPOINTS.task + `/${id.trim()}`, "PUT", updatedTask);

    if (response == null) {
        return;
    }

    if (!response.ok) {
        console.log(`\nErrors occurred. Status: ${response.status}.\nError Message: ${response.body.error}`);
        return;
    }

    console.log(`Task updated: ${JSON.stringify(response.body)}`);
}

// Updates a field of an existing task
async function updateTask() {
    // Get the id from the user
    const id = await readline.question("Please enter the task id: ");

    if (id.trim() === "") {
        console.log("ID cannot be blank.");
        return;
    }

    const body = {};
    console.log("PLEASE READ: For the following prompts, if you do not wish to update that field of a task, please just hit enter without typing any input.");

    // Display prompts
    const updatedTitle = await readline.question("Please enter the updated title: ");
    const updatedCourse = await readline.question("Please enter the updated course: ");
    const updatedComplete = await readline.question("Please enter the updated completion status [Y/N]: ");

    if (updatedTitle.trim() !== "") {
        body.title = updatedTitle;
    }

    if (updatedCourse.trim() !== "") {
        body.course = updatedCourse;
    }

    if (updatedComplete !== "") {
        if (updatedComplete.toUpperCase() !== "Y" && updatedComplete.toUpperCase() !== "N") {
            console.log("The complete status must be either 'Y' or 'N', not " + updatedComplete);
            return;
        }

        body.completed = updatedComplete.toUpperCase() === "Y";
    }

    const response = await sendRequestWithBody(ENDPOINTS.task + `/${id.trim()}`, "PATCH", body);

    if (response == null) {
        return;
    }

    if (!response.ok) {
        console.log(`\nErrors occurred. Status: ${response.status}.\nError Message: ${JSON.stringify(response.body.error)}`);
        return;
    }

    console.log(`Task successfully updated: ${JSON.stringify(response.body)}`);
}

// Deletes an existing task
async function deleteTask() {
    // Get the id from the user
    const id = await readline.question("Please enter the task id: ");

    if (id.trim() === "") {
        console.log("ID cannot be blank.");
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.task + `/${id.trim()}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            // There should be an error message attached
            const data = await response.json();
            console.log(`\nErrors occurred. Status: ${response.status}.\nError Message: ${data.error}`);
            return;
        }

        console.log(`Task with id ${id.trim()} was successfully deleted.`);
    } catch (error) {
        console.error(`A error occurred while sending the request: ${error}`);
        return;
    }
}

// Main function
async function main() {
    let exitClient = false;

    console.log("Welcome to Sam Perry's Exam 1 Client! Please refer to the README or the instructions below to exercise the server through this client.");

    while(!exitClient) {
        console.log("Please enter the number that corresponds with the action you'd like to take:\n");

        // Display the instructions
        console.log("\t1. Display all current tasks.");
        console.log("\t2. Display a specific task.");
        console.log("\t3. Create a new task.");
        console.log("\t4. Replace an existing task.");
        console.log("\t5. Update an existing task.");
        console.log("\t6. Delete an existing task.");
        console.log("\t7. Get the server status.");
        console.log("\t8. Exit the client.");

        const action = Number(await readline.question(""));

        if (!Number.isInteger(action)) {
            console.log("Input must be an integer (1-8).")
            continue;
        }

        switch (action) {
            case 1:
                await getAllTasks();
                break;
            case 2:
                await getTask();
                break;
            case 3:
                await createTask();
                break;
            case 4:
                await replaceTask();
                break;
            case 5:
                await updateTask();
                break;
            case 6:
                await deleteTask();
                break;
            case 7:
                await sendHealthCheck();
                break;
            case 8:
                console.log("Goodbye!")
                exitClient = true;
                break;
            default:
                console.log(`Input must be an integer (1-8), not ${action}`)
                break;
        }
    }

    readline.close();
}


await main().catch(console.error)
