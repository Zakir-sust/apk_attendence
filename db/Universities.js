const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    university: {
        type: String,
        required: true,
        unique: true
    },
    key: {
        type: String,
        required: true
    }
}, {
    timestamp: true
});

const Universities = mongoose.model('Universities', uSchema);

module.exports = Universities;