import { z } from "zod";
import { HttpError } from "./http-error.js";

export function validateBody<T extends z.ZodType>(schema: T, body: unknown): z.output<T> {
  const result = schema.safeParse(body);

  if (!result.success) {
    throw new HttpError(
      400,
      "Data request tidak valid",
      result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      })),
    );
  }

  return result.data;
}
