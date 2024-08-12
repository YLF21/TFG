import React from 'react'
import { useParams } from 'react-router-dom'
import ClassroomTimetable from '../../components/ClassroomTimetable'

export default function ClassroomTimetablePage() {
    const { id } = useParams();
    return (
      <div>
        <ClassroomTimetable id={id} />
      </div>
    );
    
  }
