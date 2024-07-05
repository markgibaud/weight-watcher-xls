import { Entity, Model } from "dynamodb-onetable";
import { table, weightWatcherSchema } from "../dynamo/schema";

type weightEntity = Entity<typeof weightWatcherSchema.models.Weight>;

export default table.getModel<weightEntity>("Weight");
