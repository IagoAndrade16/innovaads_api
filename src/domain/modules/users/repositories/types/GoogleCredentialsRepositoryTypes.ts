export type InsertGoogleCrentialInput = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;
  expiresRefreshIn: Date;
}