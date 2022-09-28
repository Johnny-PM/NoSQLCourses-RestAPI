const mongodb = require('mongodb');
const db = require('../../db');
const Int32 = mongodb.Int32;
const ObjectId = mongodb.ObjectId;

// CREATE A NEW APPOINTMENT
exports.appointments_post = (req, res, next) => {
    let appointment = {
        patientId: new ObjectId(req.body.patientId),
        professionalId: Int32(req.body.professionalId),
        timestamp: new Date()
    };
    db.getDb()
        .collection('patients')
        .findOne({
            _id: appointment.patientId
        })
        .then(patient => {
            if(!patient){
                res.status(404).json({
                    message: "Patient not Found."
                });
            } else {
                db.getDb()
                    .collection('healthProfessionals')
                    .findOne({
                        _id: appointment.professionalId
                    })
                    .then(professional => {
                        if (!professional) {
                            res.status(404).json({
                                message: "Professional not Found."
                            });
                        } else {
                            appointment.specialty = professional.specialty;
                            db.getDb()
                                .collection('appointments')
                                .insertOne(appointment)
                                .then(result => {
                                    res.status(201).json({
                                        message: "New Appointment Created",
                                        appointment
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

// GET ALL APPOINTMENTS
exports.appointments_get_all = (req, res, next) => {
    const appointments = [];
    db.getDb()
        .collection('appointments')
        .aggregate([
            {
                $lookup: {
                    from: "patients",
                    localField: "patientId",
                    foreignField: "_id",
                    as: "patientInfo"
                }
            },
            {$unwind: "$patientInfo"},
            {
                $lookup: {
                    from: "healthProfessionals",
                    localField: "professionalId",
                    foreignField: "_id",
                    as: "professionalInfo"
                }
            },
            {$unwind: "$professionalInfo"},
            {
                $project: {
                    _id: 1,
                    timestamp: 1,
                    specialty: 1,
                    patientInfo: {
                        patientId: "$patientInfo._id",
                        snsNumber: "$patientInfo.snsNumber",
                        name: "$patientInfo.name",
                        age: "$patientInfo.age"
                    },
                    professionalInfo: {
                        professionalId: "$professionalInfo._id",
                        medicalCertificate: "$patientInfo.medicalCertificate",
                        name: "$professionalInfo.name",
                        age: "$patientInfo.age"
                    }
                }
            }
        ])
        .forEach(appoint => {
            appoint.patientInfo.request = {
                type: "GET",
                url: "http://localhost:3000/patients/" + appoint.patientInfo.patientId.toString()
            };
            appointments.push(appoint);
        })
        .then(result => {
            console.log(appointments);
            res.status(200).json({
                message: "List all the Appointments",
                appointments: appointments
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.appointments_get_by_patientId = (req, res, next) => {
    const newPatientId = new ObjectId(req.params.patientId);

    db.getDb()
        .collection('patients')
        .findOne({
            _id: newPatientId
        })
        .then(patient => {
            if(!patient) {
                res.status(404).json({
                    message: "Patient not Found."
                });
            } else {
                const appointments = [];
                db.getDb()
                    .collection('appointments')
                    .aggregate([
                        {$match: {patientId: newPatientId}},
                        {
                            $lookup: {
                                from: "healthProfessionals",
                                localField: "professionalId",
                                foreignField: "_id",
                                as: "professionalInfo"
                            }
                        },
                        {$unwind: "$professionalInfo"},
                        {
                            $project: {
                                _id: 1,
                                timestamp: 1,
                                specialty: 1,
                                patientId: 1,
                                professionalInfo: {
                                    professionalId: "$professionalInfo._id",
                                    medicalCertificate: "$patientInfo.medicalCertificate",
                                    name: "$professionalInfo.name",
                                    age: "$patientInfo.age"
                                }
                            }
                        }
                    ])
                    .forEach(appoint => {
                        appointments.push(appoint);
                    })
                    .then(result => {
                        console.log(appointments);
                        res.status(200).json({
                            message: "List all the Appointments associated to the Patient",
                            appointments: appointments
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

// UPDATE AN APPOINTMENT BY ID
exports.appointments_patch_by_id = (req, res, next) => { 
    const updateOptions = {};
    const updateFilter = {
        _id: new ObjectId(req.params.appointmentId)
    };
    req.body.forEach( prop => {
        updateOptions[prop.propName] = prop.value,
        updateFilter[prop.propName] = {$exists: true}
    });
    
    db.getDb()
        .collection('appointments')
        .updateOne(
            updateFilter,
            {$set: updateOptions}
        )
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Appointment info updated sucessfully",
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });  
};


// DELETE AN APPOINTMENT BY ID
exports.appointments_delete_by_id = (req, res, next) => {  
    const appointmentIdToDelete = new ObjectId(req.params.appointmentId);
    db.getDb()
        .collection('appointments')
        .deleteOne({
            _id: appointmentIdToDelete
        })
        .then(result => {
            res.status(200).json({
                message: "Appointment Deleted",
                result: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};