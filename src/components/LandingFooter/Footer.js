import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.scss'

const Footer = () => {

  return(
    <header className="landing_footer">
      <div className="landing_footer_content">
        <div className="landing_footer_link">
          <Link to="/" className="landing_footer_label">Оферта</Link>
          <Link to="/privacy" className="landing_footer_label">Политика конфиденциальности</Link>
        </div>

        <div className="landing_footer_label">(c) <span style={{ color: '#3366FF' }}>EDLY</span> 2020. Все права защищены</div>
      </div>
      <div className="landing_footer_background" />
    </header>
  )
}

export default Footer
