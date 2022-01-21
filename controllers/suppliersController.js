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
    }
};




