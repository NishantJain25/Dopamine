const express = require('express')
const {contactController} = require('../controllers')
const router = express.Router()



router.get('/api/vercel', (req, res) => {res.send("Hey")})

router.post('/contacts/create', contactController.createContact)
router.get('/contacts/getAllContacts', contactController.getAllContacts)
router.get('/contacts/getContactById/:id', contactController.getContactById)
router.get('/contacts/search', contactController.getContactByName)
router.post('/contacts/update', contactController.updateContactInfo)
router.post('/contacts/delete', contactController.deleteContact)

module.exports = router