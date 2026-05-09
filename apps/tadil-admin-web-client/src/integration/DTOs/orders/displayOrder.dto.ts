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
  city?: string;
}
