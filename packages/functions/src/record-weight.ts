import playwright from "playwright-core";
import { ApiHandler } from "sst/node/api";
const chromium = require("@sparticuz/chromium");

const LOCAL_CHROMIUM_PATH =
  "~/Library/Caches/ms-playwright/chromium-1091/chrome-mac/Chromium.app/Contents/MacOS/Chromium";

const recordVideo = false;

export const handler = ApiHandler(async (_evt) => {
  const isLambdaEnv = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const browser = await playwright.chromium.launch(
    isLambdaEnv
      ? {
          args: chromium.args,
          executablePath:
            (await chromium.executablePath()) || LOCAL_CHROMIUM_PATH,
          headless: true,
        }
      : {}
  );

  const context = await browser.newContext(
    !isLambdaEnv
      ? {
          recordVideo: {
            dir: "videos/",
            size: {
              width: 800,
              height: 600,
            },
          },
        }
      : {}
  );

  const page = await context.newPage();

  await page.goto("https://home.trainingpeaks.com/login");

  await page.getByPlaceholder("Username").fill("markgibaud");
  await page.getByPlaceholder("Password").fill("kanekane9");

  await page.waitForSelector("#onetrust-accept-btn-handler");
  await page.click("#onetrust-accept-btn-handler");

  await page.click("#btnSubmit");

  await page.waitForURL("https://app.trainingpeaks.com/");

  await page.waitForSelector(".appHeaderMainNavigationButtons.calendar");
  await page.click(".appHeaderMainNavigationButtons.calendar");

  await page.waitForSelector(".today .metricsKeyStat");
  const weightElement = page.locator(".today .metricsKeyStat");
  const weight = await weightElement.last().textContent();
  const measurement = weight?.replace("Weight:", "").replace("kg", "").trim();

  await browser.close();

  return {
    statusCode: 200,
    body: `Todays weight: ${weight}`,
  };
});
