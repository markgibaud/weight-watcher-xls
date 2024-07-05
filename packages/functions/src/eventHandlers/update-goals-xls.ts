import Weight from "@weight-watcher-xls/core/model/weight";
import { Events } from "@weight-watcher-xls/core/weight";
import google from "googleapis";
import { EventHandler } from "sst/node/event-bus";

const goalsSpreadSheetId = "1-dRXcAOelSfz4cCtVf9FZ-9n_aSbux4qFr1TSmfpOI0";

export const handler = EventHandler(Events.WeightRecorded, async (evt) => {
  const allWeights = await Weight.find(
    {},
    {
      index: "GSI1",
    }
  );

  const eightyThrees = allWeights.filter((w) => w.weight <= 83.9);
  const eightyFours = allWeights.filter((w) => w.weight <= 84.9);
  const eightyFives = allWeights.filter((w) => w.weight <= 85.9);
  const eightySixes = allWeights.filter(
    (w) => w.weight >= 86 && w.weight <= 86.9
  );
  const eightySevens = allWeights.filter(
    (w) => w.weight >= 87 && w.weight <= 87.9
  );

  console.log("eightyThrees", eightyThrees);
  console.log("eightyFours", eightyFours);
  console.log("eightyFives", eightyFives);
  console.log("eightySixes", eightySixes);
  console.log("eightySevens", eightySevens);

  const auth = new google.Auth.GoogleAuth({
    keyFile: "google-creds.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = new google.sheets_v4.Sheets({ auth });

  await sheets.spreadsheets.values.update({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D24",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightyThrees.length]],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D23",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightyFours.length]],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D22",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightyFives.length]],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D21",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightySixes.length]],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: goalsSpreadSheetId,
    range: "2024!D20",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[eightySevens.length]],
    },
  });
});
