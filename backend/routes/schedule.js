var express = require('express');
var router = express.Router();
const StudentSubjectModel = require('../models/StudentSubjectModel');
const ScheduleModel = require('../models/ScheduleModel');
const ClassroomModel = require('../models/ClassroomModel');
const TimetableModel = require('../models/TimetableModel');

const checkIsStudentMiddleware = require('../middlewares/checkIsStudentMiddleware');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');

function resetDateToZero(date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
}

function changeDate(date) {
    const newDate = new Date(date);


    newDate.setUTCFullYear(2000);
    newDate.setUTCMonth(0);
    newDate.setUTCDate(1);

    resetDateToZero(newDate)
    return newDate;
}

function isSameDayUTC(date1, date2) {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate();
}

router.post('/schedule', checkTokenMiddleware, checkIsStudentMiddleware, async (req, res) => {
    try {
        const { subject, startTime, endTime, classroom } = req.body;
        const student = req.user._id;
        const startDate = new Date(startTime)
        const endDate = new Date(endTime)
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - timezoneOffset);

        resetDateToZero(endDate);
        resetDateToZero(startDate);
        
        if (!isSameDayUTC(startDate, endDate)) {
            return res.json({
                code: '7007',
                msg: 'Start time and end time are not on the same day',
                data: null
            });
        }

        if (startDate.getTime() < localDate.getTime() + 30 * 60 * 1000) {
            return res.json({
                code: '7008',
                msg: 'Start time must be at least 30 minutes later than the current time',
                data: null
            });
        }

        const enrollment = await StudentSubjectModel.findOne({ student, subject });
        if (!enrollment) {
            return res.json({
                code: '7001',
                msg: 'Student is not enrolled in this subject',
                data: null
            });
        }

        const request = await ScheduleModel.findOne({student, startTime: startDate,endTime: endDate});
        if (request) {
            return res.json({
                code: '7002',
                msg: 'Student has already scheduled a class during this time',
                data: null
            });
        }

        const classroomInfo = await ClassroomModel.findById(classroom);
        if (!classroomInfo) {
            return res.json({
                code: '7003',
                msg: 'Classroom not exist',
                data: null
            });
        }

        const numStudent = await ScheduleModel.countDocuments({
            subject, startTime: startDate,
            endTime: endDate, classroom
        });
        if (numStudent >= classroomInfo.studentCapacity) {
            return res.json({
                code: '7004',
                msg: 'Classroom has no more capacity',
                data: null
            });
        }

        const dayOfWeek = startDate.getDay();
        const newStartTime = changeDate(startTime);
        const newEndTime = changeDate(endTime);

        const timetableInfo = await TimetableModel.findOne({
            dayOfWeek, subject, startTime: newStartTime,
            endTime: newEndTime, classroom
        });

        if (!timetableInfo) {
            return res.json({
                code: '7005',
                msg: 'Timetable not exist',
                data: null
            });
        }

        const schedule = await ScheduleModel.create({
            student, startTime: startDate,
            endTime: endDate, subject, classroom, timetable:timetableInfo._id
        });

        res.json({
            code: '0000',
            msg: 'Schedule created successfully',
            data: schedule
        });

    } catch (err) {
        console.log(err)
        res.json({
          code: '7006',
          msg: 'Creation failed, please try again later',
          data: null
        });
    }
});

router.get('/schedule/:id', checkTokenMiddleware, checkIsStudentMiddleware, async (req, res) => {
    try {
        const schedule = await ScheduleModel.find({student : req.user._id, subject:req.params.id})
        .populate('classroom');
        if (!schedule) {
            return res.json({
                code: '7009',
                msg: 'Schedule not found',
                data: schedule
            });
        }
        res.json({
            code: '0000',
            msg: 'Successfully retrieved the schedule',
            data: schedule
        });
    } catch (err) {
        console.log(err)
        res.json({
            code: '7010',
            msg: 'Error while fetching the schedule',
            data: null
        });
    }
});

router.delete('/schedule/:id', checkTokenMiddleware, checkIsStudentMiddleware, async (req, res) => {
    try {

        const schedule = await ScheduleModel.deleteOne({_id: req.params.id, student:req.user._id});
        if (schedule.deletedCount === 0) {
            return res.json({
                code: '7011',
                msg: 'Schedule not found',
                data: null
            });
        }
        res.json({
            code: '0000',
            msg: 'Schedule deleted successfully',
            data: null
        });
    } catch (err) {
        console.log(err);
        res.json({
            code: '7012',
            msg: 'Error while deleting the schedule',
            data: null
        });
    }
});

module.exports = router;