import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { FaTrashAlt } from "react-icons/fa"
import './index.css'

export default function Classroom({ _id, classroomName, onDelete }) {
  const [showSettings, setShowSettings] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const rol = localStorage.getItem('rol')

  const handleMouseEnter = () => {
    if(rol==='professor'){
      setShowSettings(true)
    }
  };

  const handleMouseLeave = () => {
    setShowSettings(false);
    setShowDelete(false);
  };

  const handleSettingsClick = () => {
    setShowDelete(!showDelete);
  };

  return (
    <div className="classroom-card-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Card className="classroom-card">
        <div className="position-relative">
          <NavLink to={`/timetable/classroom/${_id}`} className="classroom-link">
            <div className="classroom-placeholder">
              {classroomName.charAt(0).toUpperCase()}
            </div>
          </NavLink>
          {showSettings && (
            <div className="settings-container">
              <button className="btn btn-sm btn-secondary settings-button" onClick={handleSettingsClick}>⚙️</button>
              {showDelete && (
                <button className="btn btn-sm btn-danger delete-button" onClick={() => onDelete(_id)}><FaTrashAlt /></button>
              )}
            </div>
          )}
        </div>
        <Card.Body className="classroom-card-body">
          <NavLink to={`/timetable/classroom/${_id}`} className="classroom-link">
            <Card.Title className="classroom-title">{classroomName}</Card.Title>
          </NavLink>
        </Card.Body>
      </Card>
    </div>
  )
}
