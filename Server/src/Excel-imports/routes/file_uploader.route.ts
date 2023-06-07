import * as express from "express";

import {
  uploadExcelFile,
  uploadFile,
} from "../controllers/file_uploader.controller";

const fileUploadRouter = express.Router();

fileUploadRouter.post("/upload", uploadFile, uploadExcelFile);

export { fileUploadRouter };
