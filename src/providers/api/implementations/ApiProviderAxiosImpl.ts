/* eslint-disable */

import axios from "axios";
import { JsObject } from "../../../@types/JsObject";
import { ApiHeaders, ApiProviderAxios } from "../ApiProviderAxios";

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

	async delete(url: string, params: object, headers?: ApiHeaders): Promise<ApiResponse> {
		// console.log('delete params', params);

		const axiosRes = await axios.delete(url, {
			data: params,
			headers: {
				...this.defaultHeaders,
				...headers,
			},
		}).catch((err) => err.response);

		// console.log('delete axios res', axiosRes);

		return {
			statusCode: axiosRes.status,
			data: axiosRes.data,
		};
	}
}