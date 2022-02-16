const { Router } = require('express');
const { suppliersController } = require('../controllers/suppliersController');
const { verifyToken } = require('../middlewares/authJwt');
const suppliersRouter = new Router();
module.exports = { suppliersRouter };

suppliersRouter.get('/', (req, res,next) => {
    res.cookie("userData", req.body);
    res.send('user data added to cookie');
    next();
  });
  
suppliersRouter.get('/', suppliersController.getSuppliers);
suppliersRouter.get('/:id', suppliersController.getSupplierById);
suppliersRouter.post('/', suppliersController.addSupplier);
suppliersRouter.post('/:id',suppliersController.createMeeting);
suppliersRouter.get('/ByType/:Type',suppliersController.getSupplierByType);
suppliersRouter.get('/meetings/:sid', suppliersController.getSupplierMeetings);
suppliersRouter.put('/:id', suppliersController.updateSupplier);  
suppliersRouter.put('/meetings/:sid/:mid', suppliersController.updateMeeting);
suppliersRouter.put('/removeMeeting/:sid/:mid', suppliersController.deleteMeeting);
  

 