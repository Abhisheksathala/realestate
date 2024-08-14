import express from "express";
import serveStatic from "serve-static";
import "dotenv/config";
import IndexDb from "./src/DB/IndexDB.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes impots
import UserRoutes from "./src/Routes/UserRoutes.js";
import listingRouter from "./src/Routes/listingRoutes.js";
import UpdateRouter from "./src/Routes/UpdateRoute.js";
// connecting server Meach
const app = express();
const PORT = process.env.PORT || 5000;
// MW
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//Route usages
app.use("/api/user", UserRoutes);
app.use("/api/updateuser", UpdateRouter);
app.use("/api/listing", listingRouter);
// Connect to MongoDB
IndexDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});
