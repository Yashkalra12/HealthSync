// Importing required modules
const express = require("express"); // Express framework
const doctorController = require("../controllers/doctorController"); // Doctor-related controller functions
const auth = require("../middleware/auth"); // Middleware for authentication

// Creating a router for doctor-related routes
const doctorRouter = express.Router();

// Route to get all approved doctors (No authentication required)
doctorRouter.get("/getalldoctors", doctorController.getalldoctors);

// Route to get users who are not approved as doctors (Requires authentication)
doctorRouter.get("/getnotdoctors", auth, doctorController.getnotdoctors);

// Route to apply as a doctor (Requires authentication)
doctorRouter.post("/applyfordoctor", auth, doctorController.applyfordoctor);

// Route to delete a doctor from the system (Requires authentication)
doctorRouter.put("/deletedoctor", auth, doctorController.deletedoctor);

// Route to approve a doctor's application (Requires authentication)
doctorRouter.put("/acceptdoctor", auth, doctorController.acceptdoctor);

// Route to reject a doctor's application (Requires authentication)
doctorRouter.put("/rejectdoctor", auth, doctorController.rejectdoctor);

// Exporting the router to use in other parts of the app
module.exports = doctorRouter;
