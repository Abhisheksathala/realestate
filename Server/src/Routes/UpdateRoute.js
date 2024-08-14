import express from "express";
import verifyToken from "../Utiles/verifyuser.js";
import updateUser from "./../Controllers/UpdateusetController.js";

const UpdateRouter = express.Router();

UpdateRouter.post("/update/:id", verifyToken, updateUser);

export default UpdateRouter;
