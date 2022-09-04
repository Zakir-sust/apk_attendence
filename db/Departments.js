const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    department: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamp: true
});

const Department = mongoose.model('Departments', uSchema);

module.exports = Department;