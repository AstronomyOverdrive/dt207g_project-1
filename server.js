// Import modules
const mongoose = require('mongoose');
const schemas = require('./schemas.mjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
require("dotenv").config();

// Start app
const app = express();
app.use(express.json());
app.use(cors());

// Connection uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_DATABASE}`;

// Database client options
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

// Connect to database
async function dbConnect() {
	try {
		await mongoose.connect(uri, clientOptions);
		console.log("Connected to DB")
	} catch (error) {
		console.log(error);
	}
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
	dbConnect();
});
