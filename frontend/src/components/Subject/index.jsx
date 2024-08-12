import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { FaTrashAlt } from "react-icons/fa"
import './index.css'

export default function SubjectItem({ acronym, subjectName, _id, onDelete }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const rol = localStorage.getItem('rol')

  const handleMouseEnter = () => {
    if(rol==='professor'){
      setShowSettings(true)
    }
  };

  const handleMouseLeave = () => {
    setShowSettings(false)
    setShowDelete(false)
  };

  const handleSettingsClick = () => {
    setShowDelete(!showDelete)
  };

  return (
    <div className="card-container d-flex align-items-center justify-content-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Card className="mb-3">
        <div className="position-relative">
          <NavLink to={`/subject/${rol}/${_id}`} className='subject-link'>
            <div className="placeholder-image">
              {acronym}
            </div>
          </NavLink>
          {showSettings && (
            <div className="settings-container">
              <button className="btn btn-sm btn-secondary settings-button" onClick={handleSettingsClick}>⚙️</button>
              {showDelete && (
                <button className="btn btn-sm btn-danger delete-button" onClick={() => onDelete(_id)}><FaTrashAlt/></button>
              )}
            </div>
          )}
        </div>
        <Card.Body>
          <NavLink to={`/subject/${rol}/${_id}`} title={subjectName} className='subject-link'>
            <Card.Title className='subject-title'>{subjectName}</Card.Title>
          </NavLink>
        </Card.Body>
      </Card>
    </div>
  );
}
