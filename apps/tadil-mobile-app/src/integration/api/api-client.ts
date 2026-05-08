/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  DisplayModelDTO,
  DisplayModelImageDTO,
  DisplayAlterationDTO,
  DisplayOrderDTO,
  LoginDto,
  CompleteProfileDto,
  AuthResponseDto,
  UpdateProfileDto,
  User,
} from "../dtos";
export interface UploadFileDto {
  file: File;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title tadil-mobile-api
 * @version 1.0
 * @contact
 *
 * tadil-mobile-api
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Courier
     * @name CourierControllerGetOrders
     * @request GET:/api/courier/{id}/orders
     */
    courierControllerGetOrders: (id: string, params: RequestParams = {}) =>
      this.request<DisplayOrderDTO[], any>({
        path: `/api/courier/${id}/orders`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Courier
     * @name CourierControllerAccept
     * @request POST:/api/courier/{id}/orders/{orderId}/accept
     */
    courierControllerAccept: (
      id: string,
      orderId: string,
      query: { isReturn: string },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/courier/${id}/orders/${orderId}/accept`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Courier
     * @name CourierControllerDecline
     * @request POST:/api/courier/{id}/orders/{orderId}/decline
     */
    courierControllerDecline: (
      id: string,
      orderId: string,
      query: { isReturn: string },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/courier/${id}/orders/${orderId}/decline`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Courier
     * @name CourierControllerPickup
     * @request POST:/api/courier/{id}/orders/{orderId}/pickup
     */
    courierControllerPickup: (
      id: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/courier/${id}/orders/${orderId}/pickup`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Courier
     * @name CourierControllerDeliver
     * @request POST:/api/courier/{id}/orders/{orderId}/deliver
     */
    courierControllerDeliver: (
      id: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/courier/${id}/orders/${orderId}/deliver`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailor
     * @name TailorControllerConfirmReceipt
     * @request POST:/api/tailor/{id}/orders/{orderId}/confirm-receipt
     */
    tailorControllerConfirmReceipt: (
      id: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tailor/${id}/orders/${orderId}/confirm-receipt`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailor
     * @name TailorControllerMarkReady
     * @request POST:/api/tailor/{id}/orders/{orderId}/mark-ready
     */
    tailorControllerMarkReady: (
      id: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tailor/${id}/orders/${orderId}/mark-ready`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerControllerConfirmReceipt
     * @request POST:/api/customer/orders/{orderId}/confirm-receipt
     */
    customerControllerConfirmReceipt: (
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/customer/orders/${orderId}/confirm-receipt`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerControllerGetModels
     * @request GET:/api/customer/models
     */
    customerControllerGetModels: (
      query?: {
        category?: "all" | "men" | "women" | "kids";
      },
      params: RequestParams = {},
    ) =>
      this.request<DisplayModelDTO[], any>({
        path: `/api/customer/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerControllerGetModelImages
     * @request GET:/api/customer/models/{id}/images
     */
    customerControllerGetModelImages: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayModelImageDTO[], any>({
        path: `/api/customer/models/${id}/images`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerControllerGetAlterations
     * @request GET:/api/customer/alterations
     */
    customerControllerGetAlterations: (
      query?: {
        sectionId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DisplayAlterationDTO[], any>({
        path: `/api/customer/alterations`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerControllerUploadFile
     * @request POST:/api/customer/files/upload
     */
    customerControllerUploadFile: (
      data: UploadFileDto,
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/api/customer/files/upload`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailor
     * @name TailorControllerGetOrders
     * @request GET:/api/tailor/{id}/orders
     */
    tailorControllerGetOrders: (id: string, params: RequestParams = {}) =>
      this.request<DisplayOrderDTO[], any>({
        path: `/api/tailor/${id}/orders`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailor
     * @name TailorControllerAcceptOrder
     * @request POST:/api/tailor/{id}/orders/{orderId}/accept
     */
    tailorControllerAcceptOrder: (
      id: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tailor/${id}/orders/${orderId}/accept`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailor
     * @name TailorControllerDeclineOrder
     * @request POST:/api/tailor/{id}/orders/{orderId}/decline
     */
    tailorControllerDeclineOrder: (
      id: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tailor/${id}/orders/${orderId}/decline`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetProfile
     * @request GET:/api/auth/me
     * @secure
     */
    authControllerGetProfile: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/api/auth/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerUpdateProfile
     * @request PUT:/api/auth/me
     * @secure
     */
    authControllerUpdateProfile: (
      data: UpdateProfileDto,
      params: RequestParams = {},
    ) =>
      this.request<User, any>({
        path: `/api/auth/me`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLogin
     * @request POST:/api/auth/login
     */
    authControllerLogin: (
      data: LoginDto,
      params: RequestParams = {},
    ) =>
      this.request<AuthResponseDto, any>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerCompleteProfile
     * @request PUT:/api/auth/complete-profile
     */
    authControllerCompleteProfile: (data: CompleteProfileDto, params: RequestParams = {}) =>
      this.request<AuthResponseDto, any>({
        path: `/api/auth/complete-profile`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags App
     * @name AppControllerGetFileStream
     * @request GET:/api/files/{id}
     */
    appControllerGetFileStream: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/files/${id}`,
        method: "GET",
        ...params,
      }),
  };
}
