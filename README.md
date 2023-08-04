# aws-device-farm-poc

This is a dummy Ember application to test out AWS Device Farm capabilities.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)
- [AWS Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html)

## Installation

- `git clone <repository-url>` this repository
- `cd aws-device-farm-poc`
- `yarn install`

## Running / Development

- `yarn start`
- Visit your app at [http://localhost:4200](http://localhost:4200).
- Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

- `ember test`
- `ember test --server`

### Linting

- `npm run lint`
- `npm run lint:fix`

### Building

- `ember build` (development)
- `yarn buid` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Running / Development

Firstly, to run AWS Device Farm Testing you need a publicly accessible URLs.

See [Limitations of Device Farm desktop browser testing](https://docs.aws.amazon.com/devicefarm/latest/testgrid/techref.html#techref-limitations) for more information.

So your application (in this case, this EmberJS appliction) needs to be deployed somewhere.

1. `yarn build`

This creates artifacts it the `dist/` directory. Since this is a static website the easiest thing is to deploy it to an AWS S3 Bucket as they can [host a static website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html).

Note: Amazon S3 website endpoints do not support HTTPS, but we do not require that for this POC.

2. Use the AWS Console to create an S3 Bucket:

Service > S3 > Create bucket
Bucket name: awsdevicefarmpoc
AWS Region: Asia Pacific (Sydney) ap-southeast2 (closest to NZ)
Create bucket

Select the newly created `awsdevicefarmpoc` bucket.

We need to [enable static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EnableWebsiteHosting.html):

Properties > Static website hosting > Edit
Static website hosting
[x] Enable
Hosting type
[x] Host a static website
Index document: dist/index.html
Save changes

The public bucket website endpoint should be displayed in the panel after updating e.g.

[http://awsdevicefarmpoc.s3-website-ap-southeast-2.amazonaws.com](http://awsdevicefarmpoc.s3-website-ap-southeast-2.amazonaws.com)

For users to access content at the website endpoint, we must make all the content publicly readable.
See [Setting permissions for website access
](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html) for detailed instructions.

Step1 : Edit S3 Block Public Access settings

Permissions
Block public access (bucket settings)
Edit
[] Block all public access (uncheck this)
Save changes
Confirm

Step 2: [Add a bucket policy](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteAccessPermissionsReqd.html#bucket-policy-static-site)

We now need to upload our local assets:

Objects > Upload

and click "Upload" to upload the contents of the `dist/` directory.

You can then open the above endpoint in the browser to check that it worked.
