import {User} from '../models/user.model.js'
import { doctorModel } from '../models/doctor.model.js'
import { appointmentModel } from '../models/appointment.model.js'

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });

        if (!doctor) { // Check if doctor is not found
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Doctor data fetched successfully',
            data: doctor,
        });
    } catch (error) {
        console.error('Error in fetching doctor details:', error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching doctor details',
            error: error.message, // Sending only the error message for better clarity
        });
    }
};


const updateProfileController = async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate(
            { userId: req.body.userId },
            req.body,
            { new: true } // Ensure the updated document is returned
        );
        
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Doctor profile updated',
            data: doctor,
        });
    } catch (error) {
        console.error('Error updating doctor profile:', error);
        res.status(500).send({
            success: false,
            message: 'Error updating doctor profile',
            error: error.message,
        });
    }
};

// get single doctor----------->
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await doctorModel.findById(req.body.doctorId);

        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Single doctor info fetched',
            data: doctor,
        });
    } catch (error) {
        console.error('Error in getting single doctor info:', error);
        res.status(500).send({
            success: false,
            message: 'Error in getting single doctor info',
            error: error.message,
        });
    }
};


const doctorAppointmentController = async (req, res) => {
    try {
        // Find the doctor using their user ID
        const doctor = await doctorModel.findOne({ userId: req.body.userId });

        // Check if the doctor exists
        if (!doctor) {
            return res.status(404).send({
                success: false,
                message: 'Doctor not found',
            });
        }

        // Find all appointments associated with the doctor
        const appointments = await appointmentModel.find({
            doctorId: doctor._id, // Use the doctor's _id as the query parameter
        });

        // Send successful response with appointments data
        res.status(200).send({
            success: true,
            message: 'Doctor appointments fetched successfully',
            data: appointments,
        });
    } catch (error) {
        // Handle errors
        console.error('Error in doctor appointment:', error);
        res.status(500).send({
            success: false,
            message: 'Error in fetching doctor appointments',
            error: error.message,
        });
    }
};


const updateStatusController = async (req, res) => {
    try {
        const { appointmentsId, status } = req.body;

        // Update the status of the appointment
        const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentsId,
            { status },
            { new: true } // Ensure the updated document is returned
        );

        // Find the user associated with the appointment
        const user = await User.findOne({ _id: appointment.userId });

        // Create a notification message
        const notificationMessage = `Your appointment status has been updated to ${status}`;

        // Add the notification to the user's notifications array
        let notifications = user.notification || [];
        notifications.push({
            type: 'status-updated',
            message: notificationMessage,
            onClickPath: '/doctor-appointments',
        });

        // Update the user's notifications
        await User.updateOne(
            { _id: user._id },
            { $set: { notification: notifications } }
        );

        // Send a success response
        res.status(200).send({
            success: true,
            message: 'Appointment status updated',
        });
    } catch (error) {
        // Handle errors
        console.error('Error in updating status:', error);
        res.status(500).send({
            success: false,
            error: error.message,
            message: 'Error in updating appointment status',
        });
    }
};

export {getDoctorByIdController,getDoctorInfoController,updateProfileController,doctorAppointmentController,updateStatusController}