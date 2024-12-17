import { JsObject } from "../../@types/JsObject"
import { ApiResponse } from "./implementations/ApiProviderAxiosImpl"

export type ApiProviderAxios = {
  get(url: string, headers?: JsObject): Promise<ApiResponse>;
  post(url:string, data: JsObject, headers?: JsObject): Promise<ApiResponse>;
  patch(url:string, data: JsObject, headers?: JsObject): Promise<ApiResponse>;
  put(url:string, data: JsObject, headers?: JsObject): Promise<ApiResponse>;
  delete(url:string, headers?: JsObject): Promise<ApiResponse>;
}

export const apiProviderAxiosAlias = 'ApiProviderAxios' as const;