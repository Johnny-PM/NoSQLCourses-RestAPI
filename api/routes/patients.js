const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients');


// Route to Post/Insert a Patient
router.post('/', patientsController.patients_post);

// Route to Get all Patients
router.get('/', patientsController.patients_get_all);

// Route to Get a Specific Patient
router.get('/:snsNumber', patientsController.patients_get_by_snsNumber);

// Route to Update a Given Patient
router.patch('/:patientId', patientsController.patients_patch_by_id);

// Route to Delete a Given Patient
router.delete('/:patientId', patientsController.patients_delete_by_id);


module.exports = router;