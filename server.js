
// server.js

const express = require('express');
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

/**
 * Creates a user object with the specified structure.
 * @param {number} id - The user ID.
 * @param {string} summaryText - The text for the Summary field.
 * @param {string} detailText - The text for the Detail field.
 * @returns {object} A user object.
 */
const createMockUser = (id, summaryText, detailText) => ({
  id: id,
  name: `User ${id}`,
  company: `Company ${id}`,
  username: `user_${id}`,
  email: `user${id}@company${id}.com`,
  address: `${id}00 Main Street`,
  zip: `${id}0000`,
  state: 'SomeState',
  country: 'SomeCountry',
  phone: `+1-555-1000-${String(id).padStart(4, '0')}`,
  Summary: summaryText,
  Detail: detailText,
});

// GET endpoint to generate a large list of data (~10MB)
app.get('/', (req, res) => {
  console.log('Received request to generate 10MB of data...');

  const TARGET_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. ';
  const lumpsumText = lorem.repeat(Math.ceil(9000 / lorem.length)); // ~9KB

  const summary = lumpsumText.substring(0, lumpsumText.length / 2);
  const detail = lumpsumText.substring(lumpsumText.length / 2);

  const singleUser = createMockUser(1, summary, detail);
  const singleUserByteSize = Buffer.byteLength(JSON.stringify(singleUser), 'utf8');

  const numberOfUsers = Math.floor(TARGET_SIZE_BYTES / (singleUserByteSize + 1));

  const users = [];
  for (let i = 1; i <= numberOfUsers; i++) {
    users.push(createMockUser(i, summary, detail));
  }

  const finalPayloadSizeBytes = Buffer.byteLength(JSON.stringify(users), 'utf8');
  console.log(`Generated ${numberOfUsers} records.`);
  console.log(`Final payload size: ${(finalPayloadSizeBytes / (1024 * 1024)).toFixed(2)} MB`);

  res.json(users);
    //  res.status(200).json('Welcome, your app is working well');
});


// Define a global variable
global.counter = 1;

// Function to increment the global variable
function incrementCounter() {
  global.counter += 1;
  console.log("Counter:", global.counter);
}


// GET endpoint to generate a large list of data (~10MB)
app.get('/get2mbUser', (req, res) => {
  console.log('Received request to generate 10MB of data...');

  const TARGET_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. ';

  // const summary = lumpsumText.substring(0, lumpsumText.length / 2);
  // const detail = lumpsumText.substring(lumpsumText.length / 2);

  const singleUser = createMockUser(1, lorem, lorem);
  const singleUserByteSize = Buffer.byteLength(JSON.stringify(singleUser), 'utf8');

  const numberOfUsers = 30;

  const users = [];
  for (let i = 1; i <= numberOfUsers; i++) {
    users.push(createMockUser(i, lorem, lorem));
  }

  const finalPayloadSizeBytes = Buffer.byteLength(JSON.stringify(users), 'utf8');
  console.log(`Generated ${numberOfUsers} records.`);
  console.log(`Final payload size: ${(finalPayloadSizeBytes / (1024 * 1024)).toFixed(2)} MB`);

  // 5. Send the generated data as a JSON response.
  res.json(users);
    //  res.status(200).json('Welcome, your app is working well');
});

// Generate random product values
function generateProduct() {
  return {
    productId: uuidv4(),
    name: faker.commerce.productName(),
    description: Math.random() > 0.2 ? getLorem(5) : null, // sometimes null
    category: faker.commerce.department(),
    brand: faker.company.name(),
    price: {
      currency: "USD",
      amount: parseFloat(faker.commerce.price()),
      discount: Math.random() > 0.5 ? {
        percentage: faker.number.int({ min: 5, max: 50 }),
        finalPrice: parseFloat(faker.commerce.price())
      } : null
    },
    availability: {
      inStock: faker.datatype.boolean(),
      quantity: faker.number.int({ min: 0, max: 500 }),
      estimatedDelivery: Math.random() > 0.3 ? faker.date.soon().toISOString().split("T")[0] : null
    },
    images: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      url: faker.image.url(),
      alt: faker.commerce.productAdjective()
    })),
    specifications: Math.random() > 0.3 ? {
      color: faker.color.human(),
      weight: faker.number.int({ min: 100, max: 2000 }) + "g",
      details: getLorem(5)
    } : null,
    ratings: {
      average: Math.random() > 0.5 ? faker.number.float({ min: 1, max: 5, precision: 0.1 }) : null,
      totalReviews: faker.number.int({ min: 0, max: 5000 })
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString()
  };
}

app.get("/getProductList", (req, res) => {
  try {
      console.log(`Called getProductList`);
      const targetSizeMB = parseInt(req.query.size) || 5; // default 5 MB
      const targetSizeBytes = targetSizeMB * 1024 * 1024;

      let products = [];
      let currentSize = 0;

      while (currentSize < targetSizeBytes) {
        const product = generateProduct();
        products.push(product);

        // Calculate current payload size
        currentSize = Buffer.byteLength(JSON.stringify(products));
      }

      res.json({
        status: "success",
        approxPayloadSizeMB: (currentSize / (1024 * 1024)).toFixed(2),
        count: products.length,
        products
      });
  } catch (error) {
    res.json({error: "internal error"})
  }
});

function getLorem(sizeInKb = 3) {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. ';
  const lumpsumText = lorem.repeat(Math.ceil(sizeInKb * 1024 / lorem.length))
  return lumpsumText.substring(0, sizeInKb * 1024);
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`Use this URL for your mock API: http://localhost:${PORT}`);
});

module.exports = app;
