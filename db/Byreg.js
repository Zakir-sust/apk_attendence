const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    registration_number: {
        type: String,
        required: true,
    },
    section_id: {
        type: String,
        required: true
    },
    record: [{
        date: {
            type: Date,
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

const Byreg = mongoose.model('Byreg', uSchema);

module.exports = Byreg;