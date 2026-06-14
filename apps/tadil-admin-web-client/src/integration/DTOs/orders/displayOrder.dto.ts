export interface DisplayOrderDTO {
  id: string;
  reference: string;
  date: string;
  totalPrice: number;
  status: string;
  customerId: string;
  assignedTailorId?: string;
  assignedCourierId?: string;
  assignedReturnCourierId?: string;
  customerName?: string;
  tailorName?: string;
  courierName?: string;
  cityNameAr?: string;
  cityNameEn?: string;
  cityNameBn?: string;
  cityNameHi?: string;
  cityNameUr?: string;
  districtNameAr?: string;
  districtNameEn?: string;
  districtNameBn?: string;
  districtNameHi?: string;
  districtNameUr?: string;
  history?: { status: string; timestamp: string }[];
}
