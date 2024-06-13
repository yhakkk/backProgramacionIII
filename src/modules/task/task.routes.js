const express = require("express");
const taskService = require("./task.service");
const userService = require("../user/user.service");

const router = express.Router();

//Get api/user
router.get("/api/task", async (req,res)=>{
    try {
        const tasks = await taskService.findAll();
        res.status(200).send(tasks);
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


//Post api/user

router.post("/api/task", async (req,res)=>{
    try {
        const newTask = req.body;
        const task = await taskService.save(newTask)

        if (task.user){
            await userService.addTaskToUser(task.user, task._id);
        }

        return res.status(201).send(task);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

});



module.exports = router;