const axios = require('axios');
const { API_KEY } = require('../constants');

exports.ratingController = {
    getSupplierRating(req, res) {
        const placeId= req.params.placeId;
        if (req.params.id) {
            const ratingFromApi = {
                method: `GET`,
                url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${API_KEY}`,
                headers: {}
            }
            axios(ratingFromApi)
                .then(function (response, err) {
                    try {
                        if (response && (req.params.id)) {
                            res.json({ rating: `${response.data.result["rating"]}` });
                        }
                        else{
                            throw err;
                        }
                    }
                    catch (error) {
                        res.json({ message: `Cant find rating of the supplier of ${placeId}` });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({ message: `Cant find rating of the supplier of ${placeId}` });
                })
        }

    }
};




