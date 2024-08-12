import React from 'react';
import { useParams } from 'react-router-dom';
import SubjectDetail from '../../components/SubjectDetail';

export default function SubjectDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <SubjectDetail id={id} />
    </div>
  );
}