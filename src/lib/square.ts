import "server-only";
import { SquareClient, SquareEnvironment } from "square";

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error("SQUARE_ACCESS_TOKEN is required");
}

export const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN,
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID ?? "";
