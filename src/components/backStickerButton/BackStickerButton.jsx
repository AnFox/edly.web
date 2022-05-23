import React from 'react'
import './backStickerButton.scss'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const BackStickerButton = (props) => {

  return <Link className="back_sticker_button" to={props.to}>
    {props.children}
  </Link>
}

BackStickerButton.propTypes = {
  children: PropTypes.node,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
}

export default BackStickerButton
