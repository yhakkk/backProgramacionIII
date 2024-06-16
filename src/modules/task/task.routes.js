const express = require("express");
const taskService = require("./task.service");
const userService = require("../user/user.service");

const router = express.Router();

//Get api/user
router.get("/api/task", async (req,res)=>{
      // #swagger.tags = ['Task']
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
        // #swagger.tags = ['Task']
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

router.get("/api/task/:id", async (req,res)=>{
    // #swagger.tags = ['Task']
    try {
        const taskId = req.params.id;
        const task = await taskService.findOneById(taskId);
        return res.status(200).send(task);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
})

router.put("/api/task/:id", async (req,res) => {
    // #swagger.tags = ['Task']
    try {
        const taskId = req.params.id;
        const upTask = req.body;
        const task = await taskService.updateTask(taskId, upTask);
        return res.status(200).send(task)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});



router.delete("/api/task/:id", async (req,res)=>{
    // #swagger.tags = ['Task']

    try {
        const taskId = req.params.id;
        await taskService.deleteTask(taskId);
        return res.status(200).send("Task Eliminada")
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

})



module.exports = router;