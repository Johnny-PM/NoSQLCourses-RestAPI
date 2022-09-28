const express = require('express');
const router = express.Router();
const appointmentsController = require('../controllers/appointments');


// Route to Create an Appointment
router.post('/', appointmentsController.appointments_post);

// Route to Get all Appointments
router.get('/', appointmentsController.appointments_get_all);

// Route to Get all Appointments for a Patient
router.get('/:patientId', appointmentsController.appointments_get_by_patientId);

// Route to Update an Appointment
router.patch('/:appointmentId', appointmentsController.appointments_patch_by_id);

// Route to Delete an Appointment
router.delete('/:appointmentId', appointmentsController.appointments_delete_by_id);


module.exports = router;