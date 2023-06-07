import { NextFunction, Request, Response } from "express";
import * as multer from "multer";
import * as fileUploaderService from "../services/file_uploader.service";

import { validate, validateOrReject } from "class-validator";
import { HttpError } from "../../utils/error.class";
import { UploadFileDto } from "../dtos/upload_file.dto";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `Server/public/files`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    req.body.efile = `excel-file-${Date.now()}.${ext}`;
    cb(null, req.body.efile);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.includes("xslx")) {
    cb(null, true);
  } else {
    const error = new HttpError("Only excel files are allowed!.", 400);

    cb(error, false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
export const uploadFile = upload.single("efile");

export async function uploadExcelFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let uploadFileDto = new UploadFileDto();
  uploadFileDto.title = req.body.title;
  uploadFileDto.efile = req.body.efile;

  validate(uploadFileDto).then((errors) => {
    // errors is an array of validation errors
    if (errors.length > 0) {
      //   console.log(errors[0].constraints);
      res.status(404).json({
        message: errors[0].constraints,
      });
    } else {
      fileUploaderService.uploadExcelFile(uploadFileDto, res);
    }
  });
}
