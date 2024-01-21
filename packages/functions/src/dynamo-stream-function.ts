import { Events } from "@weight-watcher-xls/core/weight";
import { DynamoDBStreamEvent } from "aws-lambda";

export const handler = async (evt: DynamoDBStreamEvent) => {
  console.log("weight recorded", JSON.stringify(evt, null, 2));

  if (
    evt.Records.length &&
    evt.Records[0]?.dynamodb?.NewImage?.PK?.S === "WEIGHT#" &&
    evt.Records[0].dynamodb.NewImage.id.S &&
    evt.Records[0].dynamodb.NewImage.weight.N
  ) {
    const id = evt.Records[0].dynamodb.NewImage.id.S;
    const weight = evt.Records[0].dynamodb.NewImage.weight.N;
    await Events.WeightRecorded.publish({
      id,
      weight: Number(weight),
    });
  }
};
