import express from "express";
import { getUsers, login, logout, signUp, updateUser } from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/users",authenticate,getUsers);
router.post("/update-user",authenticate,updateUser);

router.post("/signup",signUp);
router.post("/login",login);
router.post("/logout",logout);

export default router;