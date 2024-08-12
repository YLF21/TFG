import React, { Component } from 'react';

export default class index extends Component {
  render() {
    const { startTime, endTime, dayOfWeek, classroom } = this.props;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    const timezoneOffset = startDate.getTimezoneOffset() - new Date().getTimezoneOffset();
    
    startDate.setMinutes(startDate.getMinutes() - timezoneOffset);
    endDate.setMinutes(endDate.getMinutes() - timezoneOffset);
    
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();
    const endHour = endDate.getHours();
    const endMinute = endDate.getMinutes();

    const formattedStartTime = `${startHour < 10 ? '0' : ''}${startHour}:${startMinute < 10 ? '0' : ''}${startMinute}`;
    const formattedEndTime = `${endHour < 10 ? '0' : ''}${endHour}:${endMinute < 10 ? '0' : ''}${endMinute}`;

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const dayName = daysOfWeek[dayOfWeek - 1];

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Day of Week: {dayName}</h5>
          <p className="card-text">Start Time: {formattedStartTime}</p>
          <p className="card-text">End Time: {formattedEndTime}</p>
          <p className="card-text">Classroom: {classroom.classroomName}</p>
        </div>
      </div>
    );
  }
}

