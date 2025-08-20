// Import modules
const mongoose = require("mongoose");
const schemas = require("./schemas.mjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();

// Start app
const app = express();
app.use(express.json());
app.use(cors());

// Connection uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_DATABASE}`;

// Database client options
const clientOptions = {serverApi: {version: "1", strict: true, deprecationErrors: true}};

// Connect to database
async function dbConnect() {
	try {
		await mongoose.connect(uri, clientOptions);
		console.log("Connected to DB")
	} catch (error) {
		console.log(error);
	}
}

// Public routing
// Get menu
app.get("/public/menu", async (req, res) => {
	try {
		const dbModel = await mongoose.model("menuitems", schemas.menuSchema);
		const menu = await dbModel.find({});
		res.status(200).json(menu);
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Get about
app.get("/public/about", async (req, res) => {
	try {
		const dbModel = await mongoose.model("about", schemas.aboutSchema);
		const about = await dbModel.find({});
		res.status(200).json(about);
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
	dbConnect();
});
