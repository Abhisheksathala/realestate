import express from "express";
import {
  CreateListing,
  deleteListing,
} from "../Controllers/ListControllers.js";
import verifyToken from "../Utiles/verifyToken.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, CreateListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);

export default listingRouter;
