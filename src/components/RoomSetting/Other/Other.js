import React, { useState, useMemo, useEffect } from 'react'
import './Other.scss'
import { roomSetCover, roomUnsetCover } from '../../../lib/admin/rooms/actions'
import Footer from '../Footer'
import { useDispatch } from 'react-redux'
import '../../UI/Input/input.scss'
import Button from '../../UI/Button'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Other = (props) => {
  const [textLoadImage, setTextLoadImage] = useState('Щелкните, чтобы загрузить')
  const location = useLocation()
  const isWebinarPage = useMemo(() => !location.pathname.includes('edit/room'), [location.pathname])
  const dispatch = useDispatch()

  const loadImage = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]
    if (!file) {
      return
    }
    if (file.size > 1024 * 1024 * 20) {
      setTextLoadImage('Превышен размер файла')
      return
    }
    if ((file.type === 'image/jpeg') || (file.type === 'image/jpg') || (file.type === 'image/png')) {
      reader.onloadend = () => {
        setTextLoadImage(file.name)
        dispatch(roomSetCover(props.roomState.id, file))
      }
    } else {
      setTextLoadImage('Неверный формат файла')
    }

    reader.readAsText(file)
  }

  const clearImg = () => {
    setTextLoadImage('Щелкните, чтобы загрузить')
    dispatch(roomUnsetCover(props.roomState.id))
  }

  const formik = useFormik({
    initialValues: {
      waitingText: '',
      postWebinarText: ''
    },
    validationSchema: Yup.object({
      waitingText: Yup.string(),
      postWebinarText: Yup.string()
    }),
    onSubmit: values => {
      props.saveOtherSetting(values)
    }
  })

  useEffect(() => {
    formik.setValues({
      waitingText: props.roomState.waiting_text || '',
      postWebinarText: props.roomState.post_webinar_text || ''
    })
  }, [props.roomState.post_webinar_text, props.roomState.waiting_text])

  return (
    <div className={isWebinarPage? 'setting_webinar_padding setting_webinar_other' : 'setting_padding setting_other'}>
      <form onSubmit={formik.handleSubmit}>
        <div className={`load_file_box ${isWebinarPage ? 'webinar_setting_load_file_box webinar_setting_load_file_img' : 'setting_load_file_box setting_load_file_img'}`}>
          <div className="input_ui_main">
            <div className="input_ui_title">Изображение</div>
            <input style={{ display: 'none' }} type="file" id="load_image" accept="image/png,image/jpeg,image/jpg" onChange={loadImage} />
            <div className="load_file load_fon_banner" onClick={() => document.getElementById('load_image').click()}>
              {textLoadImage} &nbsp;
              <div style={{ backgroundImage: `url(${props.roomState.thumbnail}` }} className="fon_icon" />
            </div>
            <div className="input_ui_message input_ui_message_blue">Будет показано до и после стрима вместо стандартного (минимальная ширина 1250 px)</div>
          </div>
          <Button color="red" size={isWebinarPage ? 'small' : 'medium'} label="Убрать" onClick={clearImg} />
        </div>
        <div className="setting_other_webinar_text">
          <div className={`input_ui_main ${isWebinarPage ? 'setting_webinar_input' : ''}`}>
            <div className="input_ui_title">Текст поверх изображения <span>(начало вебинара)</span></div>
            <div>
              <input
                name={'waitingText'}
                className={`input_ui_input ${ isWebinarPage ? 'webinar_setting_other_input' : 'setting_other_input' }`}
                value={formik.values.waitingText}
                placeholder="Вебинар скоро начнётся"
                onChange={formik.handleChange}
              />
            </div>
            <div className='input_ui_message input_ui_message_blue'>{'Оставьте поле пустым для отображения стандартного текста'}</div>
          </div>
          <div className={`input_ui_main ${isWebinarPage ? 'setting_webinar_input' : ''}`}>
            <div className="input_ui_title">Текст поверх изображения <span>(конец вебинара)</span></div>
            <div>
              <input
                name={'postWebinarText'}
                className={`input_ui_input ${ isWebinarPage ? 'webinar_setting_other_input' : 'setting_other_input' }`}
                value={formik.values.postWebinarText}
                onChange={formik.handleChange}
                placeholder="Вебинар завершён"
              />
            </div>
            <div className='input_ui_message input_ui_message_blue'>{'Оставьте поле пустым для отображения стандартного текста'}</div>
          </div>
        </div>
        <Footer rollUp={props.rollUp} type="submit" saveSetting={null} saveSuccess={props.saveSuccess} webinar={isWebinarPage} text={props.text}/>
      </form>
    </div>
  )
}

Other.propTypes = {
  rollUp: PropTypes.func,
  saveOtherSetting: PropTypes.func.isRequired,
  text: PropTypes.object.isRequired,
  saveSuccess: PropTypes.bool,
  roomState: PropTypes.shape({
    id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
    waiting_text: PropTypes.string,
    post_webinar_text: PropTypes.string
  })
}

export default Other
