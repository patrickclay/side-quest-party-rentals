export const PRICING = {
  nerfWar: 60,
  lawnGames: { 1: 20, 2: 35, 3: 50, 4: 60 } as const,
};

export const GAMES = [
  { id: "connect-4", name: "Giant Connect 4" },
  { id: "axe-throwing", name: "Axe Throwing" },
  { id: "kerplunk", name: "Kerplunk" },
  { id: "giant-jenga", name: "Giant Jenga" },
  { id: "cornhole", name: "Cornhole" },
  { id: "yard-pong", name: "Giant Yard Pong" },
  { id: "ladder-ball", name: "Ladder Ball" },
  { id: "tic-tac-toe", name: "Giant Tic Tac Toe" },
] as const;

export const MAX_GAMES = 4;

export function calculateTotal(
  packages: { nerfWar: boolean; lawnGames: boolean },
  lawnGameCount: number
): number {
  let total = 0;
  if (packages.nerfWar) total += PRICING.nerfWar;
  if (packages.lawnGames && lawnGameCount > 0) {
    const clamped = Math.min(lawnGameCount, MAX_GAMES) as keyof typeof PRICING.lawnGames;
    total += PRICING.lawnGames[clamped];
  }
  return total;
}

export function getNextFriday(date: Date): Date {
  const day = date.getUTCDay(); // 0=Sun, 5=Fri
  if (day === 5) return date;
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + daysUntilFriday);
  return result;
}

export function isFriday(dateStr: string): boolean {
  return new Date(dateStr).getUTCDay() === 5;
}

export function formatWeekend(pickupDate: string): string {
  const pickup = new Date(pickupDate);
  const returnDate = new Date(pickup);
  returnDate.setUTCDate(returnDate.getUTCDate() + 3);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

  return `${fmt(pickup)} – ${fmt(returnDate)}`;
}
