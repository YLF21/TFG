import React from 'react';
import { useParams } from 'react-router-dom';
import SubjectStudentDetail from '../../components/SubjectStudentDetail';

export default function SubjectDetailStudentPage() {
  const { id } = useParams();
  return (
    <div>
      <SubjectStudentDetail id={id}/>
    </div>
  );
}
