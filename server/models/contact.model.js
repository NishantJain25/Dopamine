/* models

- Contact : ContactID (PK), Name, Image
- Phone number : PhoneID (PK), PhoneNo, ContactID (FK)
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
    {
        name: {type: String, required: true},
        image: {type: String, required: false},
        phones: [{type: Schema.Types.ObjectId, ref: 'Phone'}]
    }
)

const ContactModel = mongoose.model('Contact', contactSchema)
module.exports = ContactModel