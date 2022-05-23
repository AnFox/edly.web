import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import PopUp from '../../../UI/PopUp'
import { CheckSecond, Download } from '../../../UI/Icons/Icons'
import Button from '../../../UI/Button'
import ButtonBorder from '../../../UI/ButtonBorder'
import { useDispatch, useSelector } from 'react-redux'
import { addBackground, getBackgrounds } from '../../../../lib/admin/bannerBackgrounds/actions'
import { alertbarShow } from '../../../../lib/app/alertbar/actions'
import { useParams } from 'react-router-dom'

const PopUpAddBackground = (props) => {
  const [selectedBg, setSelectedBg] = useState({})
  const { showPopUp, closePopUp, selectBannerBackground, selectedBannerIndex } = props
  const bannerBackgrounds = useSelector(state => state.admin.bannerBackgrounds)
  const dispatch = useDispatch()
  const params = useParams()

  useEffect(() => {
    dispatch(getBackgrounds(params.roomId))
  }, [dispatch, params.roomId])

  useEffect(() => {
    if (props.banner) {
      setSelectedBg(props.banner.image || props.banner.image_url || '')
    }
  }, [props.banner])

  const loadImage = (e) => {
    e.preventDefault()
    const reader = new FileReader()
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]
    if (!file) {
      return
    }
    if (['image/png','image/jpeg','image/jpg'].includes(file.type)) {
      reader.readAsText(file)
      reader.onloadend = () => {
        dispatch(addBackground(params.roomId, file)).then(res => {
          selectBannerBackground(selectedBannerIndex, { url: res.payload.url })
          closePopUp()
        })

        document.getElementById('load_backgrounds').value = ''
      }
    } else {
      dispatch(alertbarShow({ type: 'error', messages: ['Неверный формат файла'] }))
    }
  }

  const acceptBackground = () => {
    selectBannerBackground(selectedBannerIndex, selectedBg)
    closePopUp()
  }

  return (
    <PopUp
      title={'Выбор фона'}
      show={showPopUp === 'POPUP_BACKGROUND'}
      showButtonAccept={false}
      showButtonCancel={false}
      closePopUp={closePopUp}
      className="setting_room_banner_popup_choice_background"
    >
      <input style={{ display: 'none' }} type="file" id={'load_backgrounds'} accept="image/png,image/jpeg,image/jpg" onChange={loadImage} />
      <div className="fon_list">
        {bannerBackgrounds.customBg.concat(bannerBackgrounds.defaultBg).map((bg, i) => (
          <div key={i} style={{ backgroundImage: `url(${bg.url || bg})` }}
            className="fon_list_single" onClick={() => setSelectedBg({ url: bg.url || bg })}>
            {(bg.url || bg) === (selectedBg.url || selectedBg) &&
            <div className={'fon_list_single__selected'}>
              <CheckSecond/>
            </div>}
          </div>
        ))}
      </div>
      <div className="popup_ui_window_buttons_list setting_room_banner_popup_choice_background__control_buttons">
        <Button
          type="submit"
          size="medium"
          color="blue"
          onClick={acceptBackground}
        >
          {'Выбрать'}
        </Button>
        <div className={'setting_room_banner_popup_choice_background__control_buttons__button_download__box'}>
          <ButtonBorder
            type="button"
            size="medium"
            color="blue"
            onClick={() => document.getElementById('load_backgrounds').click()}
          >
            <div className={'setting_room_banner_popup_choice_background__control_buttons__button_download__content'}>
              <Download />
              <span>{'Загрузить фон'}</span>
            </div>
          </ButtonBorder>
          <span className={'setting_room_banner_popup_choice_background__control_buttons__button_download__label'}>{'Размер: 290px x 124px'}</span>
        </div>
        <ButtonBorder
          type="button"
          size="medium"
          color="blue"
          onClick={closePopUp}
        >
          Отмена
        </ButtonBorder>
      </div>
    </PopUp>
  )
}

PopUpAddBackground.propTypes = {
  closePopUp: PropTypes.func.isRequired,
  showPopUp: PropTypes.string.isRequired,
  banner: PropTypes.shape({
    id: PropTypes.number,
    image_url: PropTypes.string,
    image: PropTypes.string
  }),
  selectBannerBackground: PropTypes.func.isRequired,
  selectedBannerIndex: PropTypes.number
}

export default PopUpAddBackground
