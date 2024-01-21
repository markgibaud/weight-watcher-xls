import { SSTConfig } from "sst";
import { API } from "./stacks/WeightWatcherStack";

export default {
  config(_input) {
    return {
      name: "weight-watcher-xls",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
