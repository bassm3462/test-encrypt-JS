const express = require('express');
const crypto = require('crypto');
const cors = require("cors")
const Encrypt = require("../model/encrypt")
const mongoose = require("mongoose");
const { error } = require('console');
const Decrypt = require('../model/Decrypt');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 4000;
console.log(process.env.HI)
console.log(port)

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors())
mongoose.connect('mongodb://root:example@mongo:27017')
  .then(() => console.log("MongoDB connected"))
  .catch(error => console.error("Error connecting to MongoDB:", error));
const salt = crypto.randomBytes(16); // Salt for PBKDF2
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

function encrypt(text, password) {
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText, password) {
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');  // Change 'hex' to 'utf8'
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption Error:', error.message);
    return null;
  }
}
app.post('/encrypt', async (req, res) => {
  const { plaintext, password } = req.body;
  console.log(plaintext)
  const encryptedText = encrypt(plaintext, password);
  if (!encryptedText) {
    res.status(400).json({ message: "error" })
  }
  await new Encrypt({
    encryptedText: encryptedText,
    password,
  })
    .save().then(response => {
      res.json({ response });
    })
});
app.get("/getEecrypt", async (req, res) => {
  try {
    const data = await Encrypt.find()
    if (!data) {
      return res.json({ message: "error in encrypt" })
    }
    res.status(200).json({ data })
  }

  catch (error) {
    console.log(error)
  }
})
// API endpoint for decryption
app.post('/decrypt', async (req, res) => {
  const { encryptedText, password } = req.body;
  const decryptedText = decrypt(encryptedText, password);
  await new Decrypt({
    decryptedText,
  }).save().then(response => {
    res.status(200).json({ response })
  }).catch(error => { res.status(400).json(error) })
});
app.get("/", (req, res) => {
  res.send("<h1>hello word i am bassim</h1>")
})
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
