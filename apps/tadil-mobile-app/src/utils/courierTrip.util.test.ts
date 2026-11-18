import { describe, expect, it } from "vitest";
import { DisplayAddressDto, DisplayOrderDTO, ORDER_STATUS } from "@/integration/dtos";
import { getCourierTrip } from "./courierTrip.util";

const customerAddress = { id: "a-customer" } as DisplayAddressDto;
const tailorAddress = { id: "a-tailor" } as DisplayAddressDto;

function order(status: string, extra: Partial<DisplayOrderDTO> = {}): DisplayOrderDTO {
  return {
    id: "o1",
    customerId: "c1",
    customerName: "Client Name",
    reference: "R1",
    date: "2026-01-01",
    totalPrice: 10,
    status,
    items: [],
    customItems: [],
    history: [],
    address: customerAddress,
    tailorName: "Tailor Name",
    tailorAddress,
    ...extra,
  };
}

describe("getCourierTrip", () => {
  it("goes from the client to the tailor on the outbound leg", () => {
    const trip = getCourierTrip(order(ORDER_STATUS.WAITING_FOR_PICKUP_FROM_CUSTOMER));
    expect(trip.direction).toBe("toTailor");
    expect(trip.stage).toBe("pickup");
    expect(trip.pickup.role).toBe("customer");
    expect(trip.pickup.address).toBe(customerAddress);
    expect(trip.dropoff.role).toBe("tailor");
    expect(trip.dropoff.address).toBe(tailorAddress);
    expect(trip.nextStop?.role).toBe("customer");
  });

  it("heads to the tailor once the parcel is picked up", () => {
    const trip = getCourierTrip(order(ORDER_STATUS.WAITING_FOR_DROPOFF_TO_TAILOR));
    expect(trip.stage).toBe("dropoff");
    expect(trip.nextStop?.role).toBe("tailor");
  });

  it("goes from the tailor to the client on the return leg", () => {
    const offer = getCourierTrip(order(ORDER_STATUS.WAITING_FOR_RETURN_COURIER_ASSIGNMENT));
    expect(offer.direction).toBe("toCustomer");
    expect(offer.stage).toBe("offer");
    expect(offer.pickup.role).toBe("tailor");
    expect(offer.nextStop?.role).toBe("tailor");

    const delivering = getCourierTrip(order(ORDER_STATUS.WAITING_FOR_DROPOFF_TO_CUSTOMER));
    expect(delivering.nextStop?.role).toBe("customer");
  });

  it("uses the assigned leg once the trip is over", () => {
    const done = order(ORDER_STATUS.DONE, { assignedReturnCourierId: "me" });
    expect(getCourierTrip(done, "me").direction).toBe("toCustomer");
    expect(getCourierTrip(done, "someone-else").direction).toBe("toTailor");
    expect(getCourierTrip(done, "me").nextStop).toBeNull();

    const atTailor = getCourierTrip(order(ORDER_STATUS.IN_PROGRESS, { assignedCourierId: "me" }), "me");
    expect(atTailor.direction).toBe("toTailor");
    expect(atTailor.stage).toBe("completed");
  });

  it("copes with a missing tailor", () => {
    const trip = getCourierTrip(order(ORDER_STATUS.WAITING_FOR_COURIER_ASSIGNMENT, {
      tailorName: undefined,
      tailorAddress: undefined,
    }));
    expect(trip.dropoff.name).toBe("");
    expect(trip.dropoff.address).toBeNull();
  });
});
