const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (for demonstration purposes, use a database in production)
const storageFile = path.join(__dirname, 'submissions.json');

// Load existing data or initialize empty array
let submissions = [];
if (fs.existsSync(storageFile)) {
  submissions = JSON.parse(fs.readFileSync(storageFile, 'utf-8'));
}

// Route to handle form submission
app.post('/api/save', (req, res) => {
  const { name, dob, address, phone, email } = req.body;

  if (!name || !dob || !address || !phone || !email) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const newSubmission = { id: Date.now(), name, dob, address, phone, email };
  submissions.push(newSubmission);

  // Save to file
  fs.writeFileSync(storageFile, JSON.stringify(submissions, null, 2));

  res.status(200).json({ message: 'Submission saved successfully.' });
});

// Route to get all submissions (no authentication required now)
app.get('/api/submissions', (req, res) => {
  res.status(200).json(submissions);
});

// Serve the app
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
