const express = require('express')
const {phoneController} = require('../controllers')
const router = express.Router()

router.get("/phone/search", phoneController.getContactsByNumber)
router.post("/phone/delete", phoneController.deletePhoneById)
router.post("/phone/update", phoneController.updatePhones)

module.exports = router