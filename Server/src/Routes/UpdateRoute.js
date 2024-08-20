import express from "express";
import updateUser from "./../Controllers/UpdateusetController.js";
import verifyToken from "../Utiles/.jverifyToken.js";
import { getUserListings } from "../Controllers/UserController.js";

const UpdateRouter = express.Router();

UpdateRouter.post("/update/:id", verifyToken, updateUser);

UpdateRouter.get("/Listings/:id", verifyToken, getUserListings);

export default UpdateRouter;
