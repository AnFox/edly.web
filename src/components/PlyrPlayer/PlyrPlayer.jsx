import React, { useEffect, useRef, useState } from 'react'
import Plyr from 'plyr'
import 'plyr/src/sass/plyr.scss'
import PropTypes from 'prop-types'
import './PlyrPlayer.scss'
import platform from 'platform'
import Button from '../UI/Button'
import { MediaPlay } from '../UI/Icons/Icons'

// plyr - https://www.npmjs.com/package/plyr#demos

const YouTubeCodeDetail = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5
}


const PlyrPlayer = (props) => {
  const player = useRef({})
  const [showButtonStart, setShowButtonStart] = useState(false)
  const { forward, config, hideControl, videoId, overlay, dateStartVideo } = props

  const isEmpty = (object) => {
    return Object.keys(object).length === 0
  }

  useEffect(() => {
    const onReady = (e) => {
      if (forward) {
        player.current.forward(forward)
      }
      if (props.onReady) {
        props.onReady(e)
      }

      if ((platform.os.family.includes('iOS') || platform.os.family.includes('Android')) &&
        (player.current.autoplay)) {
        player.current.autoplay = false

        setShowButtonStart(true)
      }
      if (hideControl) {
        // I'm not sure it won't come in handy yet
        // const doc = document.querySelector('.plyr__controls')
        // const button = document.querySelector('.plyr__control--overlaid')
        // doc.remove()
        // button.remove()
      }
    }

    const onStateChange = (e) => {
      if (e.detail.code === YouTubeCodeDetail.UNSTARTED) {
        setShowButtonStart(true)
      } else {
        setShowButtonStart(false)
      }
    }

    if (isEmpty(player.current) && videoId) {
      player.current = new Plyr('#plyr-player')
      player.current.on('ready', onReady)
      player.current.on('statechange', onStateChange)
      player.current.on('error', (error) => console.log(error))
    }
  }, [forward, hideControl, videoId, props])

  useEffect(() => {
    return () =>
    {
      if (!isEmpty(player.current) && player.current.destroy) {
        player.current.destroy()
        player.current = {}
      }
    }
  }, [])

  const play = () => {
    setShowButtonStart(false)
    if (dateStartVideo) {
      player.current.currentTime = (new Date() - new Date(dateStartVideo)) / 1000
    }
    player.current.play()
  }

  return (
    <div className={`video_player_ui ${props.className}`}>
      {overlay && <div className="video_player_ui_overlay" />}
      {showButtonStart && <Button
        className="video_player_ui_play_button"
        color="green"
        size="medium"
        onClick={play}
      >
        <MediaPlay/>
      </Button>
      }
      <div
        className={`plyr__video-embed `} data-plyr-provider="youtube" id="plyr-player"
        data-plyr-config={JSON.stringify(config)}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          allowtransparency="true"
        />
      </div>
    </div>
  )
}

PlyrPlayer.defaultProps = {
  className: ''
}

PlyrPlayer.propTypes = {
  className: PropTypes.string,
  videoId: PropTypes.string,
  videoSrc: PropTypes.string,
  forward: PropTypes.number,
  hideControl: PropTypes.bool,
  config: PropTypes.object,
  onReady: PropTypes.func,
  overlay: PropTypes.bool,
  dateStartVideo: PropTypes.instanceOf(Date)
}

export default PlyrPlayer
