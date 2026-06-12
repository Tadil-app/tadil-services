export interface CreateUserDTO {
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
  cityNameBn?: string;
  cityNameHi?: string;
  cityNameUr?: string;
  districtId?: string;
  districtNameAr?: string;
  districtNameEn?: string;
  districtNameBn?: string;
  districtNameHi?: string;
  districtNameUr?: string;
  street?: string;
  streetAr?: string;
  streetEn?: string;
  streetBn?: string;
  streetHi?: string;
  streetUr?: string;
  latitude?: number;
  longitude?: number;
}
