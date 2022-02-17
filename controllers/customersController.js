
const Customer = require('../models/customer');
const UserModel = require('../models/customer');
const utils = require('./../utils');

function splitStringBetweenUppercase(stringValue) {
    if (stringValue) {
        let newString = stringValue.split(/(?=[A-Z])/);
        let returnedString = "";
        newString.forEach(element => {
            returnedString += ' ' + element;
        });
        return returnedString;
    } else {
        return null;
    }

}

exports.customersController = {

    getCustomerById(req, res) {
        Customer.findById(req.params.id)
            .then((result) => {
                if (result) {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ message: `Can't find customer by id!` });
            })
    },
    getCustomers(req, res) {
        Customer.find()
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.status(404).json({ message: `Can't find Customers!` });
            })
    },
    addCustomer(req, res) {
        Customer.create(req.body)
            .then((newCustomer) => {
                res.json(newCustomer);
            })
            .catch((err) => {
                res.status(404).json({ message: `Can't add customer!` });
            })
    },
    getCustomerAppoitment(req, res) {
        console.log(req.params.cid)
        if (req.params.cid) {
            UserModel.findById(req.params.cid).select({ appointment: 1 })
                .then(appoitment => {
                    if (appoitment) {
                        res.json(appoitment);
                    } else {
                        throw 'Cant find meetings';
                    }
                })
                .catch(err => {
                    res.json({ meesage: 'Invalid customer id' });
                })
        } else {
            res.status(400).json({ message: 'Invalid customer id' });
        }


    },
    async createAppoitments(req, res) {
        try {
            const customerId = req.params.cid;
            const newMeeting = {
                meetingSupplierId: req.body.meetingSupplierId,
                meetingSupplierName: splitStringBetweenUppercase(req.body.meetingSupplierName),
                meetingDate: req.body.meetingDate,
                meetingSupplierType: req.body.type,
                supplierMeetingId: req.body.supplierMeetingId
            };
            if (newMeeting && customerId) {
                const newUserUpdate = await UserModel.findOneAndUpdate({
                    _id: customerId
                }, {
                    $push: {
                        appointment: {
                            "supplierId": newMeeting.meetingSupplierId,
                            "supplierName": newMeeting.meetingSupplierName,
                            "date": newMeeting.meetingDate,
                            "type": newMeeting.meetingSupplierType,
                            "supplierMeetingId": newMeeting.supplierMeetingId
                        }
                    }
                }, {
                    new: true,
                })
                res.status(200).json(newUserUpdate);
            } else {
                res.json({ message: `Cant add new meeting to customer` });
            }
        } catch (e) {
            console.log(e);
        }

    },
    async updateAppoitmentIdToSupplierMeeting(req, res) {
        try {
            await UserModel.findById(req.params.cid, function (err, user) {
                try {
                    if (!err) {
                        if (!user) {
                            res.status(404).json({ message: 'user Not Found!' });
                        } else {
                            user.appointment.id(req.params.mid)._id = req.params.updtid;
                            user.save(function (saveerr, saveMeeting) {
                                if (!saveerr) {
                                    res.status(200).send(saveMeeting);
                                } else {
                                    res.status(400).json(saveerr.message);
                                }
                            });
                        }
                    } else {
                        res.status(400).json(err.message);
                    }
                } catch (e) {
                    console.log(e);
                }

            })
        } catch (e) {
            console.log(e);
        }

    },
    async updateAprrovedAppoitment(req, res) {
        try {
            const clientId = req.params.cid
            const appointmentId = req.params.mid
            const findClient = await UserModel.findOneAndUpdate({ _id: clientId, appointment: { $elemMatch: { _id: appointmentId } } }, {
                $set: { 'appointment.$.approved': true }
            }, { new: true })
            res.send("ok")
        } catch (e) {
            console.log(e)
        }

    }
};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};






