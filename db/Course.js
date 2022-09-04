const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    session_id: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    teacher_id: {
        type: String,
        required: true
    }
}, {
    timestamp: true
});

const Course = mongoose.model('Course', uSchema);

module.exports = Course;