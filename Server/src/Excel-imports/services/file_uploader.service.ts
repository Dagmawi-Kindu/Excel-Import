import "reflect-metadata";

import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { IUploadFile } from "../../interfaces/upload_file.interface";
import { HttpError } from "../../utils/error.class";
import * as XLSX from "xlsx";
import { UploadedFile } from "../../model/file_upload.entity";
import { ExtractedData } from "../../model/extracted_data.entity";

const fileRepository = AppDataSource.getRepository(UploadedFile);
const dataRepository = AppDataSource.getRepository(ExtractedData);
//upload file
export const UploadExcelFile = async (
  uploadFile: IUploadFile,
  res: Response
) => {
  let checkFileExistence = await fileRepository.findOne({
    where: {
      title: uploadFile.title,
    },
  });
  if (checkFileExistence) {
    return res.status(404).json({
      status: "Error",
      message: "File Exists",
    });
  }

  let newFileUpload = fileRepository.create({
    title: uploadFile.title,
    efile: uploadFile.efile,
  });
  await fileRepository.save(newFileUpload);
  return res.status(200).json({
    status: "Success!",
    message: "File upload successful",
  });
};

export const GetUploadedExcelFile = async (id: string, res: Response) => {
  let checkFileExistence = await fileRepository.findOne({
    where: {
      id: parseInt(id),
    },
  });

  if (!checkFileExistence) {
    return res.status(404).json({
      status: "Error",
      message: "No such file",
    });
  }

  const workbook = XLSX.readFile(
    `/media/dagimkennedy/Local Disk/Excel-Import/Server/public/${checkFileExistence.efile}`
  );

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData: Object = XLSX.utils.sheet_to_json(sheet);

  for (let i = 1; i < Object.values(jsonData).length; i++) {
    //console.log( Object.values(jsonData[0]));
    if (Object.values(jsonData[i]).length === 6) {
      let newData = dataRepository.create({
        Item_no: Object.values(jsonData[i])[0].toString(),
        Description: Object.values(jsonData[i])[1].toString(),
        Unit: Object.values(jsonData[i])[2].toString(),
        Quantity: Object.values(jsonData[i])[3].toString(),
        Rate: Object.values(jsonData[i])[4].toString(),
        Amount: Object.values(jsonData[i])[5].toString(),
      });
      await dataRepository.save(newData);
    } else if (Object.values(jsonData[i]).length === 5) {
      let newData = dataRepository.create({
        Description: Object.values(jsonData[i])[0].toString(),
        Unit: Object.values(jsonData[i])[1].toString(),
        Quantity: Object.values(jsonData[i])[2].toString(),
        Rate: Object.values(jsonData[i])[3].toString(),
        Amount: Object.values(jsonData[i])[4].toString(),
      });
      await dataRepository.save(newData);
    } else if (Object.values(jsonData[i]).length === 2) {
      if (typeof Object.values(jsonData[i])[0] === "string") {
        let newData = dataRepository.create({
          Description: Object.values(jsonData[i])[0].toString(),
          Amount: Object.values(jsonData[i])[1].toString(),
        });
        await dataRepository.save(newData);
      } else if (typeof Object.values(jsonData[i])[0] === "number") {
        let newData = dataRepository.create({
          Item_no: Object.values(jsonData[i])[0].toString(),
          Description: Object.values(jsonData[i])[1].toString(),
        });
        await dataRepository.save(newData);
      }
    } else if (Object.values(jsonData[i]).length === 1) {
      if (typeof Object.values(jsonData[i])[0] === "string") {
        let newData = dataRepository.create({
          Description: Object.values(jsonData[i])[0].toString(),
        });
        await dataRepository.save(newData);
      } else if (typeof Object.values(jsonData[i])[0] === "number") {
        let newData = dataRepository.create({
          Item_no: Object.values(jsonData[i])[0].toString(),
        });
        await dataRepository.save(newData);
      }
    }
  }

  return res.status(200).json({
    status: "Success!",
    message: "",
    //  data: typeof Object.values(jsonData[3])[0],
  });
};

export const getf = async (res: Response) => {
  let checkFileExistence = await fileRepository.find();

  return res.status(200).json({
    status: "Success!",
    data: checkFileExistence,
  });
};
