require("dotenv").config();
import "reflect-metadata";

import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { UploadedFile } from "../../model/file_upload.entity";
import { IUploadFile } from "../../interfaces/upload_file.interface";
import { HttpError } from "../../utils/error.class";

const fileRepository = AppDataSource.getRepository(UploadedFile);

//upload file
export const uploadExcelFile = async (
  uploadFile: IUploadFile,
  res: Response
) => {
  let checkFileExistence = await fileRepository.findOne({
    where: {
      title: uploadFile.title,
    },
  });
  if (checkFileExistence) {
    throw new HttpError("File Already Exists!", 400);
  }

  let newFileUpload = fileRepository.create(uploadFile);

  await fileRepository.save(newFileUpload);

  return res.status(200).json({
    status: "Success!",
    message: "File Successfuly uploaded!",
  });
};
