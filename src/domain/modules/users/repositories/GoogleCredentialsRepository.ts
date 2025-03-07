import { GoogleCredential } from "../entities/GoogleCredential";
import { InsertGoogleCrentialInput } from "./types/GoogleCredentialsRepositoryTypes";

export type GoogleCredentialsRepository = {
  insert(data: InsertGoogleCrentialInput): Promise<GoogleCredential>;
  findNotDeletedByUserId(userId: string): Promise<GoogleCredential | null>;
  deleteByUserId(userId: string): Promise<void>;
}

export const googleCredentialsRepositoryAlias = 'GoogleCredentialsRepository';