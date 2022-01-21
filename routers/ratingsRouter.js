const { Router } = require('express');
const { ratingController } = require('../controllers/ratingController');
const ratingsRouter = new Router();
module.exports = { ratingsRouter };

ratingsRouter.get('/:id', ratingController.getSupplierRating);
