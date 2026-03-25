// component/loader/Loader.js
import React from 'react'
import './style.css'

const Loader = ({ size = '3.8rem', color = '#16AFF6', speed = '0.9s' }) => {
  // Custom style object for dynamic CSS variables
  const spinnerStyle = {
    '--size': size,
    '--speed': speed,
    '--color': color,
  };

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ height: size, width: size }}
    >
      <div className="dot-spinner" style={spinnerStyle}>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    </div>
  )
}

export default Loader
