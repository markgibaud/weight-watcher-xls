export * as Todo from "./weight";
import { z } from "zod";

import { event } from "./event";

export const Events = {
  WeightRecorded: event(
    "weight.recorded",
    z.object({
      id: z.string(),
      weight: z.number(),
    })
  ),
};
