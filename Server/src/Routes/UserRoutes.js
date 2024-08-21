import express from "express";
import {
  Login,
  Register,
  Delete,
  google,
  getUser,
} from "./../Controllers/UserController.js";

const UserRouter = express.Router();

UserRouter.post("/login", Login);
UserRouter.post("/register", Register);
UserRouter.post("/google", google);
// UserRouter.put('/update',Update)
// UserRouter.delete("/delete", Delete);

export default UserRouter;
