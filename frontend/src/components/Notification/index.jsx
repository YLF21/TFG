import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

export default function Notification ({ message, color, autoDismiss = false, router }) {

  const [showNotification, setShowNotification] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        navigate(router)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoDismiss, router, navigate])

  if (!showNotification) return null

  return (
    <div className="notification-bar">
      <div className={`notification ${color}`}>
        {message}
      </div>
    </div>
  );
}



