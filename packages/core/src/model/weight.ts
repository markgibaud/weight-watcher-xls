import { Entity } from "dynamodb-onetable";
import { table, weightWatcherSchema } from "../dynamo/dynamo";

type weightEntity = Entity<typeof weightWatcherSchema.models.weight>;

export default table.getModel<weightEntity>("weight");
