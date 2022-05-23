import React from 'react'
import './Footer.scss'
import { Link } from 'react-router-dom'
import { ArrowUp } from '../../UI/Icons/Icons'
import Button from '../../UI/Button'
import ButtonBorder from '../../UI/ButtonBorder'
import PropTypes from 'prop-types'
import '../../UI/ButtonBorder/Button.scss'
import SaveSettingCheckSuccess from '../../UI/SaveSettingCheckSuccess'

const Footer = (props) => {

  return (
    <div className={props.webinar ? 'setting_menu_common_buttons_webinar' : 'setting_menu_common_buttons'}>
      {props.hideSaveButton !== true ?
        <>
          <Button
            type={props.type}
            size={props.webinar ? 'small' : 'medium'}
            onClick={props.saveSetting}
            disabled={props.disabledSaveButton}
            label={props.text.save}
          />
          <SaveSettingCheckSuccess delay={3100} saveSuccess={props.saveSuccess} />
        </>
        : null}
      {props.webinar ? (
        <ButtonBorder type="button" size="small" className="btn_roll_up" onClick={props.rollUp} label={props.text.back}>
          <ArrowUp />
        </ButtonBorder>
      ) : (
        <Link style={{ textDecoration: 'none' }} to="/rooms" className={`btn_ui_border btn_ui_border_medium btn_ui_border_blue`}>
          <span>
            {props.text.back}
          </span>
        </Link>
      )}

    </div>
  )
}

Footer.propTypes = {
  hideSaveButton: PropTypes.bool,
  webinar: PropTypes.bool.isRequired,
  saveSetting: PropTypes.func,
  disabledSaveButton: PropTypes.bool,
  text: PropTypes.shape({
    save: PropTypes.string,
    back: PropTypes.string
  }),
  rollUp: PropTypes.func,
  type: PropTypes.string,
  saveSuccess: PropTypes.bool
}

export default Footer
