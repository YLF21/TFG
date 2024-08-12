const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects',
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classrooms',
        required: true
    }
});

const TimetableModel = mongoose.model('timetables', TimetableSchema);

module.exports = TimetableModel;
