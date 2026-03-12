import { describe, it, expect } from "vitest";
import { isValidEmail } from "./validation";

describe("isValidEmail (subscribe context)", () => {
  it("accepts valid email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects missing @", () => {
    expect(isValidEmail("testexample.com")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(isValidEmail("test@")).toBe(false);
  });
});
