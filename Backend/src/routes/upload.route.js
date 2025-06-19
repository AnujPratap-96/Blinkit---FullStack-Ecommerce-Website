import {Router} from "express";
import auth from "../middlewares/auth.js";
import uploadImagesController from "../controllers/uploadImages.controller.js";
import upload from "../middlewares/multer.js";

const uploadRouter = Router();

uploadRouter.post("/upload", auth ,upload.single("image"), uploadImagesController)

export default uploadRouter;


