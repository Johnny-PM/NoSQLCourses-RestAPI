const mongodb = require('mongodb');
const db = require('../../db');
const Int32 = mongodb.Int32;
const ObjectId = mongodb.ObjectId;

// GET ALL PATIENTS
exports.patients_get_all = (req, res, next) => {
    const patients = [];
    db.getDb()
        .collection('patients')
        .find()
        .forEach(patient => {
            patients.push(patient);
        })
        .then(result => {
            console.log(patients);
            res.status(200).json({
                message: "List of patients",
                patients: patients
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// POST A PATIENT
exports.patients_post = (req, res, next) => {
    const newPatient = {
        name: req.body.name,
        snsNumber: Int32(req.body.snsNumber),
        gender: req.body.gender,
        age: Int32(req.body.age)
    };
    db.getDb()
        .collection('patients')
        .insertOne(newPatient)
        .then(result => {
            console.log(newPatient);
            res.status(201).json({
                message: "New Patient Inserted",
                patient: newPatient
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

// GET BY SNS NUMBER
exports.patients_get_by_snsNumber = (req, res, next) => {
    const snsNumber = Int32(req.params.snsNumber);
    db.getDb()
        .collection('patients')
        .findOne({
            snsNumber: snsNumber
        })
        .then(patient => {
            if(!patient) {
                res.status(404).json({
                    message: "Patient not found"
                });
            } else {
                console.log(patient);
                res.status(200).json({
                    message: "Patient Found",
                    patient: patient
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

// UPDATE BY PATIENT ID
exports.patients_patch_by_id = (req, res, next) => {
    const updateOptions = {};
    const updateFilter = {
        _id: new ObjectId(req.params.patientId)
    };
    req.body.forEach( prop => {
        updateOptions[prop.propName] = prop.value,
        updateFilter[prop.propName] = {$exists: true}
    });
    
    db.getDb()
        .collection('patients')
        .updateOne(
            updateFilter,
            {$set: updateOptions}
        )
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Patient info updated sucessfully",
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

// DELETE BY PATIENT ID
exports.patients_delete_by_id = (req, res, next) => {
    const patientIdToDelete = new ObjectId(req.params.patientId);
    db.getDb()
        .collection('patients')
        .deleteOne({
            _id: patientIdToDelete
        })
        .then(result => {
            res.status(200).json({
                message: "Patient Deleted",
                result: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
}