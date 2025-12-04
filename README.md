**Deployment Setup Instructions**
1. Create a Vercel Account

Sign up for an account on Vercel: https://vercel.com

2. Provide GitHub Access

Grant Vercel access to your GitHub repository to enable automatic deployments.

3. Project Integration

Add a vercel.json file to your project with the following configuration:

`{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}`

4. Push Code From Your IDE

Push your changes to GitHub. Once pushed, the project will appear in your Vercel dashboard:
`https://vercel.com/nandhakumarannadurai9s-projects/sampleapiproject`

**Project Overview**

This project contains sample API endpoints that support JSON payloads of various sizes.
You can customize the response size based on your requirements.

**API Endpoints**

User List
URL: `https://sampleapiproject.vercel.app/userlist`
Default Payload Size: 10 MB

2 MB User Data
URL: `https://sampleapiproject.vercel.app/get2mbUser`
Default Payload Size: 2 MB

Product List
URL: `https://sampleapiproject.vercel.app/getProductList`
Default Payload Size: 0.32 MB

**Payload Size Customization (Only for getProductList API)**

Payload customization is supported only for the getProductList endpoint.

The maximum supported payload size is 30 MB.
If a value above 30 MB is provided, the system will automatically cap it at 30 MB.

You can control the payload size using two parameters:

1. limit Parameter

Use `?limit=<value>` to specify the number of records to fetch.

Maximum limit: 10,000

If a value greater than 10,000 is provided, it will default to 10,000.

2. size Parameter

Use `?size=<value>` to specify the payload size in MB.

Maximum size: 30 MB

Any value above 30 will be restricted to 30 MB.
