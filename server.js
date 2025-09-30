
// server.js
const express = require('express');

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
  company: randomBool(0.8) ? `Company ${id}` : null,
  username: `user_${id}`,
  email: randomBool(0.5) ? `user${id}@company${id}.com` : null,
  address: randomBool(0.5) ? `${id}00 Main Street` : null,
  zip: randomBool(0.5) ? `${id}0000` : null,
  state: randomBool(0.2) ? 'SomeState' : null,
  country: randomBool(0.2) ? 'SomeCountry' : null,
  phone: randomBool(0.2) ? `+1-555-1000-${String(id).padStart(4, '0')}` : null,
  Summary: summaryText,
  Detail: detailText,
});

app.get('/', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

// GET endpoint to generate a large list of data (~10MB)
app.get('/userlist', (req, res) => {
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

function getLorem(sizeInKb = 1) {
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. ';
  const lumpsumText = lorem.repeat(Math.ceil(sizeInKb * 1024 / lorem.length))
  return lumpsumText.substring(0, sizeInKb * 1024);
}

// helper: random boolean with probability
function randomBool(probability = 0.5) {
  return Math.random() < probability;
}

// helper: random date (past year)
function randomDatePast(years = 1) {
  const now = new Date();
  const past = new Date();
  past.setFullYear(now.getFullYear() - years);
  const timestamp = Math.floor(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
  return new Date(timestamp).toISOString();
}

// helper: random integer in range
function randomInt(min = 1, max = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProduct() {
  return {
    productId: crypto.randomUUID(),
    name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    description: randomBool(0.8) ? getLorem(5) : null, // 80% chance
    category: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    brand: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: {
      currency: "USD",
      amount: 50,
      discount: randomBool(0.5)
        ? {
            percentage: Math.random(),
            finalPrice: 50, // adjust with percentage if you want
          }
        : null,
    },
    availability: {
      inStock: randomBool(0.8),
      quantity: randomInt(0, 100),
      estimatedDelivery: randomBool(0.7) ? randomDatePast(1) : null,
    },
    images: Array.from({ length: randomInt(1, 3) }, () => ({
      url: randomBool(0.8) ? "https://dummy.com" : null,
      alt: getLorem(1),
    })),
    specifications: randomBool(0.7)
      ? {
          color: "black",
          weight: "100g",
          details: getLorem(5),
        }
      : null,
    ratings: {
      average: randomBool(0.5) ? 4.3 : null,
      totalReviews: randomInt(0, 500),
    },
    createdAt: randomDatePast(2),
    updatedAt: randomDatePast(1),
  };
}

app.get("/getProductList", (req, res) => {
  try {
      console.log(`Called getProductList`);
      const targetSizeMB = parseInt(req.query.size) || 5; // default 5 MB
      console.log("targetSizeMB", targetSizeMB);
      const targetSizeBytes = targetSizeMB * 1024 * 1024;
      console.log("targetSizeBytes", targetSizeBytes)

      let products = [];
      let currentSize = 0;
      while (currentSize < targetSizeBytes) {
        const product = generateProduct();
        products.push(product);

        // Calculate current payload size
        currentSize = Buffer.byteLength(JSON.stringify(products));
      }

      console.log(`Completed`);
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

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`Use this URL for your mock API: http://localhost:${PORT}`);
});

module.exports = app;
