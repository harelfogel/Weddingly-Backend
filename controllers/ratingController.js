const axios = require('axios');
const { API_KEY } = require('../constants');

exports.ratingController = {
     getSupplierRating(req,res){
         if(req.params.id){
            const ratingFromApi = {
            method: `GET`,
            url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${API_KEY}`,
            headers: {}
        }
        axios(ratingFromApi)
            .then(function (response,err) {
                if(response && (req.params.id)){
                     res.json({rating:`${response.data.result["rating"]}`});
                } else{
                     res.json({message:`Cant find rating of the supplier of ${placeId}`});
                }
            })
            .catch(err => {
                res.json({message:`Cant find rating of the supplier of ${placeId}`});
            })
         }
        
    }
};




