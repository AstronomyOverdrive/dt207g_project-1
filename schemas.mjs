// Import modules
import mongoose from 'mongoose';

// Create database schemas
// Staff schema
const staffSchema = mongoose.Schema({
	username: {
		type: String,
		required: [true, "Användarnamn är obligatoriskt"],
		trim: true,
		minlength: [5, "Användarnamn kan minst vara 5 tecken"],
		maxlength: [25, "Användarnamn kan max vara 25 tecken"]
	},
	password: {
		type: String,
		required: [true, "Lösenord är obligatoriskt"]
	},
	admin: {
		type: Boolean,
		required: [true, "Kontotyp är obligatoriskt"]
	}
});

// About schema
const aboutSchema = mongoose.Schema({
	description: {
		type: String,
		required: [true, "Beskrivning är obligatoriskt"],
		trim: true
	}
});

// Menu schema
const menuSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Namn är obligatoriskt"],
		trim: true,
		maxlength: [25, "Namn kan max vara 25 tecken"]
	},
	description: {
		type: String,
		required: [true, "Beskrivning är obligatoriskt"],
		trim: true,
		maxlength: [120, "Beskrivning kan max vara 120 tecken"]
	},
	price: {
		type: Number,
		required: [true, "Pris är obligatoriskt"]
	}
});

// Order schema
const orderSchema = mongoose.Schema({
	items: {
		type: Array,
		required: [true, "Beställning kan inte vara tom"]
	},
	customerName: {
		type: String,
		required: [true, "Namn är obligatoriskt"],
		trim: true
	},
	customerPhone: {
		type: String,
		required: [true, "Telefonnummer är obligatoriskt"],
		trim: true
	},
	completed: {
		type: Boolean,
		required: [true, "Orderstatus är obligatoriskt"]
	}
}, {
	timestamps: true
});

// Export schemas
export {staffSchema, aboutSchema, menuSchema, orderSchema}
