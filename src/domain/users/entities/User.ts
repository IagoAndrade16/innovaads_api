import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { find } from "../../../core/DependencyInjection";
import { JwtProvider, jwtProviderAlias } from "../../../providers/jwt/JwtProvider";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  static async generateUserToken(input: {
    id: string;
  }): Promise<string> {
    const jwtProvider = find<JwtProvider>(jwtProviderAlias);

    return jwtProvider.sign({ id: input.id });
  }
}