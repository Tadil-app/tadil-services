import { DisplayAddressDto, DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";

/** Which way the parcel travels on this trip. */
export type TripDirection = "toTailor" | "toCustomer";

/**
 * Where the courier is in the trip:
 * - `offer`: not accepted yet
 * - `pickup`: heading to the pickup point
 * - `dropoff`: carrying the parcel to the delivery point
 * - `completed`: delivered
 */
export type TripStage = "offer" | "pickup" | "dropoff" | "completed";

export interface TripStop {
  role: "customer" | "tailor";
  name: string;
  address: DisplayAddressDto | null;
}

export interface CourierTrip {
  direction: TripDirection;
  stage: TripStage;
  pickup: TripStop;
  dropoff: TripStop;
  /** The stop to drive to now, or null when there is nothing left to do. */
  nextStop: TripStop | null;
}

const OUTBOUND_STAGES: Record<string, TripStage> = {
  [ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT]: "offer",
  [ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER]: "pickup",
  [ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR]: "dropoff",
};

const RETURN_STAGES: Record<string, TripStage> = {
  [ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT]: "offer",
  [ORDER_STATUS.WAITING_FOR_PICKUP_FROM_TAILOR]: "pickup",
  [ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER]: "dropoff",
};

/**
 * Describes an order as a courier trip: its direction, both ends, and the
 * stop to head to next. Once a trip leaves the courier statuses (the tailor
 * is working on it, or it is done), the direction comes from which leg this
 * courier was assigned.
 */
export function getCourierTrip(order: DisplayOrderDTO, courierId?: string): CourierTrip {
  let direction: TripDirection;
  let stage: TripStage;

  if (order.status in RETURN_STAGES) {
    direction = "toCustomer";
    stage = RETURN_STAGES[order.status];
  } else if (order.status in OUTBOUND_STAGES) {
    direction = "toTailor";
    stage = OUTBOUND_STAGES[order.status];
  } else {
    const isReturnCourier = !!courierId && order.assignedReturnCourierId === courierId;
    direction = isReturnCourier ? "toCustomer" : "toTailor";
    stage = "completed";
  }

  const customer: TripStop = {
    role: "customer",
    name: order.customerName,
    address: order.address ?? null,
  };
  const tailor: TripStop = {
    role: "tailor",
    name: order.tailorName ?? "",
    address: order.tailorAddress ?? null,
  };

  const pickup = direction === "toTailor" ? customer : tailor;
  const dropoff = direction === "toTailor" ? tailor : customer;

  const nextStop =
    stage === "offer" || stage === "pickup" ? pickup : stage === "dropoff" ? dropoff : null;

  return { direction, stage, pickup, dropoff, nextStop };
}
