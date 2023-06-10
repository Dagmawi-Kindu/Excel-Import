import * as express from "express";

import {
  UploadExcelFile,
  uploadFile,
  GetUploadedExcelFile,
  GetExcelFiles,
} from "../controllers/file_uploader.controller";

const fileUploadRouter = express.Router();

fileUploadRouter.post("/upload", uploadFile, UploadExcelFile);
fileUploadRouter.get("/get/:id", GetUploadedExcelFile);
fileUploadRouter.get("/getExcelFiles", GetExcelFiles);
export { fileUploadRouter };
