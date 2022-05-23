import { WebinarType } from '../dict/webinar'

export default function webinarIsStarted (webinar) {
  if (webinar.type_id === WebinarType.LIVE && webinar.is_started && !webinar.finished_at) {
    return true
  }
  if ((webinar.type_id === WebinarType.AUTO) && (new Date(webinar.starts_at) <= new Date()) && !webinar.finished_at) {
    return true
  }

  return false


}
