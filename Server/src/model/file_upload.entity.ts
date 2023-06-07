import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UploadedFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  efile: string;
}
