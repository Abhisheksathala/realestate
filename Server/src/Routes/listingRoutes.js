import express from "express";
import { CreateListing } from "../Controllers/ListControllers.js";
import verifyToken from "../Utiles/.jverifyToken.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, CreateListing);

export default listingRouter;
