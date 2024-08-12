var express = require('express');
var router = express.Router();
const TimetableModel = require('../models/TimetableModel');
const ScheduleModel = require('../models/ScheduleModel');
const StudentSubjectModel = require('../models/StudentSubjectModel');
const SubjectModel = require('../models/SubjectModel');

const checkIsProfessorMiddleware = require('../middlewares/checkIsProfessorMiddleware');
const checkIsNotAdminMiddleware = require('../middlewares/checkIsNotAdminMiddleware');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');

router.post('/subject', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
  const subjectInfo = req.body;

  const existingSubject1 = await SubjectModel.findOne({ subjectName: subjectInfo.subjectName })
  if (existingSubject1) {
    return res.json({
      code: '4007',
      msg: 'Subject already exists',
      data: null
    });
  }

  try {
    const subject = await SubjectModel.create({ ...subjectInfo, professor: req.user._id })
    res.json({
      code: '0000',
      msg: 'Subject creation successful',
      data: subject
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: '4001',
      msg: 'Subject creation failed, please try again later',
      data: null
    });
  }
});

router.get('/subject/professor', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
  try {
    const professorId = req.user._id;

    const subjects = await SubjectModel.find({ professor: professorId });

    if (subjects.length > 0) {
      res.json({
        code: '0000',
        msg: 'Successfully retrieved the subject',
        data: subjects
      });
    } else {
      res.json({
        code: '4004',
        msg: 'No Subjects found for this professor',
        data: subjects
      });
    }
  } catch (err) {
    console.log(err)
    res.json({
      code: '4002',
      msg: 'Error while fetching the subject',
      data: null
    });
  }
});

router.get('/subject', checkTokenMiddleware, checkIsNotAdminMiddleware, async (req, res) => {
  try {
    const subjects = await SubjectModel.find({});
    res.json({
      code: '0000',
      msg: 'Successfully retrieved all subjects',
      data: subjects
    });
  } catch (err) {
    console.log(err)
    res.json({
      code: '4008',
      msg: 'Error while fetching subjects',
      data: null
    });
  }
});

router.get('/subject/:id', checkTokenMiddleware, checkIsNotAdminMiddleware, async (req, res) => {
  try {
    const subject = await SubjectModel.findById(req.params.id);
    if (!subject) {
      return res.json({
        code: '4003',
        msg: 'Subject not found',
        data: null
      });
    }
    res.json({
      code: '0000',
      msg: 'Successfully retrieved the subject',
      data: subject
    });
  } catch (err) {
    console.log(err)
    res.json({
      code: '4009',
      msg: 'Error while fetching the subject',
      data: null
    });
  }
});

router.delete('/subject/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
  try {
    const subject = await SubjectModel.findOne({ _id: req.params.id, professor: req.user._id });
    if (!subject) {
      return res.json({
        code: '4005',
        msg: 'Subject not found or not authorized to delete',
        data: null
      });
    }

    await SubjectModel.deleteOne({ _id: req.params.id });

    await ScheduleModel.deleteMany({ subject: req.params.id });

    await StudentSubjectModel.deleteMany({ subject: req.params.id });

    await TimetableModel.deleteMany({ subject: req.params.id });

    res.json({
      code: '0000',
      msg: 'Subject deleted successfully',
      data: subject
    });
  } catch (err) {
    console.log(err)
    res.json({
      code: '4006',
      msg: 'Error while deleting subject',
      data: null
    });
  }
});

router.patch('/subject/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
  try {

    const { capacity } = req.body;

    if (capacity !== undefined) {

      const enrolledCount = await StudentSubjectModel.countDocuments({ subject: req.params.id });

      if (capacity < enrolledCount) {
        return res.json({
          code: '4012',
          msg: 'New capacity cannot be less than the number of enrolled students',
          data: null
        });
      }
    }

    const updates = req.body;

    delete updates.professor;

    const subject = await SubjectModel.findOneAndUpdate(
      { _id: req.params.id, professor: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.json({
        code: '4010',
        msg: 'Subject not found or not authorized to update',
        data: null
      });
    }

    res.json({
      code: '0000',
      msg: 'Subject updated successfully',
      data: subject
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: '4011',
      msg: 'Error while updating subject',
      data: null
    });
  }
});

module.exports = router;