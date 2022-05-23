import React from 'react'
import './Emoji.scss'
import Picker from "emoji-picker-react"
import PropTypes from "prop-types"

const Emoji = (props) => {
  Emoji.propTypes = {
    onSelect: PropTypes.func.isRequired,
  }

  const onEmojiClick = (event, emojiObject) => {
    props.onSelect(emojiObject.emoji)
  }

  return (
    <div className="emoji_main">
      <Picker onEmojiClick={onEmojiClick}/>
    </div>

  )
}

export default Emoji
