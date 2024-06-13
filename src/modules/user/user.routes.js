const express = require("express");
const userService = require("./user.service");

const router = express.Router();

// GET /api/user
router.get("/api/user", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const paramsHeader = req.headers['params'] || '{}';

    if (!paramsHeader) {
      throw new Error('El encabezado "params" está ausente.');
    }
    const params = JSON.parse(paramsHeader);
    console.log(params);

    const paginated = await userService.paginated(params);
    return res.status(200).send(paginated);

  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
});

// GET /api/user/:id
router.get("/api/user/:id",  async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    const user = await userService.findOneById(userId);
    return res.status(200).send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// POST /api/user
router.post("/api/user", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const newUser = req.body;
    console.log("Usuario nuevo",newUser);
    const user = await userService.save(newUser);
    return res.status(201).send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// PUT /api/user/:id
router.put("/api/user/:id",  async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const user = await userService.update(userId, updatedUser);
    return res.status(200).send(user);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// DELETE /api/user/:id
router.delete("/api/user/:id", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    await userService.remove(userId);
    return res.status(200).send("Usuario eliminado correctamente.");

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;