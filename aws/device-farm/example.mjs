import webdriver from "selenium-webdriver";
import {
  DeviceFarmClient,
  CreateTestGridUrlCommand,
} from "@aws-sdk/client-device-farm";
import assert from "assert";

const { By, Key } = webdriver;

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
  // const cdpConnection = await driver.createCDPConnection("page");
  // await driver.onLogException(cdpConnection, function (event) {
  //   console.log(event["exceptionDetails"]);
  // });

  console.log("New session created:", driver.getSession());

  // The website you want to test
  // await driver.get("https://aws.amazon.com/");
  await driver.get(
    "http://awsdevicefarmpoc.s3-website-ap-southeast-2.amazonaws.com"
  );

  // Check on home page
  let title = await driver.getTitle();
  assert.strictEqual(title, "AWS Device Farm POC", "should be on home page");
  // console.log("Title was: " + title);

  // Go to the login page
  let loginButton = driver.findElement(By.className("test-login-button"));
  // assert.ok(loginButton, "home page login button found");
  await loginButton.click();

  title = await driver.getTitle();
  console.log("Title was: " + title);
  assert.match(title, /^Login/, "should be on login page");

  // Login
  const clientNumber = driver.findElement(By.id("Input-clientNumber"));
  await clientNumber.sendKeys("123456789");
  const pin = driver.findElement(By.id("pin"));
  await pin.sendKeys("1245");
  const dobDay = driver.findElement(By.id("dob--day"));
  const dobMonth = driver.findElement(By.id("dob--month"));
  const dobYear = driver.findElement(By.id("dob--year"));
  await dobDay.sendKeys("01");
  await dobMonth.sendKeys("01");
  await dobYear.sendKeys("1989");
  const rememberMe = driver.findElement(By.className("test-remember-me"));
  await rememberMe.click();
  loginButton = driver.findElement(By.className("test-loginButton"));
  await loginButton.click();

  title = await driver.getTitle();
  console.log("Title was: " + title);

  // Check we are on the dashboard page
  const currentURL = await driver.getCurrentUrl();
  // console.log("currentURL:", currentURL);
  assert.match(currentURL, /dashboard$/, "should be on dashboard page");

  // await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);

  console.log("Deleting session...");
  await driver.quit();
};
