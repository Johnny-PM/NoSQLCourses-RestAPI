db = connect("localhost:27017/healthcareSystem");

// Clear Collections if exist
db.patients.drop();
db.healthProfessionals.drop();
db.appointments.drop();
db.institutions.drop();
db.biometricalReadings.drop();

// Collection with the HealthProfessionals
db.healthProfessionals.insertMany([
    {
        _id: 76543,
        name: "Dr. Hélder Carvalho",
        age: 54,
        medicalCertificate: 76543,
        specialty: "Medicina Geral e Familiar",
    },
    {
        _id: 78612,
        name: "Dr. Cassiano Martins",
        age: 35,
        medicalCertificate: 78612,
        specialty: "Cardiologia",
    },
    {
        _id: 98762,
        name: "Dra. Arminda Magalhães",
        age: 41,
        medicalCertificate: 98762,
        specialty: "Pneumologia",
    },
    {
        _id: 18721,
        name: "Dra. Juliana dos Santos",
        age: 29,
        medicalCertificate: 18721,
        specialty: "Medicina Geral e Familiar",
    },
    {
        _id: 78712,
        name: "Dr. Hugo Baltazar",
        age: 36,
        medicalCertificate: 78712,
        specialty: "Medicina Geral e Familiar",
    }
]);

// Collection with the list of Patients
db.patients.insertMany([
    {
        name: "Manuel Andrade",
        snsNumber: 167891654,
        gender: "Masculino",
        age: 29,
        comorbidities: ["Amnesia", "IC"],
        address: {
            street: "Rua Cidade Lisboa",
            postalCode: "1542-987",
            location: {
                type: "Point",
                coordinates: [
                        -9.136998,
                        38.742331
                    ]
            }
        }
    },
    {
        name: "Joana Duarte",
        snsNumber: 176543902,
        gender: "Feminino",
        age: 63,
        comorbidities: ["Amnesia", "DPOC"],
        responsibleDoctor: {
            id: 18721,
            name: "Dra. Juliana dos Santos"
        },
        address: {
            street: "Rua Cidade Pasteleiro",
            postalCode: "1872-981",
            location: {
                type: "Point",
                coordinates: [
                    -9.160448,
                    38.745540
                ]
            } 
        }
    },
    {
        name: "Ezequiel dos Santos",
        snsNumber: 876245391,
        gender: "Masculino",
        age: 22,
        comorbidities: ["Obesidade", "DPOC"],
        responsibleDoctor: {
            id: 18721,
            name: "Dra. Juliana dos Santos"
        },
        address: {
            street: "Rua Cidade Engenheiro Fernando",
            postalCode: "2100-213",
            location: {
                type: "Point",
                coordinates: [
                    -9.174348,
                    38.787227
                ]
            }  
        }
    },
    {
        name: "Anabela de Malhadas",
        snsNumber: 245673198,
        gender: "Feminino",
        age: 71,
        comorbidities: ["Diabetes"],
        responsibleDoctor: {
            id: 78712,
            name: "Dr. Hugo Baltazar"
        },
        address: {
            street: "Avenida de Malhadas",
            postalCode: "2100-213",
            location: {
                type: "Point",
                coordinates: [
                    -9.363117,
                    38.783923
                ]
            }  
        }
    },
    {
        name: "José Rodrigues",
        snsNumber: 435761891,
        gender: "Masculino",
        age: 49,
        comorbidities: ["Demência"],
        responsibleDoctor: {
            id: 18721,
            name: "Dra. Juliana dos Santos"
        },
        address: {
            street: "Avenida de Lisboa",
            postalCode: "1245-223",
            location: {
                type: "Point",
                coordinates: [
                    -9.138928,
                    38.738335
                ]
            }    
        }
    },
    {
        name: "Jorge Gonçalves",
        snsNumber: 671342987,
        gender: "Masculino",
        age: 37,
        comorbidities: ["IC", "Diabetes", "Tensão Alta"],
        responsibleDoctor: {
            id: 78712,
            name: "Dr. Hugo Baltazar"
        },
        address: {
            street: "Avenida do Porto",
            postalCode: "2341-223",
            location: {
                type: "Point",
                coordinates: [
                    -9.133866,
                    38.737026
                ]
            }   
        }
    }
]);


// Create Collection with apointments
let patientsIds = [];
let professionalsIds = [];
db.patients.find().forEach(patient => {
    patientsIds.push(patient._id);
});
db.healthProfessionals.find().forEach(prof => {
    professionalsIds.push({
        _id: prof._id,
        specialty: prof.specialty
    })
});
let numAppointments = 50;

for(let i = 1; i<= numAppointments; i++) {
    let day = Math.floor(Math.random() * 19)+10;
    let date = "2021-05-" + day.toString() + "T00:00:00.000Z";
    let patientId = patientsIds[patientsIds.length - 1 - Math.floor(Math.random() * (patientsIds.length - 1))];
    let professional = professionalsIds[professionalsIds.length - 1 - Math.floor(Math.random() * (professionalsIds.length - 1))];
    
    db.appointments.insertOne({
        timestamp: ISODate(date),
        patientId: patientId,
        professionalId: professional._id,
        specialty: professional.specialty
    });
}

// Create Collection with institutions
db.institutions.insertMany([
    {
        name: "Hospital de Santa Maria",
        type: "Hospital",
        location: {
            type: "Point",
            coordinates: [
                -9.1628246,
                38.7484333
            ]
        }
    },
    {
        name: "Hospital Amadora Sintra",
        type: "Hospital",
        location: {
            type: "Point",
            coordinates: [
                -9.2483529,
                38.7445189
            ]
        } 
    },
    {
        name: "Centro de Saúde dos Olivais",
        type: "CSP",
        location: {
            type: "Point",
            coordinates: [
                -9.1205728,
                38.7725296
            ]
        }  
    },
    {
        name: "Centro de Saúde de Alvalade",
        type: "CSP",
        location: {
            type: "Point",
            coordinates: [
                -9.1494119,
                38.7569363
            ]
        }
    },
    {
        name: "Hospital São Francisco de Xavier",
        type: "Hospital",
        location: {
            type: "Point",
            coordinates: [
                -9.2204622,
                38.7070841
            ]
        }
    }
]);


// Create Collection with biometrical measures
let biomedicalParameters = [
    {
        type: "hr",
        min: 45,
        max: 150
    },
    {
        type: "spO2",
        min: 85,
        max: 99
    },
    {
        type: "weight",
        min: 55,
        max: 110
    }
];
let numReadings = 1000;

for(let n=0; n<=numReadings; n++){
    let timestamp = new Date().toISOString();
    let patientId = patientsIds[patientsIds.length - Math.floor(Math.random() * patientsIds.length)];
    let num = Math.floor(Math.random()*2);
    let readings = [];

    for(let i=0; i<=num; i++){
        let param = biomedicalParameters[i];
        readings.push({
            type: param.type,
            value: param.max - Math.floor(Math.random() * (param.max-param.min))
        })
    }

    db.biometricalReadings.insertOne({
        timestamp: ISODate(timestamp),
        patientId: patientId,
        readings: readings
    });
};

// Create the Indexes for the Geospatial Data
db.patients.createIndex({"address.location": "2dsphere"});
db.institutions.createIndex({location: "2dsphere"});


