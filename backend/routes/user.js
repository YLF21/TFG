var express = require('express');
var router = express.Router();
const UserModel = require('../models/UserModel');
const StudentSubjectModel = require('../models/StudentSubjectModel');
const bcrypt = require('bcrypt');

const checkIsProfessorMiddleware = require('../middlewares/checkIsProfessorMiddleware');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');

router.get('/student', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {
        const students = await UserModel.find({rol: 'student'})
        res.json({
            code: '0000',
            msg: 'Successfully retrieved all students',
            data: students
        });
    } catch (err) {
        console.log(err)
        res.json({
            code: '2001',
            msg: 'Error while fetching students',
            data: null
        });
    }
});

router.get('/student/subject/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {
        const subjectId = req.params.id;

        const studentSubjects = await StudentSubjectModel.find({ subject: subjectId })
            .populate({
                path: 'student',
                select: '-password'
            });

        if (studentSubjects.length > 0) {
            const studentsWithSubjectIds = studentSubjects.map(studentSubject => {
                const student = studentSubject.student.toObject();
                student.studentSubjectId = studentSubject._id;
                return student;
            });

            res.json({
                code: '0000',
                msg: 'Successfully retrieved the students',
                data: studentsWithSubjectIds
            });
        } else {
            res.json({
                code: '2004',
                msg: 'No students found for this subject',
                data: studentSubjects
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            code: '2005',
            msg: 'Error while fetching the students',
            data: null
        });
    }
});


router.get('/student/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {
        const student = await UserModel.findOne({ _id: req.params.id, rol: 'student' });
        if (!student) {
            return res.json({
                code: '2002',
                msg: 'Subject not found',
                data: null
            });
        }
        res.json({
            code: '0000',
            msg: 'Successfully retrieved the student',
            data: student
        });
    } catch (err) {
        console.log(err)
        res.json({
            code: '2003',
            msg: 'Error while fetching the student',
            data: null
        });
    }
});

router.patch('/user/password', checkTokenMiddleware, async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;

        const user = await UserModel.findById(req.user._id);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.json({
                code: '2006',
                msg: 'Incorrect old password',
                data: null
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await UserModel.updateOne({ _id: req.user._id }, { password: hashedPassword });

        res.json({
            code: '0000',
            msg: 'Password updated successfully',
            data: null
        });
    } catch (error) {
        res.json({
            code: '2007',
            msg: 'Error while updating password',
            data: null
        });
    }
});

module.exports = router;