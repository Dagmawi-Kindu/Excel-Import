import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 as uuidv4 } from "uuid";
@Entity({ name: "upload_file" })
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  efile: string;
}
