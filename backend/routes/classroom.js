var express = require('express');
var router = express.Router();
const ClassroomModel = require('../models/ClassroomModel');
const ScheduleModel = require('../models/ScheduleModel');
const TimetableModel = require('../models/TimetableModel');

const checkIsProfessorMiddleware = require('../middlewares/checkIsProfessorMiddleware');
const checkIsNotStudentMiddleware = require('../middlewares/checkIsNotStudentMiddleware');
const checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');

router.post('/classroom', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
  const classroomInfo = req.body

  const existingClassroom = await ClassroomModel.findOne({classroomName:classroomInfo.classroomName });
  if (existingClassroom) {
    return res.json({
      code: '3007',
      msg: 'Classroom already exists',
      data: null
    });
  }

  try {
    const classroom = await ClassroomModel.create({ ...classroomInfo })
    res.json({
      code: '0000',
      msg: 'creation success',
      data: classroom
    });
  } catch(err){
    console.log(err)
    res.json({
      code: '3001',
      msg: 'Creation failed, please try again later',
      data: null
    });
  }
});

router.get('/classroom', checkTokenMiddleware, checkIsNotStudentMiddleware,async (req, res) => {
  try {
    const classrooms = await ClassroomModel.find({});
    res.json({
      code: '0000',
      msg: 'Successfully retrieved all classrooms',
      data: classrooms
    });
  } catch (err) {
    console.log(err)
    res.json({
      code: '3002',
      msg: 'Error while fetching classrooms',
      data: null
    });
  }
});

router.get('/classroom/:id', checkTokenMiddleware, checkIsNotStudentMiddleware, async (req, res) => {
  try {
    const classroom = await ClassroomModel.findById(req.params.id);
    if (!classroom) {
      return res.json({
        code: '3003',
        msg: 'Classroom not found',
        data: null
      });
    }
    res.json({
      code: '0000',
      msg: 'Successfully retrieved the classroom',
      data: classroom
    });
  } catch (err) {
    console.log(err)
    res.json({
      code: '3004',
      msg: 'Error while fetching the classroom',
      data: null
    });
  }
});

router.delete('/classroom/:id', checkTokenMiddleware, checkIsProfessorMiddleware, async (req, res) => {
  try {
    const classroom = await ClassroomModel.findByIdAndDelete(req.params.id);
    if (!classroom) {
      return res.json({
        code: '3005',
        msg: 'Classroom not found',
        data: null
      });
    }

    await ScheduleModel.deleteMany({classroom: req.params.id});
    await TimetableModel.deleteMany({classroom: req.params.id});

    res.json({
      code: '0000',
      msg: 'Classroom deleted successfully',
      data: classroom
    });
  } catch (err) {
    console.log(err)
    res.json({
      code: '3006',
      msg: 'Error while deleting classroom',
      data: null
    });
  }
});


module.exports = router;