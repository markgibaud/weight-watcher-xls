import * as lambda from "aws-cdk-lib/aws-lambda";
import { Api, EventBus, StackContext, Table } from "sst/constructs";

export function API({ stack }: StackContext) {
  const bus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  const table = new Table(stack, "table", {
    fields: {
      PK: "string",
      SK: "string",
      GSI1PK: "string",
      GSI1SK: "string",
      weight: "number",
      date: "string",
    },
    primaryIndex: {
      partitionKey: "PK",
      sortKey: "SK",
    },
    globalIndexes: {
      GSI1: {
        partitionKey: "GSI1PK",
        sortKey: "GSI1SK",
      },
    },
    stream: "new_image",
    consumers: {
      stream: {
        function: {
          handler: "packages/functions/src/dynamo-stream-function.handler",
          runtime: "nodejs18.x",
          timeout: 10,
          memorySize: 512,
          environment: {
            NODE_ENV: "production",
          },
        },
      },
    },
    cdk: {
      table: {
        tableName: "weight-watcher-xls-table",
        pointInTimeRecovery: false,
      },
    },
  });

  const chromiumLayer = new lambda.LayerVersion(stack, "chromiumLayers", {
    code: lambda.Code.fromAsset("layers/chromium"),
  });

  const api = new Api(stack, "api", {
    defaults: {
      // authorizer: "iam",
      function: {
        bind: [bus],
      },
    },
    routes: {
      "GET /": {
        function: {
          functionName: "weight-watcher-xls-get",
          handler: "packages/functions/src/record-weight.handler",
          runtime: "nodejs18.x",
          timeout: 60,
          memorySize: 2048,
          layers: [chromiumLayer],
          copyFiles: [{ from: "packages/functions/src/creds", to: "." }],
          nodejs: {
            esbuild: {
              external: ["@sparticuz/chromium"],
            },
          },
          environment: {
            NODE_ENV: "production",
          },
        },
      },
    },
  });

  const fn = api.getFunction("GET /");
  fn?.attachPermissions([table, "dynamodb:PutItem"]);

  bus.subscribe("weight.recorded", {
    handler: "packages/functions/src/events/update-goals-xls.handler",
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
