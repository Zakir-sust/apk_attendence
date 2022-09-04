const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const approveSchema = new Schema({
    id: {
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
    }
}, {
    timestamp: true
});

const ApprovalDh = mongoose.model('ApprovalDh', approveSchema);

module.exports = ApprovalDh;