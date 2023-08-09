import webdriver from "selenium-webdriver";
import {
  DeviceFarmClient,
  CreateTestGridUrlCommand,
} from "@aws-sdk/client-device-farm";

// const PROJECT_ARN =
//   "arn:aws:devicefarm:us-west-2:111122223333:testgrid-project:123e4567-e89b-12d3-a456-426655440000";
// var devicefarm = new AWS.DeviceFarm({ region: "us-west-2" });

const PROJECT_ARN =
  "arn:aws:devicefarm:us-west-2:561624862292:testgrid-project:68ad964a-c654-4798-bda9-1b41cf31b4c7";

// Note: Device Farm is only available in the us-west-2 (Oregon) region.
const client = new DeviceFarmClient({ region: "us-west-2" });

(async () => {
  // CreateTestGridUrlRequest
  const input = {
    projectArn: PROJECT_ARN, // required
    expiresInSeconds: 600, // required
  };
  const command = new CreateTestGridUrlCommand(input);
  const testGridUrlResult = await client.send(command);
  // Get the endpoint to create a new session

  console.log("Created url result:", testGridUrlResult);
  runExample(testGridUrlResult.url);
})().catch((e) => console.error(e));

let driver;
const runExample = async (urlString) => {
  console.log("Starting WebDriverJS remote driver");
  driver = await new webdriver.Builder()
    .usingServer(urlString)
    .withCapabilities({ browserName: "chrome" })
    .build();

  // Listen to the JS Exceptions and register callbacks to process the exception details.
  // https://www.selenium.dev/documentation/webdriver/bidirectional/bidi_api/#listen-to-js-exceptions
  const cdpConnection = await driver.createCDPConnection("page");
  await driver.onLogException(cdpConnection, function (event) {
    console.log(event["exceptionDetails"]);
  });

  console.log("New session created:", driver.getSession());

  // The website you want to test
  // await driver.get("https://aws.amazon.com/");
  await driver.get(
    "http://awsdevicefarmpoc.s3-website-ap-southeast-2.amazonaws.com"
  );

  const title = await driver.getTitle();
  console.log("Title was: " + title);

  console.log("Deleting session...");
  await driver.quit();
};
