import React, { useState, useEffect, useCallback } from 'react'
import './WebinarStatus.scss'
import { Flag, Calendar, Play } from '../UI/Icons/Icons'
import PropTypes from 'prop-types'
import { msToTime } from "../../utils/msToTime"
import { WebinarType } from '../../dict/webinar'

const text = {
  statusWebinar: {
    finished: 'Завершен',
    planned: 'Запланирован',
    online: 'Идет'
  }
}

let timer = null

const WebinarStatus = (props) => {
  const { webinar } = props

  const [date, setDate] = useState({ days: 0, hours: 0, minutes: 0 })

  const refreshDate = useCallback(() => {
    const result = msToTime(new Date() - new Date(webinar.starts_at))
    setDate({
      days: result.days,
      hours: result.hours,
      minutes: result.minutes
    })
  }, [webinar.starts_at])

  useEffect(() => {
    const result = msToTime(new Date() - new Date(webinar.starts_at))
    setDate({
      days: result.days,
      hours: result.hours,
      minutes: result.minutes
    })
    if (new Date(webinar.starts_at) < new Date() && !webinar.finished_at) {
      timer = setInterval(refreshDate, 60000)
    }
    return () => clearInterval(timer)
  }, [webinar.finished_at, webinar.starts_at, refreshDate])

  const getWebinarStatus = () => {
    if (webinar.finished_at) {
      return {
        status: 'finished',
        date: new Date(webinar.finished_at).toLocaleDateString()
      }
    }
    if (new Date(webinar.starts_at) > new Date() || (new Date(webinar.starts_at) < new Date() && !webinar.is_started && (webinar.type_id === WebinarType.LIVE || props.typeId === WebinarType.LIVE))) {
      const date = new Date(webinar.starts_at)
      return {
        status: 'planned',
        date: `${date.toLocaleDateString()} - ${date.toLocaleTimeString().substr(0, 5)}`
      }
    }
    if (new Date(webinar.starts_at) < new Date()) {
      return {
        status: 'online'
      }
    } else {
      return {
        status: 'null'
      }
    }
  }

  const res = getWebinarStatus()

  return (
    <div className={`webinar_status ${res.status === 'finished' ? 'yellow' : res.status === 'planned' ? 'blue' : res.status === 'online' ? 'green' : ''}`}>
      {res.status === 'finished' ? (<><Flag className="icon" /><span>{text.statusWebinar?.finished}: {res.date}</span></>) : null}
      {res.status === 'planned' ? (<><Calendar className="icon" /><span>{text.statusWebinar?.planned}: {res.date}</span></>) : null}
      {res.status === 'online' ? (<><Play className="icon" /><span>{text.statusWebinar?.online}: {date.day ? `${date.day} д.` : ''} {date.hours} ч. {date.minutes} мин.</span></>) : null}
    </div>
  )
}

WebinarStatus.propTypes = {
  webinar: PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    finished_at: PropTypes.string,
    is_started: PropTypes.bool.isRequired,
    type_id: PropTypes.number
  }).isRequired,
  typeId: PropTypes.number
}

export default WebinarStatus
