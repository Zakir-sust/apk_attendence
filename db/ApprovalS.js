const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const approveSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    registration_number: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamp: true
});

const ApprovalSS = mongoose.model('ApprovalSS', approveSchema);

module.exports = ApprovalSS;