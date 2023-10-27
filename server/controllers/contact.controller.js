const phoneController = require("./phone.controller");
const { ContactModel, PhoneModel } = require("../models");
const fs = require("fs");

exports.createContact = async (req, res, next) => {
  try {
    const { name, image, phones } = req.body;
    const existingContact = await ContactModel.findOne({ name: name });
    if (existingContact) {
      return res.json({ error: "Contact already exists" });
    }
    const existingNumber = await phoneController.checkExistingNumbers(phones);
    if (existingNumber) {
      return res.json({ error: "Phone number already exists" });
    }
    const newContactInfo = new ContactModel({
      name,
      image: image ? image : "",
    });

    const phonePromises = phones.map(async (numberInfo) => {
      const { createdPhone } = await phoneController.createPhone(
        newContactInfo._id,
        numberInfo
      );

      newContactInfo.phones.push(createdPhone._id);
    });

    await Promise.all(phonePromises);
    console.log(newContactInfo.phones);

    await newContactInfo.save();
    console.log("Contact saved");
    const newContact = await ContactModel.findOne({
      _id: newContactInfo._id,
    }).populate("phones");

    return res.json({ message: "Contact successfully created", contact: newContact });
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Contact could not be created",
      errorStack: err,
    });
  }
};
exports.getContactById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await ContactModel.findOne({ _id: id }).populate('phones');
    return res.status(200).json({ contact });
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({ error: "Could not fetch contact", errorStack: err });
  }
};
exports.getContactByName = async (req, res, next) => {
  const { q } = req.query;
  console.log(q);
  try {
    const contacts = await ContactModel.find({
      name: { $regex: q, $options: "i" },
    });
    res.status(200).json({ message: "Contacts searched successfully", contacts });
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Could not fetch contact",
      errorStack: err,
    });
  }
};

exports.getAllContacts = async (req, res, next) => {
  console.log("fetching all contacts")
  try {
    const contacts = await ContactModel.find();
    res.json({ message: "Contacts fetched successfully", contacts });
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Could not fetch contacts",
      errorStack: err,
    });
  }
};

exports.updateContactInfo = async (req, res, next) => {
  try {
    console.log("updating")
    const { contactInfo} = req.body;
    var updateInfo = {
      ...contactInfo,
    };
   

    const updatedContact = await ContactModel.findOneAndUpdate(
      { _id: contactInfo._id },
      { ...updateInfo },
      { new: true }
    );
   
    return res.json({
      message: "Contact updated successfully",
      updatedContact: updatedContact,
    });
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Could not update contact",
      errorStack: err,
    });
  }
};

exports.deleteContact = async (req, res, next) => {
  const { contactId } = req.body;
  try {
    await PhoneModel.deleteMany({ contact: contactId });
    const response = await ContactModel.findByIdAndDelete(contactId);
    if(response){
      return res.json({ message: "Contact deleted successfully" });
    }else{
      return res.json({error: "Contact not found"})
    }
  } catch (err) {
    console.log(JSON.stringify(err, undefined, 2));
    return res.json({
      error: "Contact was not deleted",
      errorStack: err,
    });
  }
};
