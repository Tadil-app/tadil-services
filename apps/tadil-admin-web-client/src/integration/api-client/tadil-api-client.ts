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
import type {
  DisplayModelDTO,
  CreateModelDTO,
  AddSectionDTO,
  CreateAlterationDTO,
  DisplayAlterationDTO,
  UpdateAlterationDTO,
  UpdateModelDTO,
  CreateInformationDTO,
  DisplayInformationDTO,
  UpdateInformationDTO,
  DisplaySectionDTO,
  DisplayModelImageDTO,
  AddModelImageDTO,
  DisplayExtraDTO,
  CreateExtraDTO,
  UpdateExtraDTO,
  DisplayUserDTO,
  CreateUserDTO,
  UpdateUserDTO,
  DisplayCityDTO,
  DisplayDistrictDTO,
  DisplayBoundaryDTO,
  UpdateSectionDTO,
  DisplayOrderDTO,
  DisplayOrderDetailsDto,
} from "../DTOs";

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<
  AxiosRequestConfig,
  "data" | "params" | "url" | "responseType"
> {
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

export interface ApiConfig<SecurityDataType = unknown> extends Omit<
  AxiosRequestConfig,
  "data" | "cancelToken"
> {
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
 * @title tadil-api
 * @version 1.0
 * @contact
 *
 * tadil-api
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Locations
     * @name LocationsControllerGetCities
     * @request GET:/api/locations/cities
     */
    locationsControllerGetCities: (
      query?: {
        search?: string;
        regionId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DisplayCityDTO[], any>({
        path: `/api/locations/cities`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locations
     * @name LocationsControllerGetDistricts
     * @request GET:/api/locations/cities/{cityId}/districts
     */
    locationsControllerGetDistricts: (
      cityId: number,
      params: RequestParams = {},
    ) =>
      this.request<DisplayDistrictDTO[], any>({
        path: `/api/locations/cities/${cityId}/districts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locations
     * @name LocationsControllerGetDistrictBoundary
     * @request GET:/api/locations/districts/{districtId}/boundary
     */
    locationsControllerGetDistrictBoundary: (
      districtId: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayBoundaryDTO | null, any>({
        path: `/api/locations/districts/${districtId}/boundary`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Locations
     * @name LocationsControllerGetCityBoundary
     * @request GET:/api/locations/cities/{cityId}/boundary
     */
    locationsControllerGetCityBoundary: (
      cityId: number,
      params: RequestParams = {},
    ) =>
      this.request<DisplayBoundaryDTO | null, any>({
        path: `/api/locations/cities/${cityId}/boundary`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerGetModels
     * @request GET:/api/models
     */
    modelsControllerGetModels: (params: RequestParams = {}) =>
      this.request<DisplayModelDTO[], any>({
        path: `/api/models`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerCreateModel
     * @request POST:/api/models/create
     */
    modelsControllerCreateModel: (
      data: CreateModelDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/models/create`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerAddSection
     * @request POST:/api/models/images/{id}/sections/add
     */
    modelsControllerAddSection: (
      id: string,
      data: AddSectionDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/models/images/${id}/sections/add`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerUpdateSection
     * @request PATCH:/api/models/images/sections/{id}/update
     */
    modelsControllerUpdateSection: (
      id: string,
      data: UpdateSectionDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/models/images/sections/${id}/update`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerDeleteModelImage
     * @request DELETE:/api/models/images/{id}/delete
     */
    modelsControllerDeleteModelImage: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/models/images/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerGetSections
     * @request GET:/api/models/images/sections
     */
    modelsControllerGetSections: (params: RequestParams = {}) =>
      this.request<DisplaySectionDTO[], any>({
        path: `/api/models/images/sections`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerDeleteSection
     * @request DELETE:/api/models/images/sections/{id}/delete
     */
    modelsControllerDeleteSection: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/models/images/sections/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerGetModelImages
     * @request GET:/api/models/{id}/images
     */
    modelsControllerGetModelImages: (id: string, params: RequestParams = {}) =>
      this.request<DisplayModelImageDTO[], any>({
        path: `/api/models/${id}/images`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerAddModelImage
     * @request POST:/api/models/{id}/images/add
     */
    modelsControllerAddModelImage: (
      id: string,
      data: AddModelImageDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/models/${id}/images/add`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerUpdateModel
     * @request PATCH:/api/models/{id}/update
     */
    modelsControllerUpdateModel: (
      id: string,
      data: UpdateModelDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/models/${id}/update`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Models
     * @name ModelsControllerDeleteModel
     * @request DELETE:/api/models/{id}/delete
     */
    modelsControllerDeleteModel: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/models/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Informations
     * @name InformationsControllerGetInformations
     * @request GET:/api/informations
     */
    informationsControllerGetInformations: (params: RequestParams = {}) =>
      this.request<DisplayInformationDTO[], any>({
        path: `/api/informations`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Informations
     * @name InformationsControllerGetInformationById
     * @request GET:/api/informations/{id}
     */
    informationsControllerGetInformationById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayInformationDTO, any>({
        path: `/api/informations/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Informations
     * @name InformationsControllerCreateInformation
     * @request POST:/api/informations/create
     */
    informationsControllerCreateInformation: (
      data: CreateInformationDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/informations/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Informations
     * @name InformationsControllerUpdateInformation
     * @request PUT:/api/informations/{id}/update
     */
    informationsControllerUpdateInformation: (
      id: string,
      data: UpdateInformationDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/informations/${id}/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Informations
     * @name InformationsControllerDeleteInformation
     * @request DELETE:/api/informations/delete/{id}
     */
    informationsControllerDeleteInformation: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/informations/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alterations
     * @name AlterationsControllerGetAlterations
     * @request GET:/api/alterations
     */
    alterationsControllerGetAlterations: (params: RequestParams = {}) =>
      this.request<DisplayAlterationDTO[], any>({
        path: `/api/alterations`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alterations
     * @name AlterationsControllerGetAlterationById
     * @request GET:/api/alterations/{id}
     */
    alterationsControllerGetAlterationById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayAlterationDTO, any>({
        path: `/api/alterations/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alterations
     * @name AlterationsControllerCreateAlteration
     * @request POST:/api/alterations/create
     */
    alterationsControllerCreateAlteration: (
      data: CreateAlterationDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/alterations/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alterations
     * @name AlterationsControllerUpdateAlteration
     * @request PUT:/api/alterations/update/{id}
     */
    alterationsControllerUpdateAlteration: (
      id: string,
      data: UpdateAlterationDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/alterations/update/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alterations
     * @name AlterationsControllerDeleteAlteration
     * @request DELETE:/api/alterations/delete/{id}
     */
    alterationsControllerDeleteAlteration: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/alterations/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extras
     * @name ExtrasControllerGetExtras
     * @request GET:/api/extras
     */
    extrasControllerGetExtras: (params: RequestParams = {}) =>
      this.request<DisplayExtraDTO[], any>({
        path: `/api/extras`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extras
     * @name ExtrasControllerGetExtraById
     * @request GET:/api/extras/{id}
     */
    extrasControllerGetExtraById: (id: string, params: RequestParams = {}) =>
      this.request<DisplayExtraDTO, any>({
        path: `/api/extras/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extras
     * @name ExtrasControllerCreateExtra
     * @request POST:/api/extras/create
     */
    extrasControllerCreateExtra: (
      data: CreateExtraDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/extras/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extras
     * @name ExtrasControllerUpdateExtra
     * @request PUT:/api/extras/update/{id}
     */
    extrasControllerUpdateExtra: (
      id: string,
      data: UpdateExtraDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/extras/update/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extras
     * @name ExtrasControllerDeleteExtra
     * @request DELETE:/api/extras/delete/{id}
     */
    extrasControllerDeleteExtra: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/extras/delete/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailors
     * @name TailorsControllerGetTailors
     * @request GET:/api/tailors
     */
    tailorsControllerGetTailors: (params: RequestParams = {}) =>
      this.request<DisplayUserDTO[], any>({
        path: `/api/tailors`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailors
     * @name TailorsControllerGetTailorByPhone
     * @request GET:/api/tailors/phone/{phone}
     */
    tailorsControllerGetTailorByPhone: (
      phone: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayUserDTO, any>({
        path: `/api/tailors/phone/${phone}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailors
     * @name TailorsControllerCreateTailor
     * @request POST:/api/tailors/create
     */
    tailorsControllerCreateTailor: (
      data: CreateUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tailors/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailors
     * @name TailorsControllerGetTailorById
     * @request GET:/api/tailors/{id}
     */
    tailorsControllerGetTailorById: (id: string, params: RequestParams = {}) =>
      this.request<DisplayUserDTO, any>({
        path: `/api/tailors/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailors
     * @name TailorsControllerUpdateTailor
     * @request PUT:/api/tailors/{id}/update
     */
    tailorsControllerUpdateTailor: (
      id: string,
      data: UpdateUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/tailors/${id}/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Tailors
     * @name TailorsControllerDeleteTailor
     * @request DELETE:/api/tailors/{id}/delete
     */
    tailorsControllerDeleteTailor: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/tailors/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Couriers
     * @name CouriersControllerGetCouriers
     * @request GET:/api/couriers
     */
    couriersControllerGetCouriers: (params: RequestParams = {}) =>
      this.request<DisplayUserDTO[], any>({
        path: `/api/couriers`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Couriers
     * @name CouriersControllerGetCourierByPhone
     * @request GET:/api/couriers/phone/{phone}
     */
    couriersControllerGetCourierByPhone: (
      phone: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayUserDTO, any>({
        path: `/api/couriers/phone/${phone}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Couriers
     * @name CouriersControllerCreateCourier
     * @request POST:/api/couriers/create
     */
    couriersControllerCreateCourier: (
      data: CreateUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/couriers/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Couriers
     * @name CouriersControllerGetCourierById
     * @request GET:/api/couriers/{id}
     */
    couriersControllerGetCourierById: (
      id: string,
      params: RequestParams = {},
    ) =>
      this.request<DisplayUserDTO, any>({
        path: `/api/couriers/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Couriers
     * @name CouriersControllerUpdateCourier
     * @request PUT:/api/couriers/{id}/update
     */
    couriersControllerUpdateCourier: (
      id: string,
      data: UpdateUserDTO,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/couriers/${id}/update`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Couriers
     * @name CouriersControllerDeleteCourier
     * @request DELETE:/api/couriers/{id}/delete
     */
    couriersControllerDeleteCourier: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/couriers/${id}/delete`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerGetOrders
     * @request GET:/api/orders
     */
    ordersControllerGetOrders: (
      query?: {
        status?: string;
        tailorId?: string;
        courierId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DisplayOrderDTO[], any>({
        path: `/api/orders`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerGetOrderById
     * @request GET:/api/orders/{id}
     */
    ordersControllerGetOrderById: (id: string, params: RequestParams = {}) =>
      this.request<DisplayOrderDetailsDto, any>({
        path: `/api/orders/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders
     * @name OrdersControllerAssignTailor
     * @request POST:/api/orders/{id}/assign-tailor
     */
    ordersControllerAssignTailor: (
      id: string,
      tailorId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/orders/${id}/assign-tailor`,
        method: "POST",
        body: tailorId,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payout Requests
     * @name PayoutRequestsControllerGetPending
     * @request GET:/api/payout-requests
     */
    payoutRequestsControllerGetPending: (params: RequestParams = {}) =>
      this.request<any[], any>({
        path: `/api/payout-requests`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payout Requests
     * @name PayoutRequestsControllerFulfill
     * @request POST:/api/payout-requests/{id}/fulfill
     */
    payoutRequestsControllerFulfill: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/payout-requests/${id}/fulfill`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Payout Requests
     * @name PayoutRequestsControllerReject
     * @request POST:/api/payout-requests/{id}/reject
     */
    payoutRequestsControllerReject: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/payout-requests/${id}/reject`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Login Requests
     * @name LoginRequestsControllerGetPending
     * @request GET:/api/login-requests/pending
     */
    loginRequestsControllerGetPending: (params: RequestParams = {}) =>
      this.request<DisplayUserDTO[], any>({
        path: `/api/login-requests/pending`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Login Requests
     * @name LoginRequestsControllerApprove
     * @request POST:/api/login-requests/{id}/approve
     */
    loginRequestsControllerApprove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/login-requests/${id}/approve`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Login Requests
     * @name LoginRequestsControllerReject
     * @request POST:/api/login-requests/{id}/reject
     */
    loginRequestsControllerReject: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/login-requests/${id}/reject`,
        method: "POST",
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
