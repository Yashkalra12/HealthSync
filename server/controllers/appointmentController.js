const Appointment = require("../models/appointmentModel");
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// GET all appointments with optional filtering
const getAllAppointments = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { userId: req.query.search },
            { doctorId: req.query.search },
          ],
        }
      : {};

    const appointments = await Appointment.find(keyword)
      .populate("doctorId")
      .populate("userId");

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ message: "Unable to get appointments", error: error.message });
  }
};

// POST book an appointment
const bookAppointment = async (req, res) => {
  try {
    const { date, time, doctorId, doctorname } = req.body;
    const userId = req.locals; // Assuming middleware sets this

    if (!date || !time || !doctorId || !doctorname) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = new Appointment({
      date,
      time,
      doctorId,
      userId,
    });

    // Create user notification
    const userNotification = new Notification({
      userId,
      content: `You booked an appointment with Dr. ${doctorname} for ${date} at ${time}`,
    });

    // Get user data to notify doctor
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create doctor notification
    const doctorNotification = new Notification({
      userId: doctorId,
      content: `You have an appointment with ${user.firstname} ${user.lastname} on ${date} at ${time}`,
    });

    await appointment.save();
    await userNotification.save();
    await doctorNotification.save();

    return res.status(201).json(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Unable to book appointment", error: error.message });
  }
};

// PATCH mark appointment as completed
const completeAppointment = async (req, res) => {
  try {
    const { appointid, doctorId, doctorname } = req.body;
    const userId = req.locals;

    if (!appointid || !doctorId || !doctorname) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointid,
      { status: "Completed" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Notify user
    const userNotification = new Notification({
      userId,
      content: `Your appointment with Dr. ${doctorname} has been marked as completed.`,
    });

    // Get user info for doctor's notification
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doctorNotification = new Notification({
      userId: doctorId,
      content: `Your appointment with ${user.firstname} ${user.lastname} has been marked as completed.`,
    });

    await userNotification.save();
    await doctorNotification.save();

    return res.status(200).json({ message: "Appointment marked as completed" });
  } catch (error) {
    console.error("Error completing appointment:", error);
    return res.status(500).json({ message: "Unable to complete appointment", error: error.message });
  }
};

module.exports = {
  getAllAppointments,
  bookAppointment,
  completeAppointment,
};
