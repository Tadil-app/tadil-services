export interface UpdateUserDTO {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  commissionRate?: number;
  /** Legacy free-text city. Prefer the structured address fields below. */
  city?: string;
  cityId?: number;
  cityNameAr?: string;
  cityNameEn?: string;
  districtId?: string;
  districtNameAr?: string;
  districtNameEn?: string;
  street?: string;
  latitude?: number;
  longitude?: number;
}
