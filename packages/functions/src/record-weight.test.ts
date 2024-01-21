import { APIGatewayProxyEventV2, Context } from "aws-lambda";
import { expect, it } from "vitest";
import { handler } from "./record-weight";

it(
  "should get todays weight from training peaks",
  async () => {
    expect(handler).toBeDefined();

    const { statusCode, body } = await handler(
      {} as APIGatewayProxyEventV2,
      {} as Context
    );

    expect({ statusCode, body }).toMatchObject({
      statusCode: 200,
      body: expect.stringContaining("Todays weight:"),
    });
  },
  {
    timeout: 20000,
  }
);
