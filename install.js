// Import modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schemas = require('./schemas.mjs');
require("dotenv").config();

// Connection uri
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/?retryWrites=true&w=majority&appName=${process.env.DB_DATABASE}`;

// Database client options
const clientOptions = {serverApi: {version: '1', strict: true, deprecationErrors: true}};

// Connect to database
async function dbConnect() {
	try {
		await mongoose.connect(uri, clientOptions);
		await mongoose.connection.db.admin().command({ping: 1});
		// Populate database
		console.log(await populateDb());
	} finally {
		await mongoose.disconnect();
	}
}

async function populateDb() {
	try {
		// Users
		// Select / create model
		const staffModel = await mongoose.model("staffacounts", schemas.staffSchema);
		// Remove all entries
		await staffModel.deleteMany({});
		// Create an admin user
		const adminPassword = await bcrypt.hash("asd", 10);
		await staffModel.create({
			username: "admin",
			password: adminPassword,
			admin: true
		});

		// About
		// Select / create model
		const aboutModel = await mongoose.model("about", schemas.aboutSchema);
		// Remove all entries
		await aboutModel.deleteMany({});
		// Create a description
		await aboutModel.create({
			description: "Hej och välkommna till India Express!\nVi erbjuder stans bästa indiska mat med rekordsnabb leverans."
		});

		// Menu
		// Select / create model
		const menuModel = await mongoose.model("menuitems", schemas.menuSchema);
		// Remove all entries
		await menuModel.deleteMany({});
		// Daedric princes to add
		const addEntries = [
			{
				name: "Rajma Masala",
				description: "Kidneybönsgryta med tomatpure, ingefära, spiskummin, gurkmeja och garam masala.\nServeras med ris.",
				price: 215
			},
			{
				name: "Chicken Tikka Sizlar",
				description: "Grillad kyckling marinerad med koriander, spiskumming och garam masala.\nServeras med ris och grönsaker.",
				price: 240
			},
			{
				name: "Curry Madras",
				description: "Gryta gjord på nötkött, curry, koriander, spiskummmin, tomatpure, ingefära och kardemumma.\nServeras med ris.",
				price: 225
			},
			{
				name: "Balti",
				description: "Curry gjord på lammkött, lök, vitlök, garam masala och gurkmeja.\nServeras med naan.",
				price: 230
			}
		]
		for (let i = 0; i < addEntries.length; i++) {
			await menuModel.create(addEntries[i]);
		}
	} catch (error) {
		return "An error occured" + error;
	}
}

dbConnect().catch(console.dir);
