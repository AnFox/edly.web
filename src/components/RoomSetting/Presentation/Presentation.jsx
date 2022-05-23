import React, { useState, useEffect, useMemo } from 'react'
import './Presentation.scss'
import ButtonBorder from '../../UI/ButtonBorder'
import PropTypes from 'prop-types'
import { Download, Delete } from '../../UI/Icons/Icons'
import PopUp from '../../UI/PopUp'
import RadioButton from '../../UI/RadioButton'
import DragAndDropDownloadFile from '../../UI/DragAndDropDownloadFile'
import SettingFooter from '../Footer'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAdminRoom,
  roomSetPresentation,
  roomSetPresentationStatus,
  roomUnsetPresentation
} from '../../../lib/admin/rooms/actions'
import { deleteConversationPdf } from '../../../lib/admin/conversions/actions'
import LinearProgress from '@material-ui/core/LinearProgress'
import { roomGetSlides } from '../../../lib/admin/slides/actions'
import { useParams } from 'react-router-dom'

const STATUS_NOT_PROCESSED = 0
const STATUS_PROCESSING = 1
const STATUS_PROCESSED = 2
const STATUS_FAILED = 3

const Presentation = (props) => {
  const [openPopUpDownload, setOpenPopUpDownload] = useState(false)
  const [openPopUpDelete, setOpenPopUpDelete] = useState(false)
  const [qualityType, setQualityType] = useState('standard')
  const [loader, setLoader] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showProgressBar, setShowProgressBar] = useState(false)
  const dispatch = useDispatch()
  const params = useParams()
  const slides = useSelector(state => state.admin.slides)
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])
  const conversions = useSelector(state => state.admin.conversions.pdf)

  useEffect(() => {
    let timer = null
    if (conversions.find((item) => item.roomId === room.id)) {
      setShowProgressBar(true)
      timer = setInterval(getConversionStatus, 2000)
    }
    return () => clearInterval(timer)
  }, [conversions])

  const deletePresentation = () => {
    dispatch(roomUnsetPresentation(room.id))
    setOpenPopUpDelete(false)
  }

  const conversionId = useMemo(() => conversions.find((item) => item.roomId === room.id)?.conversionId, [conversions, room])

  const getConversionStatus = () => {

    if (conversionId) {
      roomSetPresentationStatus(room.id, conversionId).then(res => {
        switch (res.data.data.status) {
        case STATUS_NOT_PROCESSED:
          break
        case STATUS_PROCESSING:
          setProgress(res.data.data.progress)
          break
        case STATUS_PROCESSED:
          dispatch(deleteConversationPdf({ roomId: room.id }))
          setLoader(false)
          dispatch(getAdminRoom(room.id))
          setProgress(0)
          setShowProgressBar(false)
          if (slides.slides.length) {
            dispatch(roomGetSlides(room.id, 1, 9999))
          }
          break
        case STATUS_FAILED:
          setLoader(false)
          break
        }
      })
    }
  }

  const onLoadFile = (file) => {
    setLoader(true)
    dispatch(roomSetPresentation(room, file, qualityType))
      .then(() => setOpenPopUpDownload(false))
  }

  return (
    <div className={props.webinarLocation
      ? 'setting_webinar_padding setting_webinar_presentation'
      : 'setting_padding setting_presentation'}>
      <ButtonBorder onClick={() => setOpenPopUpDownload(true)} size={props.webinarLocation ? 'small' : 'medium'} className="presentation_btn_ui">
        <Download className="presentation_icon" />
        {props.text.presentation.buttonDownload}
      </ButtonBorder>
      {!room.presentation ? (
        <div className="presentation_empty">{props.text.presentation.emptyPresentation}</div>
      ) : (
        <div className="presentation_card">
          <div>
            <div className="presentation_card_name">{room.presentation.name}</div>
            <div className="presentation_card_gray">{props.text.presentation.slides}:&nbsp;{room.presentation.slides_total}</div>
          </div>
          {!conversionId && <Delete className="presentation_card_delete_icon" onClick={() => setOpenPopUpDelete(true)} />}
          {showProgressBar && (
            <div className="presentation_card_progress">
              <LinearProgress variant="determinate" value={progress} />
            </div>
          )}
        </div>
      )}
      <PopUp
        show={openPopUpDownload}
        showButtonAccept={false}
        showButtonCancel={true}
        buttonCancelSize="medium"
        buttonCancelType="border"
        onCancel={() => setOpenPopUpDownload(false)}
        title={props.text.presentation.popUpAddPresentation.title}
        closePopUp={() => setOpenPopUpDownload(false)}
        buttonCancelLabel={props.text.presentation.popUpAddPresentation.buttonCancel}
      >
        <div className="presentation_popup_add">
          <div className="presentation_popup_add_radio_group">
            <div className="presentation_popup_add_radio_group_title">{props.text.presentation.popUpAddPresentation.qualityOfConversion}</div>
            <div className="presentation_popup_add_radio_group_button">
              <RadioButton
                controll={true}
                selected={qualityType === 'standard'}
                label={props.text.presentation.popUpAddPresentation.standard}
                classNameLabel={'presentation_popup_label'}
                onSelect={() => setQualityType('standard')}
              />
              <span className="presentation_popup_add_radio_group_button_additional_info">({props.text.presentation.popUpAddPresentation.standartSubtitle})</span>
            </div>
            <div className="presentation_popup_add_radio_group_button">
              <RadioButton
                controll={true}
                selected={qualityType === 'improved'}
                label={props.text.presentation.popUpAddPresentation.better}
                classNameLabel={'presentation_popup_label'}
                onSelect={() => setQualityType('improved')}
              />
              <span className="presentation_popup_add_radio_group_button_additional_info">({props.text.presentation.popUpAddPresentation.betterSubtitle})</span>
            </div>
            <div className="presentation_popup_add_radio_group_button">
              <RadioButton
                controll={true}
                selected={qualityType === 'maximum'}
                label={props.text.presentation.popUpAddPresentation.maximum}
                classNameLabel={'presentation_popup_label'}
                onSelect={() => setQualityType('maximum')}
              />
              <span className="presentation_popup_add_radio_group_button_additional_info">({props.text.presentation.popUpAddPresentation.maximumSubtitle})</span>
            </div>
          </div>
          <DragAndDropDownloadFile
            id="load_presentation"
            accept="application/pdf"
            label={props.text.presentation.popUpAddPresentation.dragAndDrop}
            labelLeave={props.text.presentation.popUpAddPresentation.dragAndDropActive}
            returnType={'arrayBuffer'}
            maxSize={100}
            loader={loader}
            progress={progress}
            onLoadEnd={onLoadFile}
            disabled={showProgressBar}
          />
        </div>
      </PopUp>
      <PopUp
        show={openPopUpDelete}
        showButtonAccept={true}
        buttonAcceptColor="red"
        buttonAcceptSize="medium"
        showButtonCancel={true}
        buttonCancelSize="medium"
        buttonCancelType="border"
        buttonAcceptLabel={props.text.presentation.popUpDeletePresentation.buttonAccept}
        buttonCancelLabel={props.text.presentation.popUpDeletePresentation.buttonCancel}
        onAccept={deletePresentation}
        onCancel={() => setOpenPopUpDelete(false)}
        title={props.text.presentation.popUpDeletePresentation.title}
        closePopUp={() => setOpenPopUpDelete(false)}
      >
        <div className="presentation_popup_delete">
          <div className="presentation_popup_label"><b>{props.text.presentation.popUpDeletePresentation.subtitle}{room.presentation?.name}</b></div>
        </div>
      </PopUp>
      <SettingFooter hideSaveButton={true} rollUp={props.rollUp} webinar={props.webinarLocation} text={props.text} />
    </div>
  )
}

Presentation.propTypes = {
  webinarLocation: PropTypes.bool.isRequired,
  rollUp: PropTypes.func.isRequired,
  text: PropTypes.shape({
    presentation: PropTypes.shape({
      buttonDownload: PropTypes.string.isRequired,
      emptyPresentation: PropTypes.string.isRequired,
      slides: PropTypes.string.isRequired,
      popUpAddPresentation: PropTypes.shape({
        dragAndDrop: PropTypes.string,
        dragAndDropActive: PropTypes.string,
        title: PropTypes.string.isRequired,
        qualityOfConversion: PropTypes.string,
        standard: PropTypes.string.isRequired,
        standartSubtitle: PropTypes.string,
        better: PropTypes.string.isRequired,
        betterSubtitle: PropTypes.string,
        maximum: PropTypes.string.isRequired,
        maximumSubtitle: PropTypes.string,
        buttonCancel: PropTypes.string
      }).isRequired,
      popUpDeletePresentation: PropTypes.shape({
        buttonAccept: PropTypes.string.isRequired,
        buttonCancel: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        subtitle: PropTypes.string
      })
    })
  })
}

export default Presentation
