export * from "./models";
export * from "./informations";
export * from "./alterations";
export * from "./extras";
export * from "./users";
export * from "./orders/displayOrder.dto";
export * from "./orders/displayOrderDetails.dto";

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}
