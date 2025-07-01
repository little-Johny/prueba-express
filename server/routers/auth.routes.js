const express = require("express");
const AuthController = require("../controllers/auth.controller");
const UserRepository = require("../repositories/user.repository");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Crear instancias
const userRepository = new UserRepository();
const authController = new AuthController(userRepository);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authMiddleware, authController.getProfile);

// router.get("/test", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "El servidor está funcionando correctamente",
//   });
// });

module.exports = router;
