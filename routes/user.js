const express = require("express")
const router = new express.Router()
const userController = require('../controllers/user')

router.get("/", userController.listUser)
router.post("/", userController.storeUser)
router.get("/:uuid", userController.detailUser)
router.put("/:uuid", userController.updateUser)
router.delete("/:uuid", userController.deleteUser)

module.exports = router;