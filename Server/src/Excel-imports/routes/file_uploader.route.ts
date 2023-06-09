import * as express from "express";

import {
  UploadExcelFile,
  uploadFile,
  getfn,
  GetUploadedExcelFile,
} from "../controllers/file_uploader.controller";

const fileUploadRouter = express.Router();

fileUploadRouter.post("/upload", uploadFile, UploadExcelFile);
fileUploadRouter.get("/get/:id", GetUploadedExcelFile);
fileUploadRouter.get("/geting", getfn);
export { fileUploadRouter };
