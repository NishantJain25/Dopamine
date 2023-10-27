const { PhoneModel, ContactModel } = require("../models");

exports.createPhone = async (contactId, numberInfo) => {
  try {
    const { number, countryCode, type } = numberInfo;
    const existingPhone = await PhoneModel.findOne({ number: number });
    if (existingPhone) {
      return { error: "Phone number already exists" };
    }
    const phoneInfo = await new PhoneModel({
      number,
      countryCode,
      type,
      contact: contactId,
    });
    await phoneInfo.save();
    console.log("Phone saved");
    const createdPhone = await PhoneModel.findOne({ number: number });

    return { createdPhone };
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
  }
};

exports.checkExistingNumbers = async (numberList) => {
  var exists = false;
  try {
    const PromiseList = numberList.map(async (phoneNo) => {
      const result = await PhoneModel.findOne({ number: phoneNo.number });
      if (result) {
        exists = true;
      }
    });

    await Promise.all(PromiseList);

    return exists;
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
  }
};

exports.getContactsByNumber = async (req, res, next) => {
  const { q } = req.query;
  try {
    const numbers = await PhoneModel.find({ number: { $regex: q } }).populate(
      "contact"
    );
    res.json({ message: "Contacts searched successfully", contacts: numbers });
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Contacts could not be fetched",
      errorStack: err,
    });
  }
};

exports.deletePhone = async (number) => {
    try {
        const deletedNumber = await PhoneModel.findOneAndDelete({number: number})
        return { deletedNumber}
    } catch (err) {
        console.log(JSON.stringify(err, undefined, 2))
    }
}

exports.deletePhoneById = async (req, res, next) => {
    const {phoneId} = req.body
    try {
        const deletedPhone = await PhoneModel.findByIdAndDelete(phoneId)
        console.log(deletedPhone)
        const response = await ContactModel.findOneAndUpdate({_id: deletedPhone.contact}, {$pull : {"phones" : deletedPhone._id}})
        if(response){

          return res.json({message: "Number deleted successfully"})
        }else{
          return res.json({error: "Number not found"})
        }
    } catch (err) {
        console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Number could not be deleted",
      errorStack: err,
    });
    }
}

exports.updatePhones = async (req, res, next) => {
  const {phones} = req.body
  var updatedPhones = []
  try{
    const phonePromises = phones.map(async (numberInfo) => {
      console.log(numberInfo)
      const updatedPhone  = await PhoneModel.findOneAndUpdate(
        {_id: numberInfo._id},
        {...numberInfo},
        {new: true}
      );
      updatedPhones.push(updatedPhone)
    });
    await Promise.all(phonePromises)
    console.log(updatedPhones)
    res.json({message: "Updated successfully"})
  }catch(err){
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Number could not be deleted",
      errorStack: err,
    });
  }
}