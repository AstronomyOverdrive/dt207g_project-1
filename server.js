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

// Staff routing
// Login user
app.post("/staff/user/login", async (req, res) => {
	try {
		const dbModel = await mongoose.model("staffacounts", schemas.staffSchema);
		const user = await dbModel.find({username: req.body.username});
		if (user.length !== 0) { // Check if user is found
			const passwordsMatch = await bcrypt.compare(req.body.password, user[0].password);
			if (passwordsMatch) {
				// Sign JWT token
				const payload = {username: user[0].username, admin: user[0].admin}
				const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {expiresIn: "8h"});
				res.status(200).json({message: "Login successful", token});
			} else {
				res.status(401).json({message: "Invalid password"});
			}
		} else {
			res.status(404).json({message: "User "+req.body.username+" not found"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Register user
app.post("/staff/user/register", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const dbModel = await mongoose.model("staffacounts", schemas.staffSchema);
			const user = await dbModel.find({username: req.body.username});
			if (user.length === 0) { // Username is free
				const hashedPassword = await bcrypt.hash(req.body.password, 10);
				const result = await dbModel.create({
					username: req.body.username,
					password: hashedPassword,
					admin: req.body.admin
				});
				res.status(201).json({message: "User "+req.body.username+" created"});
			} else {
				res.status(409).json({message: "Username "+req.body.username+" already taken"});
			}
		} else {
			res.status(401).json({message: "Only admins can register new users"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Delete user
app.delete("/staff/user/delete", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const dbModel = await mongoose.model("staffacounts", schemas.staffSchema);
			const result = await dbModel.deleteOne({username: req.body.username});
			res.status(200).json(result);
		} else {
			res.status(401).json({message: "Only admins can remove users"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Get orders
app.get("/staff/orders/get", authenticateToken, async (req, res) => {
	try {
		const dbModel = await mongoose.model("orders", schemas.orderSchema);
		const orders = await dbModel.find({});
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Delete order
app.delete("/staff/orders/delete", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const dbModel = await mongoose.model("orders", schemas.orderSchema);
			const result = await dbModel.deleteOne({_id: req.body.id});
			res.status(200).json(result);
		} else {
			res.status(401).json({message: "Only admins can remove orders"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Mark order as complete
app.put("/staff/orders/done", authenticateToken, async (req, res) => {
	try {
		const dbModel = await mongoose.model("orders", schemas.orderSchema);
		const result = await dbModel.updateOne({_id: req.body.id}, {$set: {completed: true}});
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Add to menu
app.post("/staff/menu/add", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const newItem = {
				name: req.body.name,
				description: req.body.description,
				price: req.body.price
			}
			// Validate types
			if (typeof newItem.name === "string" && typeof newItem.description === "string" && typeof newItem.price === "number") {
				const dbModel = await mongoose.model("menuitems", schemas.menuSchema);
				const result = await dbModel.create(newItem);
				res.status(201).json({message: "Menu items "+req.body.name+" created"});
			} else {
				res.status(400).json({message: "Incorrect data type"});
			}
		} else {
			res.status(401).json({message: "Only admins can add new menu items"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Delete menu item
app.delete("/staff/menu/delete", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const dbModel = await mongoose.model("menuitems", schemas.menuSchema);
			const result = await dbModel.deleteOne({_id: req.body.id});
			res.status(200).json(result);
		} else {
			res.status(401).json({message: "Only admins can remove menu items"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Update menu item
app.put("/staff/menu/edit", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const updatedItem = {
				name: req.body.name,
				description: req.body.description,
				price: req.body.price
			}
			// Validate types
			if (typeof updatedItem.name === "string" && typeof updatedItem.description === "string" && typeof updatedItem.price === "number") {
				const dbModel = await mongoose.model("menuitems", schemas.menuSchema);
				const result = await dbModel.updateOne({_id: req.body.id}, updatedItem);
				res.status(200).json(result);
			} else {
				res.status(400).json({message: "Incorrect data type"});
			}
		} else {
			res.status(401).json({message: "Only admins can edit menu items"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Update about description
app.put("/staff/about/edit", authenticateToken, async (req, res) => {
	try {
		if (req.user.admin) { // Request done by an admin
			const dbModel = await mongoose.model("about", schemas.aboutSchema);
			const result = await dbModel.findAndUpdateOne({}, {description: req.body.about});
			res.status(200).json(result);
		} else {
			res.status(401).json({message: "Only admins can edit description"});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});

// Middleware authentication
async function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) { // Check if user has a token
		return res.status(401).json({message: "Missing token"});
	}
	// Check if token is valid
	jwt.verify(token, process.env.ACCESS_TOKEN, (error, user) => {
		if (error) {
			return res.status(403).json({message: "Invalid token"});
		}
		req.user = user;
		next();
	});
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
// Find order
app.post("/public/order/find", async (req, res) => {
	try {
		const dbModel = await mongoose.model("orders", schemas.orderSchema);
		const order = await dbModel.find({_id: req.body.id});
		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});
// Post order
app.post("/public/order/place", async (req, res) => {
	try {
		const newOrder = {
			items: req.body.items,
			customerName: req.body.name,
			customerPhone: req.body.phone,
			completed: false
		}
		const errorMsg = await verifyOrder(newOrder);
		if (errorMsg === "") {
			const dbModel = await mongoose.model("orders", schemas.orderSchema);
			const result = await dbModel.create(newOrder);
			res.status(201).json(result);
		} else {
			res.status(400).json({message: errorMsg});
		}
	} catch (error) {
		res.status(500).json({error: "Internal error: " + error});
	}
});

// Verify order items
async function verifyOrder(order) {
	let problems = "";
	// Check if order.items is an array
	if (order.items instanceof Array) {
		// Check if array has items
		if (order.items.length === 0) {
			problems += "\nOrder can't be empty";
		} else {
			// Check if order is of valid menu items
			const dbModel = await mongoose.model("menuitems", schemas.menuSchema);
			const menuItems = await dbModel.find({});
			order.items.forEach(item => {
				const findItem = menuItems.find(menuItem => String(menuItem._id).includes(item));
				if (findItem === undefined) {
					problems += "\nInvalid product";
				}
			});
		}
	} else {
		problems += "\nWrongly formatted order";
	}
	return problems;
}

// Start server
app.listen(process.env.PORT, () => {
	console.log("Server live on port", process.env.PORT);
	dbConnect();
});
