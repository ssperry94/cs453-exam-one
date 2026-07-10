/**
 * The server for the implementation portion of Exam 1
 */

import express from 'express';
import { logger, validateTask, validatePatchTask } from './middleware/middleware.js';

let currentID = 2;
const tasks = [
    {
        id: 1,
        title: "Watch new lecture",
        course: "CS-453",
        completed: true
    },
    {
        id: 2,
        title: "Complete lab",
        course: "CS-453",
        completed: false
    },
];

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(logger);

app.get("/health", async (req, res) => {
    return res.status(200).json({status: "OK"});
});

app.get("/api/tasks", async (req, res) => {
    return res.status(200).json(tasks);
});

app.get("/api/tasks/:id", async (req, res) => {
    const task = tasks.find((t) => {return t.id === Number(req.params.id)});

    if (task === undefined) {
        return res.status(404).json({error : `Task with id ${req.params.id} was not found.`});
    }

    return res.status(200).json(task);
});

app.post("/api/tasks", validateTask, async (req, res) => {
    const newTask = {
        id: ++currentID,
        title: req.body.title,
        course: req.body.course,
        completed: req.body.completed
    };

    tasks.push(newTask);
    return res.status(201).json(newTask);
});

app.put("/api/tasks/:id", validateTask, async (req, res) => {
    // Find the item and replace it
    const taskIndex = tasks.findIndex(task => task.id === Number(req.params.id));

    // We did not find the index
    if (taskIndex < 0) {
        return res.status(404).json({error: `Task with an id of ${req.params.id} was not found.`});
    }

    // Preserve the original id
    const taskToBeReplaced = tasks[taskIndex];
    tasks[taskIndex] = {
        id: taskToBeReplaced.id,
        title: req.body.title,
        course: req.body.course,
        completed: req.body.completed
    };

    return res.status(200).json(tasks[taskIndex]);
});

app.patch("/api/tasks/:id", validatePatchTask, async (req, res) => {
    const task = tasks.find(task => task.id === Number(req.params.id));

    if (task === undefined) {
        return res.status(404).json({error : `Task with the id ${req.params.id} was not found.`});
    }

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }

    if (req.body.course !== undefined) {
        task.course = req.body.course;
    }

    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    return res.status(200).json(task);
});

app.delete("/api/tasks/:id", async (req, res) => {
    const index = tasks.findIndex(task => task.id === Number(req.params.id));

    if (index < 0) {
      return res.status(404).json({
        error: `Task with id ${req.params.id} could not be found.`
      });
    }

    tasks.splice(index, 1);

    return res.sendStatus(204);
});

app.use((req, res) => {
    return res.status(404).json({error: "Resource not found."});
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
