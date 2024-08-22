import express from "express";
import {
  CreateListing,
  deleteListing,
  updateListing,
  getListing,
} from "../Controllers/ListControllers.js";
import verifyToken from "../Utiles/verifyToken.js";

const listingRouter = express.Router();

listingRouter.post("/create", verifyToken, CreateListing);
listingRouter.delete("/delete/:id", verifyToken, deleteListing);
listingRouter.post("/update/:id", verifyToken, updateListing);
listingRouter.get("/get/:id", getListing);

export default listingRouter;
