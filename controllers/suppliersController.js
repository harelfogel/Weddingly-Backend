const Supplier = require('../models/supplier');
const axios = require('axios');
const { API_KEY } = require('../constants');

exports.suppliersController = {
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
            const suppliersByType = await Supplier.find({ type: req.params.Type });
            if (suppliersByType.length > 0) {
                res.status(200).json({ suppliers: suppliersByType });
            } else {
                res.status(404).json({ error: "coudln't find suppliers type in the data base" })
            }
        } catch (e) {
            console.log(e);
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
                if(!newSupplier){
                    throw `Can't add Supplier!`;
                }
                else{
                    res.json(newSupplier);
                }
            })
            .catch((err) => {
                res.status(404).json({message:err});
            })
    },

    async createMeeting(req, res) {
        
        const newMeeting = await Supplier.findByIdAndUpdate(req.params.id, {
            $push: { meeting: { ...req.body.meeting } }
        }, { new: true }
        )
        res.status(200).send(newMeeting);
    }
};




