var express = require('express');
var router = express.Router();
const TimetableModel = require('../models/TimetableModel');
const SubjectModel = require('../models/SubjectModel');
const ScheduleModel = require('../models/ScheduleModel');

const checkIsProfessorMiddleware = require('../middlewares/checkIsProfessorMiddleware');
const checkIsNotStudentMiddleware = require('../middlewares/checkIsNotStudentMiddleware');
const checkIsNotAdminMiddleware = require('../middlewares/checkIsNotAdminMiddleware');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');

function resetDate(hour, minute){
    const date = new Date(2000, 0, 1, hour, minute);
    date.setUTCHours(hour, minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function timeVerification(startHour, startMinute, endHour, endMinute) {
    if (startHour < 9 || startHour > 20 || endHour < 10 || 
        (endHour == 21 && endMinute > 0) || endHour > 21) {
        return { code: '6004', msg: 'Class hours are from 9 am to 9 pm', data: null };
    }

    if (startHour < 0 || startHour >= 24 || startMinute < 0 || startMinute >= 60 ||
        endHour < 0 || endHour >= 24 || endMinute < 0 || endMinute >= 60) {
        return { code: '6006', msg: 'Invalid time range', data: null };
    }

    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        return { code: '6005', msg: 'Start time must be earlier than end time', data: null };
    }

    const durationInMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
    if (durationInMinutes < 60) {
        return { code: '6003', msg: 'A lesson takes at least one hour', data: null };
    }

    return null;
}

router.post('/timetable', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {
        const {dayOfWeek, startHour, startMinute, endHour, endMinute, subject, classroom} = req.body;

        const subjects = await SubjectModel.find({professor: req.user._id, _id:subject});
        if(subjects.length === 0){
            return res.json({
                code: '6009',
                msg: 'The subject does not exist or this subject does not belong to this teacher',
                data: null
            });
        }

        if(!(dayOfWeek >= 1 && dayOfWeek <= 5)){
            return res.json({
                code: '6018',
                msg: 'dayOfWeek must be between 1 and 5',
                data: null
            });
        }

        const validationResult = timeVerification(startHour, startMinute, endHour, endMinute);
        if (validationResult) {
            return res.json(validationResult);
        }

        const startTime = resetDate(startHour, startMinute);
        const endTime = resetDate(endHour, endMinute);

        const conflictingTimetable = await TimetableModel.findOne({
            dayOfWeek,
            classroom,
            $or: [
                {startTime: {$lt:endTime}, endTime: {$gt:startTime}},
                {startTime: {$gte:startTime, $lt:endTime}},
                {endTime: {$gt:startTime, $lte:endTime}}
            ]
        });

        if (conflictingTimetable) {
            return res.json({
                code: '6001',
                msg: 'Classroom time slot is already booked',
                data: null
            });
        }

        const timetable = await TimetableModel.create({dayOfWeek, startTime, endTime, subject, classroom});
        res.json({
            code: '0000',
            msg: 'Timetable created successfully',
            data: timetable
        });
    } catch (err) {
        console.log(err)
        res.json({
          code: '6002',
          msg: 'Creation failed, please try again later',
          data: null
        });
    }
});

router.get('/timetable/subject/:id', checkTokenMiddleware, checkIsNotAdminMiddleware, async (req, res) => {
    try {
        const subjectId = req.params.id;

        const timetable = await TimetableModel.find({subject: subjectId})
            .populate('subject')
            .populate('classroom');

        if(timetable.length == 0){
            return res.json({
                code: '6012',
                msg: 'Timetable not found',
                data: timetable
            });
        }

        res.json({
            code: '0000',
            msg: 'Timetable retrieved successfully',
            data: timetable
        });
    } catch (err) {
        console.error(err);
        res.json({
            code: '6007',
            msg: 'Error while fetching the timetable',
            data: null
        });
    }
});

router.get('/timetable/classroom/:id', checkTokenMiddleware, checkIsNotStudentMiddleware, async (req, res) => {
    try {
        const classroomId = req.params.id;

        const timetable = await TimetableModel.find({ classroom: classroomId })
            .populate('subject')
            .populate('classroom');

        if (timetable.length == 0) {
            return res.json({
                code: '6013',
                msg: 'Timetable not found',
                data: timetable
            });
        }

        res.json({
            code: '0000',
            msg: 'Timetable retrieved successfully',
            data: timetable
        });
    } catch (err) {
        console.error(err);
        res.json({
            code: '6008',
            msg: 'Error while fetching the timetable',
            data: null
        });
    }
});

router.delete('/timetable/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {

        const timetable = await TimetableModel.deleteOne({_id: req.params.id});
        if (timetable.deletedCount === 0) {
            return res.json({
                code: '6010',
                msg: 'Timetable not found',
                data: null
            });
        }

        await ScheduleModel.deleteMany({timetable: req.params.id});

        res.json({
            code: '0000',
            msg: 'Timetable and related schedules deleted successfully',
            data: null
        });
    } catch (err) {
        console.log(err);
        res.json({
            code: '6011',
            msg: 'Error while deleting the schedule',
            data: null
        });
    }
});

router.put('/timetable/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) =>  {
    try {
        const {dayOfWeek, startHour, startMinute, endHour, endMinute, subject, classroom} = req.body;

        const subjects = await SubjectModel.find({professor: req.user._id, _id:subject});
        if(subjects.length === 0){
            return res.json({
                code: '6014',
                msg: 'The subject does not exist or this subject does not belong to this teacher',
                data: null
            });
        }

        const validationResult = timeVerification(startHour, startMinute, endHour, endMinute);
        if (validationResult) {
            return res.json(validationResult);
        }

        const startTime = resetDate(startHour, startMinute);
        const endTime = resetDate(endHour, endMinute);       

        const conflictingTimetable = await TimetableModel.find({
            dayOfWeek,
            classroom,
            $or: [
                {startTime: {$lt:endTime}, endTime: {$gt:startTime}},
                {startTime: {$gte:startTime, $lt:endTime}},
                {endTime: {$gt:startTime, $lte:endTime}}
            ]
        });

        if ((conflictingTimetable.length > 1) || 
            (conflictingTimetable.length == 1 && conflictingTimetable[0]._id != req.params.id)) {
            return res.json({
                code: '6015',
                msg: 'Classroom time slot is already booked',
                data: null
            });
        }

        const updatedTimetable = await TimetableModel.findByIdAndUpdate(
            req.params.id,
            { dayOfWeek, startTime, endTime, subject, classroom },
            { new: true }
        );

        if (!updatedTimetable) {
            return res.json({
                code: '6016',
                msg: 'Timetable not found or not authorized to update',
                data: null
            });
        }

        await ScheduleModel.deleteMany({timetable: req.params.id});

        res.json({
            code: '0000',
            msg: 'Timetable created successfully',
            data: updatedTimetable
        });
        
    } catch (err) {
        console.log(err)
        res.json({
          code: '6017',
          msg: 'Creation failed, please try again later',
          data: null
        });
    }
});

module.exports = router;