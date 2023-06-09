import "reflect-metadata";
import { DataSource } from "typeorm";
import { UploadedFile } from "./model/file_upload.entity";
import { ExtractedData } from "./model/extracted_data.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "excelimport",
  synchronize: true,
  logging: false,
  entities: [UploadedFile, ExtractedData],
  migrations: [],
  subscribers: [],
});
