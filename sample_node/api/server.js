
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
app.get('/api/data', (req, res) => {
  console.log('Received request to generate 10MB of data...');

  const TARGET_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  // 1. Create a large block of "lumpsum text" to fill the data fields.
  // A single character is roughly 1 byte, so we create a ~9KB text block.
  const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. ';
  const lumpsumText = lorem.repeat(Math.ceil(9000 / lorem.length)); // ~9KB

  // We can split the large text between the two fields.
  const summary = lumpsumText.substring(0, lumpsumText.length / 2);
  const detail = lumpsumText.substring(lumpsumText.length / 2);

  // 2. Estimate the byte size of a single JSON object to calculate how many are needed.
  const singleUser = createMockUser(1, summary, detail);
  // Using Buffer.byteLength is more accurate for size calculation than string.length.
  const singleUserByteSize = Buffer.byteLength(JSON.stringify(singleUser), 'utf8');

  // 3. Calculate how many objects are required to reach the target size.
  // We add 1 byte to the size to account for the comma separating objects in a JSON array.
  const numberOfUsers = Math.floor(TARGET_SIZE_BYTES / (singleUserByteSize + 1));

  // 4. Generate the final array of user data.
  const users = [];
  for (let i = 1; i <= numberOfUsers; i++) {
    users.push(createMockUser(i, summary, detail));
  }

  const finalPayloadSizeBytes = Buffer.byteLength(JSON.stringify(users), 'utf8');
  console.log(`Generated ${numberOfUsers} records.`);
  console.log(`Final payload size: ${(finalPayloadSizeBytes / (1024 * 1024)).toFixed(2)} MB`);

  // 5. Send the generated data as a JSON response.
  res.json(users);
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`Use this URL for your mock API: http://localhost:${PORT}/api/data`);
});
