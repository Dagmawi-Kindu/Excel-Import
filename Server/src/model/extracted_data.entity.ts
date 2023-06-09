import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "extracted_data" })
export class ExtractedData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  Item_no: string;

  @Column({
    nullable: true,
    length: 1000,
  })
  Description: string;

  @Column({
    nullable: true,
  })
  Unit: string;

  @Column({
    nullable: true,
  })
  Quantity: string;

  @Column({
    nullable: true,
  })
  Rate: string;

  @Column({
    nullable: true,
  })
  Amount: string;
}
