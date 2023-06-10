import { NextFunction, Request, Response } from "express";
import * as multer from "multer";
import * as fileUploaderService from "../services/file_uploader.service";

import { validate, validateOrReject } from "class-validator";
import { HttpError } from "../../utils/error.class";
import { UploadFileDto } from "../dtos/upload_file.dto";
import { UpdateDataDto } from "../dtos/data_table.dto";

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/media/dagimkennedy/Local Disk1/Excel-Import/Server/public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];

    req.body.efile = `excel-file-${Date.now()}.xlsx`;
    cb(null, req.body.efile);
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
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

export async function UploadExcelFile(
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
      return fileUploaderService.UploadExcelFile(uploadFileDto, res);
    }
  });
}

export async function GetUploadedExcelFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let id = req.params.id;
  return fileUploaderService.GetUploadedExcelFile(id, res);
}

export async function GetExcelFiles(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return fileUploaderService.GetExcelFiles(res);
}

// export async function UpdateTableData(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   let id = req.params.id;

//   let updateDataDto = new UpdateDataDto();
//   updateDataDto.Item_no = req.body.Item_no;
//   updateDataDto.Description = req.body.Description;
//   updateDataDto.Unit = req.body.Unit;
//   updateDataDto.Quantity = req.body.Quantity;
//   updateDataDto.Rate = req.body.Rate;
//   updateDataDto.Amount = req.body.Amount;

//   validate(updateDataDto).then((errors) => {
//     // errors is an array of validation errors
//     if (errors.length > 0) {
//       //   console.log(errors[0].constraints);
//       res.status(404).json({
//         message: errors[0].constraints,
//       });
//     } else {
//       return fileUploaderService.UpdateTableData(updateDataDto, id, res);
//     }
//   });
// }
