import React from 'react'
import '../../RoomSetting/Footer/Footer.scss'
import { Link } from 'react-router-dom'
import Button from '../../UI/Button'
import PropTypes from 'prop-types'
import '../../UI/ButtonBorder/Button.scss'
import SaveSettingCheckSuccess from '../../UI/SaveSettingCheckSuccess'

const Footer = (props) => {

  const getClassNames = () => {
    let CSSClass = ''
    if (props.className) {
      CSSClass += `${props.className} `
    }
    if (props.webinar) {
      CSSClass += 'setting_menu_common_buttons_webinar'
    } else {
      CSSClass += 'setting_menu_common_buttons'
    }

    return CSSClass
  }

  return (
    <div className={getClassNames()}>
      {props.hideSaveButton !== true ?
        <>
          <Button
            type={props.type}
            size={props.webinar ? 'small' : 'medium'}
            onClick={props.saveSetting}
            disabled={props.disabledSaveButton}
            label={props.text.saveBtn}
          />
          <SaveSettingCheckSuccess delay={3100} saveSuccess={props.saveSuccess} />
        </>
        : null}
      <Link style={{ textDecoration: 'none' }} to="/rooms" className={`btn_ui_border btn_ui_border_medium btn_ui_border_blue ${''}`}>
        <span>
          {props.text.cancelBtn}
        </span>
      </Link>
    </div>
  )
}

Footer.defaultProps = {
  className: ''
}

Footer.propTypes = {
  className: PropTypes.string,
  hideSaveButton: PropTypes.bool,
  webinar: PropTypes.bool.isRequired,
  saveSetting: PropTypes.func,
  disabledSaveButton: PropTypes.bool,
  text: PropTypes.shape({
    saveBtn: PropTypes.string,
    cancelBtn: PropTypes.string
  }),
  rollUp: PropTypes.func,
  type: PropTypes.string,
  saveSuccess: PropTypes.bool.isRequired
}

export default Footer
