const { Router } = require('express');
const { customersController } = require('../controllers/customersController');
const { suppliersController } = require('../controllers/suppliersController');
const customersRouter = new Router();
module.exports = { customersRouter,suppliersController };

customersRouter.get('/' ,customersController.getCustomers); 
customersRouter.get('/:id', customersController.getCustomerById);
customersRouter.post('/appoitments/:cid' ,customersController.createAppoitments);
customersRouter.post('/couple' ,customersController.addCustomer); 
customersRouter.get('/appoitments/:cid' ,customersController.getCustomerAppoitment);

  
