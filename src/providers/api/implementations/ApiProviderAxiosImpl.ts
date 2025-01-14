/* eslint-disable */

import axios from "axios";
import { JsObject } from "../../../@types/JsObject";
import { ApiProviderAxios } from "../ApiProviderAxios";

export type ApiResponse = {
  statusCode: number;
  data: any;
}

export class ApiProviderAxiosImpl implements ApiProviderAxios {
  private defaultHeaders: JsObject = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  async get(url: string, headers?: JsObject): Promise<ApiResponse> {
    const axiosRes = await axios.get(url, {
        headers: {
          ...this.defaultHeaders,
          ...headers
        }
      }
    ).catch((err) => err.response);

    return {
      statusCode: axiosRes.status,
      data: axiosRes.data
    }
  }

  async post(url: string, data: JsObject, headers?: JsObject): Promise<ApiResponse> {
    const axiosRes = await axios.post(url, data, {
        headers: {
          ...this.defaultHeaders,
          ...headers
        },
      }
    ).catch((err) => err.response);

    return {
      statusCode: axiosRes.status,
      data: axiosRes.data
    }
  }

  async patch(url: string, data: JsObject, headers?: JsObject): Promise<ApiResponse> {
    const axiosRes = await axios.patch(url, data, {
        headers: {
          ...this.defaultHeaders,
          ...headers
        }
      }
    ).catch((err) => err.response);

    return {
      statusCode: axiosRes.status,
      data: axiosRes.data
    }
  }

  async put(url: string, data: JsObject, headers?: JsObject): Promise<ApiResponse> {
    const axiosRes = await axios.put(url, data, {
        headers: {
          ...this.defaultHeaders,
          ...headers
        }
      }
    ).catch((err) => err.response);

    return {
      statusCode: axiosRes.status,
      data: axiosRes.data
    }
  }

  async delete(url: string, headers?: JsObject): Promise<ApiResponse> {
    const axiosRes = await axios.delete(url, {
        headers: {
          ...this.defaultHeaders,
          ...headers
        },
      }
    ).catch((err) => err.response);

    return {
      statusCode: axiosRes.status,
      data: axiosRes.data
    }
  }
}