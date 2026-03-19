import { calculateTotal, isFriday } from "./pricing";

export interface ReservationData {
  name: string;
  email: string;
  phone: string;
  city: string;
  packages: { nerfWar: boolean; lawnGames: boolean };
  selectedGames: string[];
  lawnGameCount: number;
  pickupDate: string;
  estimatedGuests: string;
  message: string;
  totalPrice: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export function validateReservation(data: ReservationData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) errors.name = "Name is required";
  if (!EMAIL_RE.test(data.email)) errors.email = "Valid email is required";
  if (!data.phone.trim()) errors.phone = "Phone is required";
  if (!data.city.trim()) errors.city = "City is required";

  if (!data.packages.nerfWar && !data.packages.lawnGames) {
    errors.packages = "Select at least one package";
  }

  if (!data.pickupDate) {
    errors.pickupDate = "Pickup date is required";
  } else if (!isFriday(data.pickupDate)) {
    errors.pickupDate = "Pickup date must be a Friday";
  } else {
    const pickup = new Date(data.pickupDate + "T00:00:00Z");
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (pickup <= today) {
      errors.pickupDate = "Pickup date must be in the future";
    }
  }

  const expectedTotal = calculateTotal(data.packages, data.lawnGameCount);
  if (data.totalPrice !== expectedTotal) {
    errors.totalPrice = "Price mismatch — please refresh and try again";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
