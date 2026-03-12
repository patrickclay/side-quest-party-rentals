import { describe, it, expect } from "vitest";
import { calculateTotal, PRICING, getNextFriday } from "./pricing";

describe("calculateTotal", () => {
  it("returns $60 for nerf war only", () => {
    expect(calculateTotal({ nerfWar: true, lawnGames: false }, 0)).toBe(60);
  });

  it("returns $20 for 1 lawn game", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 1)).toBe(20);
  });

  it("returns $35 for 2 lawn games", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 2)).toBe(35);
  });

  it("returns $50 for 3 lawn games", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 3)).toBe(50);
  });

  it("returns $60 for 4 lawn games", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 4)).toBe(60);
  });

  it("returns $110 for nerf war + 3 lawn games", () => {
    expect(calculateTotal({ nerfWar: true, lawnGames: true }, 3)).toBe(110);
  });

  it("returns 0 when no packages selected", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: false }, 0)).toBe(0);
  });

  it("ignores lawn game count when lawn games not selected", () => {
    expect(calculateTotal({ nerfWar: true, lawnGames: false }, 3)).toBe(60);
  });

  it("clamps lawn game count to max 4", () => {
    expect(calculateTotal({ nerfWar: false, lawnGames: true }, 6)).toBe(60);
  });
});

describe("getNextFriday", () => {
  it("returns same date if already Friday", () => {
    const friday = new Date("2026-06-12"); // a Friday
    expect(getNextFriday(friday).toISOString().slice(0, 10)).toBe("2026-06-12");
  });

  it("snaps Saturday forward to next Friday (6 days)", () => {
    const saturday = new Date("2026-06-13");
    expect(getNextFriday(saturday).toISOString().slice(0, 10)).toBe("2026-06-19");
  });

  it("snaps Wednesday forward to next Friday (2 days)", () => {
    const wednesday = new Date("2026-06-10");
    expect(getNextFriday(wednesday).toISOString().slice(0, 10)).toBe("2026-06-12");
  });

  it("snaps Monday forward to next Friday (4 days)", () => {
    const monday = new Date("2026-06-08");
    expect(getNextFriday(monday).toISOString().slice(0, 10)).toBe("2026-06-12");
  });
});
