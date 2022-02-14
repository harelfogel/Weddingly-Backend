
const Customer = require('../models/customer');

function splitStringBetweenUppercase(stringValue) {
    if (stringValue) {
        let newString = stringValue.split(/(?=[A-Z])/);
        let returnedString = "";
        newString.forEach(element => {
            returnedString += ' ' + element;
        });
        return returnedString;
    } else {
        return null;
    }

}

function splitStringBetweenLetterP(stringValue) {
    if (stringValue) {
        let newString = stringValue.split("p")[0];
        return (newString + " " + "pm");
    } else{
        return null;
    }

}

exports.customersController = {

    getCustomerById(req, res) {
        Customer.findById(req.params.id)
            .then((result) => {
                if (result) {
                    res.json(result);
                }
            })
            .catch((err) => {
                res.status(404).json({ message: `Can't find customer by id!` });
            })
    },
    getCustomers(req, res) {
        Customer.find()
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.status(404).json({message:`Can't find Customers!`});
            })
    },
    addCustomer(req, res) {
        Customer.create(req.body)
            .then((newCustomer) => {
                res.json(newCustomer);
            })
            .catch((err) => {
                res.status(404).json({message:`Can't add customer!`});
            })
    },
    getCustomerAppoitment(req,res){
        if(req.params.cid){
            Customer.find({_id:req.params.cid},{appointment:1})
            .then(appoitment=>{
                    if(appoitment){
                        res.json(appoitment);
                    }else{
                        throw 'Cant find meetings';
                    }
            })
            .catch(err=>{
                res.json({meesage:'Invalid customer id'});
            })
        } else{
            res.status(400).json({message:'Invalid customer id'});
        }
       

    },
    createAppoitments(req, res) {
        const customerId = req.params.cid;
        const newMeeting = {
            meetingSupplierId: req.body.meetingSupplierId,
            meetingSupplierName: splitStringBetweenUppercase(req.body.meetingSupplierName),
            meetingDate: req.body.meetingDate,
            meetingSupplierType:req.body.type
        };
        if (newMeeting && customerId) {
            Customer.findOneAndUpdate({
                _id: customerId
            }, {
                $push: {
                    appointment: {
                        "supplierId": newMeeting.meetingSupplierId,
                        "supplierName": newMeeting.meetingSupplierName,
                        "date": newMeeting.meetingDate,
                        "type":newMeeting.meetingSupplierType
                    }
                }
            }, {
                new: true,
                upsert: true
            })
                .exec(() => {
                    res.status(200).json(req.body);
                })
        } else {
            res.json({ message: `Cant add new meeting to customer` });
        }
    }
};

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };






