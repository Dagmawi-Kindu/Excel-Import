import "reflect-metadata";

import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../data-source";
import { IUploadFile } from "../../interfaces/upload_file.interface";
import { HttpError } from "../../utils/error.class";
import * as XLSX from "xlsx";
import { UploadedFile } from "../../model/file_upload.entity";
import { ExtractedData } from "../../model/extracted_data.entity";
import { id } from "date-fns/locale";
import { IUpdateData } from "../../interfaces/data_table.interface";

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
        Quantity: !Number.isNaN(
          parseFloat(Object.values(jsonData[i])[3].toString())
        )
          ? parseFloat(Object.values(jsonData[i])[3].toString()).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : "-",
        Rate: !Number.isNaN(
          parseFloat(Object.values(jsonData[i])[4].toString())
        )
          ? parseFloat(Object.values(jsonData[i])[4].toString()).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : "-",
        Amount: !Number.isNaN(
          parseFloat(Object.values(jsonData[i])[5].toString())
        )
          ? parseFloat(Object.values(jsonData[i])[5].toString()).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : "-",
      });
      await dataRepository.save(newData);
    } else if (Object.values(jsonData[i]).length === 5) {
      let newData = dataRepository.create({
        Description: Object.values(jsonData[i])[0].toString(),
        Unit: Object.values(jsonData[i])[1].toString(),
        Quantity: !Number.isNaN(
          parseFloat(Object.values(jsonData[i])[2].toString())
        )
          ? parseFloat(Object.values(jsonData[i])[2].toString()).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : "-",
        Rate: !Number.isNaN(
          parseFloat(Object.values(jsonData[i])[3].toString())
        )
          ? parseFloat(Object.values(jsonData[i])[3].toString()).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : "-",
        Amount: !Number.isNaN(
          parseFloat(Object.values(jsonData[i])[4].toString())
        )
          ? parseFloat(Object.values(jsonData[i])[4].toString()).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )
          : "-",
      });
      await dataRepository.save(newData);
    } else if (Object.values(jsonData[i]).length === 2) {
      if (typeof Object.values(jsonData[i])[0] === "string") {
        let newData = dataRepository.create({
          Description: Object.values(jsonData[i])[0].toString(),
          Amount: !Number.isNaN(
            parseFloat(Object.values(jsonData[i])[1].toString())
          )
            ? parseFloat(
                Object.values(jsonData[i])[1].toString()
              ).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "-",
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
    message: "Data Stored Successfully!",
    // data: parseFloat(Object.values(jsonData[5])[3].toString()),
  });
};

export const GetExcelFiles = async (res: Response) => {
  let excelFile = await fileRepository.find();

  return res.status(200).json({
    status: "Success!",
    data: excelFile,
  });
};

export const GetTableData = async (res: Response) => {
  let dataTable = await dataRepository.find();

  return res.status(200).json({
    status: "Success!",
    data: dataTable,
  });
};

// export const UpdateTableData = async (
//   updateData: IUpdateData,
//   id: string,
//   res: Response
// ) => {
//   let checkID = await dataRepository.findOne({
//     where: {
//       id: parseInt(id),
//     },
//   });
//   if (!checkID) {
//     return res.status(200).json({
//       status: "Success!",
//       message: "Invalid ID!",
//     });
//   }
//   let dataTable = await dataRepository.update()
//   return res.status(200).json({
//     status: "Success!",
//     //data: dataTable,
//   });
// };

export const DeleteTableData = async (id: string, res: Response) => {
  let checkID = await dataRepository.findOne({
    where: {
      id: parseInt(id),
    },
  });

  if (!checkID) {
    return res.status(200).json({
      status: "Success!",
      message: "Invalid ID!",
    });
  }
  await dataRepository.delete({ id: parseInt(id) });

  return res.status(200).json({
    status: "Success!",
    message: "Data Removed Successfully!",
  });
};
