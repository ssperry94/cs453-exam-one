/**
 * Holds the implementation of the logger and verification modules
 */

export function logger(req, res, next) {
    const startTime = Date.now();

    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);

    res.on("finish", () => {
        const finalTime = Date.now() - startTime;
        console.log(`Response status: ${res.statusCode}`);
        console.log(`Time elapsed: ${finalTime} ms.`);
    });

    next();
}

export function validateTask(req, res, next) {
    const title = req.body?.title;
    const course = req.body?.course;
    const completed = req.body?.completed;

    // Verify all required attributes are present
    if (title == null) {
        return res.status(400).json({error: "title is required"});
    }

    if (course == null) {
        return res.status(400).json({error: "course is required."});
    }

    if (completed == null) {
        return res.status(400).json({error: "completed flag required."});
    }

    // Verify attributes type

    if (typeof title !== "string") {
        return res.status(400).json({error: "Title must be type string."});
    }

    if (typeof course !== "string") {
        return res.status(400).json({error: "Course must be a string."});
    }

    if (typeof completed !== "boolean") {
        return res.status(400).json({error: "Completed must be boolean."});
    }

    // we didn't find any errors
    next();
}
export function validatePatchTask(req, res, next) {
    let oneRequiredFieldPresent = false;

    if (req.body.title !== undefined) {
        oneRequiredFieldPresent = true;
        if (!(typeof req.body.title === "string")) {
            return res.status(400).json({error : "Title must be a string."});
        }
    }

    if (req.body.course !== undefined) {
        oneRequiredFieldPresent = true;
        if (!(typeof req.body.course === "string")) {
            return res.status(400).json({error : "Title must be a string."});
        }
    }

    if (req.body.completed !== undefined) {
        oneRequiredFieldPresent = true;
        if (!(typeof req.body.completed === "boolean")) {
            return res.status(400).json({error : "Completed must be a boolean."});
        }
    }

    if (!oneRequiredFieldPresent) {
        return res.status(400).json({error: "Must have at least one required field (title, course, completed)."});
    }

    next();
}
