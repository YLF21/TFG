var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const authRouter = require('./routes/auth');
const classroomRouter = require('./routes/classroom');
const subjectRouter = require('./routes/subject');
const userRouter = require('./routes/user');
const studentSubjectRouter = require('./routes/studentSubject');
const timetableRouter = require('./routes/timetable');
const scheduleRouter = require('./routes/schedule');

app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', studentSubjectRouter);
app.use('/', scheduleRouter);
app.use('/', timetableRouter);
app.use('/', classroomRouter);
app.use('/', subjectRouter);

module.exports = app;
