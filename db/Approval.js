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
}, {
    timestamp: true
});

const Approval = mongoose.model('Approval', approveSchema);

module.exports = Approval;