import Weight from "@weight-watcher-xls/core/model/model";
import { Events } from "@weight-watcher-xls/core/weight";
import google from "googleapis";
import { EventHandler } from "sst/node/event-bus";

const goalsSpreadSheetId = "1-dRXcAOelSfz4cCtVf9FZ-9n_aSbux4qFr1TSmfpOI0";

export const handler = EventHandler(Events.WeightRecorded, async (evt) => {
  console.log("weight recorded", JSON.stringify(evt, null, 2));

  const allWeights = await Weight.find({
    GSI1PK: "TYPE#$WEIGHT",
  });

  console.log("allWeights", allWeights);

  const eightyFives = allWeights.filter((w) => w.weight <= 85.9);
  const eightySixes = allWeights.filter(
    (w) => w.weight >= 86 && w.weight <= 86.9
  );
  const eightySevens = allWeights.filter(
    (w) => w.weight >= 87 && w.weight <= 87.9
  );

  const auth = new google.Auth.GoogleAuth({
    keyFile: "google-creds.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = new google.sheets_v4.Sheets({ auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D22",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightyFives.length]],
    },
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D21",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightySixes.length]],
    },
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D20",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightySevens.length]],
    },
  });
});
