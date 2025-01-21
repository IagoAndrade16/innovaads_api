import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UniqueEntityID } from "../../../entities/UniqueEntityID";
import { typeormIdTransformer } from "../../../../infra/database/typeorm/transformers/TypeOrmIdTransformer";


@Entity('users_auth_2fa')
export class User2FA {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({
    transformer: typeormIdTransformer,
  })
  id: UniqueEntityID;

  @Column({ 
    type: 'varchar', 
    length: '100', 
    nullable: false, 
    transformer: typeormIdTransformer,
  })
  userId: UniqueEntityID;

  @Column({ type: 'varchar', length: '100', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  code: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  alreadyUsed: boolean;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: 'now()', onUpdate: 'now()' })
  updatedAt: Date;
}