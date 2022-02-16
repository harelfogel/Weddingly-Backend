const Supplier = require('../models/supplier');
const axios = require('axios');
const { API_KEY } = require('../constants');
const utils = require('./../utils');

exports.suppliersController = {
    updateSupplier(req,res){
        Supplier.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
        .then((result) => {
            if (result) {
                res.json(result);
            }
        })
        .catch((err) => {
            res.status(404).json({ message: `Can't update supplier!` });
        })

    },
    getSupplierById(req, res) {
        Supplier.findById(req.params.id)
            .then((result) => {
                if (result) {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ message: `Can't find supplier by id!` });
            })
    },
    getSuppliers(req, res) {
        Supplier.find({}).sort({ rating: 'desc' }).exec((err, docs) => {
            if (err) {
                res.status(404).json({ message: "Can't find supplier!" });
            } else {
                res.json(docs);
            }
        });
    },
    getSupplierRating(req, res) {
        const ratingFromApi = {
            method: `GET`,
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.id}&key=${API_KEY}`,
            headers: {}
        }
        axios(ratingFromApi)
            .then(function (response, err) {
                if (response) {
                    res.json(response);
                }
                else {
                    res.json({ message: `Cant find rating of the supplier of ${placeId}` });
                }
            })
    },
    async getSupplierByType(req, res) {
        try {
            const suppliersByType = await Supplier.find({ type:{$regex:req.params.Type,$options:"i"} });
            if (suppliersByType.length > 0) {
                res.status(200).json({ suppliers:suppliersByType});
            } else {
                res.status(404).json({ error: "coudln't find suppliers type in the data base" })
            }
        } catch (e) {
            utils.fileLogger.write(e);
            res.status(400).json({ error: "coudln't find suppliers type in the data base" });
        }
    },
    getSupplierMeetings(req, res) {
        if (req.params.sid) {
            Supplier.find({ _id: req.params.sid }, { meeting: 1 })
                .then(meetings => {
                    if (meetings) {
                        res.json(meetings);
                    } else {
                        throw 'Cant find meetings';
                    }
                })
                .catch(err => {
                    res.json({ meesage: 'Invalid supplier id' });
                })
        } else {
            res.status(400).json({ message: 'Invalid supplier id' });
        }

    },
    addSupplier(req, res) {
        Supplier.create(req.body)
            .then((newSupplier) => {
                if (!newSupplier) {
                    throw `Can't add Supplier!`;
                }
                else {
                    res.json(newSupplier);
                }
            })
            .catch((err) => {
                res.status(404).json({ message: err });
            })
    },

    async createMeeting(req, res) {
        try {
            const newMeeting = await Supplier.findByIdAndUpdate(req.params.id, {
                $push: { meeting: { ...req.body.meeting } }
            }, { new: true }
            )
            res.status(200).send(newMeeting);
        } catch (e) {
            res.status(400).send(e);
        }
    },
    async updateMeeting(req, res) {
        try {
            await Supplier.findById(req.params.sid, function (err, supplier) {
                try {
                    if (!err) {
                        if (!supplier) {
                            res.status(404).json({ message: 'supplier Not Found!' });
                        } else {
                            supplier.meeting.id(req.params.mid).approved = req.body.approved;
                            supplier.save(function (saveerr, saveMeeting) {
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
                    utils.fileLogger.write(e);
                }

            })
        } catch (e) {
            utils.fileLogger.write(e);
        }

    },
    async deleteMeeting(req, res) {
        try {
            await Supplier.findById(req.params.sid, function (err, supplier) {
                try {
                    if (!err) {
                        if (!supplier) {
                            res.status(404).send('supplier Not Found!');
                        } else {
                             supplier.meeting.id(req.params.mid).remove(function (removerr, removedMeeting) {
                                if (removerr) {
                                    res.status(400).json({ meesage: `Error! Cant remove Meeting` });
                                } 
                            });
                            supplier.markModified('meeting'); 
                            supplier.save(function(saverr,savedeletedMeeting){
                                if(!saverr){
                                    res.status(200).send(savedeletedMeeting);
                                } else{
                                    res.status(400).send(saverr.message);
                                }
                            })
                        }
                    } else {
                        res.status(400).send(err.message);

                    }
                } catch (e) {
                    utils.fileLogger.write(e);
                }
            })

        } catch (e) {
            utils.fileLogger.write(e);
        }
    }
};




