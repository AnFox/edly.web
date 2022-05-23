import React, { useEffect, useState } from 'react'
import './WebinarStatusInRooms.scss'
import { Flag, Camera, Play, Robot } from '../UI/Icons/Icons'
import PropTypes from 'prop-types'
import { msToTime } from "../../utils/msToTime"
import { WebinarType } from '../../dict/webinar'

const text = {
  statusWebinar: {
    finished: 'Завершен',
    planned: 'Ближайший вебинар',
    plannedAuto: 'Ближайший автовебинар',
    online: 'Вебинар идет',
    onlineAuto: 'Автовебинар идет'
  }
}

let timer = null

const WebinarStatusInRooms = (props) => {
  const { webinars, typeId } = props
  const [date, setDate] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })

  const refreshDate = (timer, dateStart) => {
    const result = msToTime(new Date() - new Date(dateStart))
    setDate({
      days: result.days,
      hours: result.hours,
      minutes: result.minutes,
      seconds: result.seconds,
      milliseconds: result.milliseconds
    })
  }
  useEffect(() => {
    return () => clearInterval(timer)
  }, [])

  const getWebinarsStatus = () => {

    if (webinars && webinars.length) {
      const isOnline = webinars.find(webinar => {
        return (new Date(webinar.starts_at) < new Date() && !webinar.finished_at && typeId === WebinarType.AUTO) ||
          (webinar.is_started && !webinar.finished_at && typeId === WebinarType.LIVE)
      })

      if (isOnline) {
        const dateStart = new Date(isOnline.starts_at)
        if (!(date.days || date.hours || date.minutes || date.seconds || date.milliseconds)) {
          const result = msToTime(new Date() - new Date(dateStart))
          setDate({
            days: result.days,
            hours: result.hours,
            minutes: result.minutes,
            seconds: result.seconds,
            milliseconds: result.milliseconds
          })
        }
        timer = setInterval(() => refreshDate(timer, dateStart), 60000)
        return {
          status: 'online',
          date: `${dateStart.toLocaleDateString()} - ${dateStart.toLocaleTimeString().substr(0, 5)}`,
          typeId: typeId
        }
      } else {
        const plannedWebinars = webinars.filter((webinar => (
          new Date(webinar.starts_at) > new Date()) ||
          (new Date(webinar.starts_at) < new Date() && !webinar.finished_at && typeId === WebinarType.LIVE))
        )
        if (plannedWebinars) {
          const plannedWebinar = plannedWebinars.length < 2 ? plannedWebinars[0] : plannedWebinars.find(webinar => {
            const index = plannedWebinars.findIndex(web => web.id === webinar.id)
            const otherWebinars = [...plannedWebinars]
            otherWebinars.splice(index, 1)
            if (new Date(webinar.starts_at) < new Date() &&
              otherWebinars.some(web => new Date(web.starts_at) < new Date(webinar.starts_at))) {
              return true
            }
            return new Date(webinar.starts_at) > new Date() &&
              otherWebinars.some(web => new Date(web.starts_at) > new Date(webinar.starts_at))

          })
          if (plannedWebinar) {
            const dateStart = new Date(plannedWebinar.starts_at)
            return {
              status: 'planned',
              date: `${dateStart.toLocaleDateString()} - ${dateStart.toLocaleTimeString().substr(0, 5)}`,
              typeId: typeId
            }
          }
        }
      }
      return {
        status: 'null'
      }
    } else {
      return {
        status: 'null'
      }
    }
  }

  const res = getWebinarsStatus()

  const getWebinarStatusPlanned = () => {
    switch (res.typeId) {
    case WebinarType.LIVE:
      return <><Camera className="icon" /><span>{text.statusWebinar?.planned}: {res.date}</span></>
    case WebinarType.AUTO:
      return <><Robot className="icon" /><span>{text.statusWebinar?.plannedAuto}: {res.date}</span></>
    default:
      return <><Camera className="icon" /><span>{text.statusWebinar?.planned}: {res.date}</span></>
    }
  }

  const getWebinarStatusOnline = () => {
    switch (res.typeId) {
    case WebinarType.LIVE:
      return <><Play className="icon" /><span>{text.statusWebinar?.online}: {date.days ? `${date.days} д.` : ''} {date.hours} ч. {date.minutes} мин.</span></>
    case WebinarType.AUTO:
      return <><Play className="icon" /><span>{text.statusWebinar?.onlineAuto}: {date.days ? `${date.days} д.` : ''} {date.hours} ч. {date.minutes} мин.</span></>
    default:
      return <><Play className="icon" /><span>{text.statusWebinar?.online}: {date.days ? `${date.days} д.` : ''} {date.hours} ч. {date.minutes} мин.</span></>
    }
  }

  return (
    <div className={`room_status ${res.status === 'finished' ? 'yellow' : res.status === 'planned' ? 'blue' : res.status === 'online' ? 'green' : ''}`}>
      {res.status === 'finished' ? (<><Flag className="icon" /><span>{text.statusWebinar?.finished}: {res.date}</span></>) : null}
      {res.status === 'planned' ? getWebinarStatusPlanned() : null}
      {res.status === 'online' ? getWebinarStatusOnline() : null}
    </div>
  )
}

WebinarStatusInRooms.propTypes = {
  webinars: PropTypes.arrayOf(PropTypes.shape({
    starts_at: PropTypes.string.isRequired,
    finished_at: PropTypes.string
  })),
  typeId: PropTypes.number.isRequired
}

export default WebinarStatusInRooms
