const mongoose = require('mongoose');

let ClassroomSchema = new mongoose.Schema({

    classroomName:{
        type: String,
        required: true,
        unique: true
    },
    studentCapacity:{
        type: Number,
        required:true
    }


});

let ClassroomModel = mongoose.model('classrooms', ClassroomSchema);

module.exports = ClassroomModel;