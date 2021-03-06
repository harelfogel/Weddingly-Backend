const { Router } = require('express');
const { customersController } = require('../controllers/customersController');
const { suppliersController } = require('../controllers/suppliersController');
const customersRouter = new Router();
module.exports = { customersRouter,suppliersController };
customersRouter.get('/usersettings', (req, res) => {
    res.cookie("userData", req.body);
    res.send('user data added to cookie');
  });
customersRouter.get('/' ,customersController.getCustomers); 
customersRouter.get('/:id', customersController.getCustomerById);
customersRouter.post('/appoitments/:cid' ,customersController.createAppoitments);
customersRouter.post('/couple' ,customersController.addCustomer); 
customersRouter.get('/appoitments/:cid' ,customersController.getCustomerAppoitment);
customersRouter.put('/appoitmentsAdaptation/:cid/:mid/:updtid', customersController.updateAppoitmentIdToSupplierMeeting);
customersRouter.put('/appoitmentsApproved/:cid/:mid', customersController.updateAprrovedAppoitment);

