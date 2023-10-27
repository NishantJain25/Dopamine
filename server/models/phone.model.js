const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const phoneSchema = new Schema(
    {
        number: {type: String, required: true},
        countryCode: {type: String, required: true},
        type: {type: String, required: true},
        contact: {type: Schema.Types.ObjectId, ref: 'Contact', required: true}

    }
)

const PhoneModel = mongoose.model('Phone', phoneSchema)
module.exports = PhoneModel