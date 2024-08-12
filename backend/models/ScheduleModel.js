const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
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
    },
    timetable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'timetables',
        required: true
    }
});

ScheduleSchema.index({ "endTime": 1 }, { expireAfterSeconds: 0 });

const ScheduleModel = mongoose.model('schedules', ScheduleSchema);

module.exports = ScheduleModel;
