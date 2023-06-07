import "reflect-metadata";
import { DataSource } from "typeorm";
import { UploadedFile } from "./model/file_upload.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "excelimport",
  synchronize: true,
  logging: false,
  entities: [UploadedFile],
  migrations: [],
  subscribers: [],
});
