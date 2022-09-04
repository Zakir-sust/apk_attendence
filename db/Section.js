const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    section: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true
    },
    students: [{
        id: {
            type: String,
            required: true
        },
        registration_number: {
            type: String,
            required: true
        }
    }]
}, {
    timestamp: true
});

const Section = mongoose.model('Section', uSchema);

module.exports = Section;