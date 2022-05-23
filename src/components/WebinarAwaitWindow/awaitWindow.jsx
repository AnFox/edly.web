import React, { useCallback, useEffect, useState } from 'react'
import BackgroundImage from '../../assets/img/Image_16.jpeg'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import webinarIsStarted from '../../utils/webinarIsStarted'
import { msToTime } from '../../utils/msToTime'
import { WebinarType } from '../../dict/webinar'

const AwaitWindow = (props) => {
  const [timeToStart, setTimeToStart] = useState({})
  const webinar = useSelector(state => state.app.webinar[props.webinarId])

  const timerOnStart = useCallback((timer) => {
    const ms = Date.parse(webinar.starts_at || new Date()) - new Date()
    const resultDate = msToTime(ms)
    const result = { days: resultDate.days, hours: resultDate.hours, minutes: resultDate.minutes, seconds: resultDate.seconds }

    setTimeToStart(result)
    if (ms <= 0) {
      clearInterval(timer)
      if (webinarIsStarted(webinar)) {
        props.setStream(true)
      } else {
        props.setStream(false)
      }
    }
  }, [props, webinar])

  useEffect(() => {
    const timer = setInterval(() => timerOnStart(timer), 1000)
    return () => clearInterval(timer)
  }, [props, webinar, timerOnStart])

  const getBackgroundImage = () => {
    return webinar.thumbnail || BackgroundImage
  }

  function getCountDownText () {
    return new Date(webinar.starts_at) > new Date() && (
      <div className="player_container_description">
        Начало трансляции через <strong>
          {(timeToStart.days && timeToStart.days > 0)
            ? `${timeToStart.days} д. `
            : ''}
          {timeToStart.hours < 10
            ? `0${timeToStart.hours}`
            : timeToStart.hours}
        :
          {timeToStart.minutes < 10
            ? `0${timeToStart.minutes}`
            : timeToStart.minutes}
        :
          {timeToStart.seconds < 10
            ? `0${timeToStart.seconds}`
            : timeToStart.seconds}
        </strong>
      </div>
    )
  }

  const getTitle = () => {
    if ((new Date(webinar.starts_at) > new Date() || (webinar.type_id === WebinarType.LIVE && !webinar.is_started)) && (!webinar.finished_at)) {
      return webinar.waiting_text || 'Вебинар скоро начнется'
    }
    if (webinar.finished_at && new Date(webinar.finished_at.toString()) < new Date()) {
      return webinar.post_webinar_text || 'Вебинар завершен'
    }
  }

  return (
    <div className="player_container_flex"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}>
      <div className="player_container_panel">
        <div className="player_container_title">{getTitle()}</div>
        {getCountDownText()}
      </div>
    </div>
  )
}

AwaitWindow.propTypes = {
  setStream: PropTypes.func.isRequired,
  webinarId: PropTypes.number.isRequired
}

export default AwaitWindow
