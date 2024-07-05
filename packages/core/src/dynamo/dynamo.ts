import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Table } from "dynamodb-onetable";
const client = new DynamoDBClient({
  region: "us-east-1",
});

export const weightWatcherSchema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "PK", sort: "SK" },
    gs1: { hash: "GSI1PK", sort: "GSI1SK", follow: true },
  },
  models: {
    weight: {
      PK: { type: String, value: "WEIGHT#${id}" },
      SK: { type: String, value: "DATE#${date}" },
      GSI1PK: { type: String, value: "TYPE#$WEIGHT" },
      GSI1SK: { type: String, value: "WEIGHT#${id}" },
      id: {
        type: String,
        generate: "uuid",
      },
      weight: { type: Number, required: true },
      date: { type: String, required: true },
    },
  } as const,
  params: {
    isoDates: true,
  },
};

export const table = new Table({
  client: client,
  name: "weight-watcher-xls-table",
  schema: weightWatcherSchema,
});
