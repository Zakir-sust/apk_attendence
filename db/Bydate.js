const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    section_id: {
        type: String,
        required: true
    },
    record: [{
        registration_number: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        }
    }]
}, {
    timestamp: true
});

const Bydate = mongoose.model('Bydate', uSchema);

module.exports = Bydate;