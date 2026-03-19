import { describe, it, expect } from "vitest";
import { validateReservation } from "./validation";

describe("validateReservation", () => {
  const validData = {
    name: "John Smith",
    email: "john@example.com",
    phone: "7705550199",
    city: "Lilburn",
    packages: { nerfWar: true, lawnGames: false },
    selectedGames: [],
    lawnGameCount: 0,
    pickupDate: "2026-06-12", // a Friday
    estimatedGuests: "11-20",
    message: "",
    totalPrice: 60,
  };

  it("passes with valid data", () => {
    expect(validateReservation(validData)).toEqual({ valid: true, errors: {} });
  });

  it("fails with missing name", () => {
    const result = validateReservation({ ...validData, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("fails with invalid email", () => {
    const result = validateReservation({ ...validData, email: "notanemail" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("fails with non-Friday pickup date", () => {
    const result = validateReservation({ ...validData, pickupDate: "2026-06-10" });
    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toBeDefined();
  });

  it("fails with no packages selected", () => {
    const result = validateReservation({
      ...validData,
      packages: { nerfWar: false, lawnGames: false },
      totalPrice: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.packages).toBeDefined();
  });

  it("fails with a past pickup date", () => {
    const result = validateReservation({ ...validData, pickupDate: "2024-01-05" });
    expect(result.valid).toBe(false);
    expect(result.errors.pickupDate).toBeDefined();
  });

  it("fails with today's date as pickup date", () => {
    const today = new Date();
    const day = today.getUTCDay();
    const daysUntilFriday = day === 5 ? 0 : (5 - day + 7) % 7;
    if (daysUntilFriday === 0) {
      const todayStr = today.toISOString().split("T")[0];
      const result = validateReservation({ ...validData, pickupDate: todayStr, totalPrice: 60 });
      expect(result.valid).toBe(false);
      expect(result.errors.pickupDate).toContain("future");
    }
  });

  it("fails with mismatched total price", () => {
    const result = validateReservation({ ...validData, totalPrice: 999 });
    expect(result.valid).toBe(false);
    expect(result.errors.totalPrice).toBeDefined();
  });
});
