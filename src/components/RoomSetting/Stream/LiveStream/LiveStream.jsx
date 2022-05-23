import React from 'react'
import PropTypes from 'prop-types'
import './LiveStream.scss'
import RadioButton from '../../../UI/RadioButton'
import CheckBox from '../../../UI/CheckBox'
import Input from '../../../UI/Input'

const LiveStream = (props) => {
  // const createStream = () => {
  //   window.open('https://www.youtube.com/live_dashboard_splash?next_url=https%3A%2F%2Fwww.youtube.com%2Flivestreaming%2F&nv=1', '_blank')
  // }

  // const myStreamOnYouTube = () => {
  //   window.open('https://www.youtube.com/feed/my_videos', '_blank')
  // }
  return (
    <>
      <div className={props.isWebinar ? 'setting_label webinar_setting_label' : 'setting_label'}>Тип трансляции</div>
      <div className="setting_stream_checkbox">
        <RadioButton
          label="YouTube"
          controll={true}
          onSelect={() => props.setFieldValue('videoSrcType', 'YouTube')}
          selected={props.values.videoSrcType === 'YouTube'}
        />
      </div>
      {/*<div className={props.isWebinar ? 'webinar_setting_stream_buttons' : 'setting_stream_buttons'}>*/}
      {/*  {props.values.videoSrcType === 'YouTube' ? (<>*/}
      {/*    <ButtonBorder onClick={createStream} size={props.isWebinar ? 'small' : 'medium'} color="blue" label="Создать трансляцию" />*/}
      {/*    <ButtonBorder onClick={myStreamOnYouTube} size={props.isWebinar ? 'small' : 'medium'} color="blue" label="Мои трансляции на YouTube" />*/}
      {/*  </>) : null}*/}
      {/*</div>*/}
      <Input
        title={true}
        value={props.values.videoSrc}
        onChange={(e) => props.setFieldValue('videoSrc', e.target.value)}
        titleText="URL-адрес видео на YouTube:"
        placeholder="https://..."
        className={`${props.isWebinar ? 'setting_webinar_input' : ''}`}
        classNameInput={props.isWebinar ? 'webinar_setting_stream_input_url' : 'setting_stream_input_url'}
        showError={true}
        colorMessage="blue"
        errorText={'Пример ссылки: http://youtube.com/embed/xc5w_4A88KY'}
      />
      <CheckBox
        className="setting_stream_checkbox_record"
        checked={props.values.requestRecord}
        label={'Запрашивать разрешение на запись сценария при запуске вебинара'}
        onCheck={() => props.setFieldValue('requestRecord', !props.values.requestRecord)}
      />
    </>
  )
}

LiveStream.propTypes = {
  isWebinar: PropTypes.bool,
  values: PropTypes.shape({
    videoSrc: PropTypes.string,
    videoSrcType: PropTypes.string,
    requestRecord: PropTypes.bool
  }),
  setFieldValue: PropTypes.func.isRequired
}

export default LiveStream
