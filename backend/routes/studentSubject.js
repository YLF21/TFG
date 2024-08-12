var express = require('express');
var router = express.Router();
const UserModel = require('../models/UserModel');
const SubjectModel = require('../models/SubjectModel');
const StudentSubjectModel = require('../models/StudentSubjectModel');
const ScheduleModel = require('../models/ScheduleModel');

const checkIsProfessorMiddleware = require('../middlewares/checkIsProfessorMiddleware');
const checkIsStudentMiddleware = require('../middlewares/checkIsStudentMiddleware');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');

router.post('/studentSubject', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {

        const { student, subject } = req.body;

        const studentId = await UserModel.findOne({ _id: student, rol: 'student' });

        if (!studentId) {
            return res.json({
                code: '5001',
                msg: 'Student not exist',
                data: null
            });
        }

        const subjectId = await SubjectModel.findOne({_id:subject});
        if (!subjectId) {
            return res.json({
                code: '5002',
                msg: 'Subject not exist',
                data: null
            });
        }

        if(req.user._id != subjectId.professor){
            return res.json({
                code: '5011',
                msg: 'The subject is not belong to this professor',
                data: null
            });
        }

        const enrollment = await StudentSubjectModel.findOne({ student, subject });
        if (enrollment) {
            return res.json({
                code: '5003',
                msg: 'Student is already enrolled in this subject',
                data: null
            });
        }

        const enrolledStudentsCount = await StudentSubjectModel.countDocuments({ subject });
        if (enrolledStudentsCount >= subjectId.capacity) {
            return res.json({
                code: '5004',
                msg: 'Subject has no more capacity',
                data: null
            });
        }

        await StudentSubjectModel.create({ student, subject });
        res.json({
            code: '0000',
            msg: 'Student enrolled successfully',
            data: null
        });
    } catch (err) {
        console.log(err);
        res.json({
            code: '5005',
            msg: 'Subject enrollment failed, please try again later',
            data: null
        });
    }
});

router.get('/subject/student', checkTokenMiddleware, checkIsStudentMiddleware, async (req, res) => {
    try {
        const studentId = req.user._id;

        const studentSubjects = await StudentSubjectModel.find({student: studentId}).populate('subject');

        if (studentSubjects.length > 0) {
            res.json({
                code: '0000',
                msg: 'Successfully retrieved the subject',
                data: studentSubjects.map(course => course.subject)
            });
        } else {
            return res.json({
                code: '5006',
                msg: 'No Subjects found for this student',
                data: studentSubjects
            });
        }
    } catch (err) {
        console.log(err)
        res.json({
            code: '5007',
            msg: 'Error while fetching the subject',
            data: null
        });
    }
});

router.delete('/studentSubject/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
    try {
      const studentSubject = await StudentSubjectModel.findOne({_id: req.params.id});
      if (!studentSubject) {
        return res.json({
          code: '5008',
          msg: 'The student is not enrolled in this subject',
          data: null
        });
      }

      const subject = await SubjectModel.findById(studentSubject.subject);
      if(subject.professor != req.user._id){
        return res.json({
            code: '5010',
            msg: 'No permission, this course does not belong to this professor',
            data: null
        });
      }

      await StudentSubjectModel.deleteOne({_id: req.params.id});

      await ScheduleModel.deleteMany({subject:studentSubject.subject, student:studentSubject.student});

      res.json({
        code: '0000',
        msg: 'deleted successfully',
        data: studentSubject
      });
    } catch (err) {
      console.log(err)
      res.json({
        code: '5009',
        msg: 'Error while deleting',
        data: null
      });
    }
});

module.exports = router;