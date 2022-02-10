const { Router } = require('express');
const { suppliersController } = require('../controllers/suppliersController');
const { verifyToken } = require('../middlewares/authJwt');
const suppliersRouter = new Router();
module.exports = { suppliersRouter };

// const getUserCookie=(){

// }

suppliersRouter.get('/', (req, res,next) => {
    res.cookie("userData", req.body);
    res.send('user data added to cookie');
    next();
  });
suppliersRouter.get('/',verifyToken, suppliersController.getSuppliers);
suppliersRouter.get('/:id', suppliersController.getSupplierById);
suppliersRouter.post('/', suppliersController.addSupplier);
suppliersRouter.post('/:id',suppliersController.createMeeting);
suppliersRouter.get('/ByType/:Type',verifyToken,suppliersController.getSupplierByType);
suppliersRouter.get('/meetings/:sid', suppliersController.getSupplierMeetings);
  
 