import express from "express";
import {
  CreateListing,
  deleteListing,
  updateListing,
} from "../Controllers/ListControllers.js";
import verifyToken from "../Utiles/verifyToken.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, CreateListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.put("/update/:id", verifyToken, updateListing);

export default listingRouter;
