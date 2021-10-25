import BN from "bn.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function lamportsToSol(lamports: number | BN): number {
  if (typeof lamports === "number") {
    return Math.abs(lamports) / LAMPORTS_PER_SOL;
  }

  let signMultiplier = 1;
  if (lamports.isNeg()) {
    signMultiplier = -1;
  }

  const absLamports = lamports.abs();
  const lamportsString = absLamports.toString(10).padStart(10, "0");
  const splitIndex = lamportsString.length - 9;
  const solString =
    lamportsString.slice(0, splitIndex) +
    "." +
    lamportsString.slice(splitIndex);
  return signMultiplier * parseFloat(solString);
}

export function lamportsToSolString(
  lamports: number | BN,
  maximumFractionDigits: number = 9
): string {
  const sol = lamportsToSol(lamports);
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(sol);
}

export function abbreviatedNumber(value: number, fixed = 1) {
  if (value < 1e3) return value;
  if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(fixed) + "K";
  if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(fixed) + "M";
  if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(fixed) + "B";
  if (value >= 1e12) return +(value / 1e12).toFixed(fixed) + "T";
}

export function normalizeTokenAmount(
  raw: string | number,
  decimals: number
): number {
  let rawTokens: number;
  if (typeof raw === "string") rawTokens = parseInt(raw, 10);
  else rawTokens = raw;
  return rawTokens / Math.pow(10, decimals);
}
