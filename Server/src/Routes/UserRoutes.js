import express from "express";
import {
  Login,
  Register,
  Delete,
  google,
  getUser,
} from "./../Controllers/UserController.js";

import verifyToken from "./../Utiles/verifyToken.js";

const UserRouter = express.Router();

UserRouter.post("/login", Login);
UserRouter.post("/register", Register);
UserRouter.post("/google", google);
// UserRouter.put('/update',Update)
// UserRouter.delete("/delete", Delete);

UserRouter.get("/:id", verifyToken, getUser);

export default UserRouter;
