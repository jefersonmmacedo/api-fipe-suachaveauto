import { Router } from "express";
import { connectToDatabase } from "../../services/database.service";
import { fipeRoutes } from "./fipe/fipe";


const router = Router();
connectToDatabase()
  .then(() => {
    router.use("/fipe", fipeRoutes);
  }).catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });

export { router };


