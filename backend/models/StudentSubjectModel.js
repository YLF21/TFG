const mongoose = require('mongoose');

let StudentSubjectSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects',
        required: true
    }

});

let StudentSubjectModel = mongoose.model('studentSubjects', StudentSubjectSchema);

module.exports = StudentSubjectModel;