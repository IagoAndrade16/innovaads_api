import { FacebookCredential } from "../entities/FacebookCredential";
import { SaveFacebookCredentialInput } from "./types/FacebookCredentialsRepositoryTypes";

export type FacebookCredentialsRepository = {
  save(credentials: SaveFacebookCredentialInput): Promise<FacebookCredential>;
  findNotDeletedByUserId(userId: string): Promise<FacebookCredential | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export const facebookCredentialsRepositoryAlias = 'FacebookCredentialsRepository';