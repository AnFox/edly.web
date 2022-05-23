import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useFormik } from 'formik'
import './PopUpEditStopRecord.scss'
import PopUp from '../../UI/PopUp'
import Button from '../../UI/Button'
import ButtonBorder from '../../UI/ButtonBorder'
import validationSchemaTimeshift from '../validationSchemaTimeshift'
import TimeshiftInputsForm from '../TimeshiftInputsForm'
import { msToTime } from '../../../utils/msToTime'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateCommand } from '../../../lib/admin/scenario/actions'

const PopUpEditStopRecord = (props) => {
  const params = useParams()
  const dispatch = useDispatch()
  const scenarioSelector = useSelector(state => state.admin.scenario[params.roomId])

  const formik = useFormik({
    initialValues: {
      hours: '',
      minutes: '',
      seconds: '',
      ms: '',
    },
    validationSchema: validationSchemaTimeshift,
    onSubmit: (values, { resetForm }) => {
      const timeshift = getTimeshift(values)
      dispatch(updateCommand(params.roomId, props.singleCommand.id, {
        timeshift: timeshift,
        action: 'stopRecord',
        payload: JSON.stringify({ text: 'Конец записи' })
      }))
      clearForm()
      resetForm()
    }
  })

  const clearForm = () => {
    props.setShowPopUpEditStopRecord(false)
    props.setSingleCommand(undefined)
  }

  const getTimeshift = (values) => {
    return (+values.hours * 60 * 60 * 1000) + (+values.minutes * 60 * 1000) + (+values.seconds * 1000) + +values.ms
  }

  useEffect(() => {
    if (props.singleCommand) {
      const time = msToTime(props.singleCommand.timeshift)
      formik.setFieldValue('hours', time.hours)
      formik.setFieldValue('minutes', time.minutes)
      formik.setFieldValue('seconds', time.seconds)
      formik.setFieldValue('ms', time.milliseconds)
    } else {
      formik.resetForm()
    }
  }, [props.singleCommand])

  const isDisabled = () => formik.errors.ms ||
    formik.errors.seconds ||
    formik.errors.minutes ||
    formik.errors.hours ||
    (scenarioSelector &&
      scenarioSelector.length &&
      scenarioSelector[scenarioSelector.length - 2] &&
      scenarioSelector[scenarioSelector.length - 2].timeshift >= getTimeshift(formik.values))

  return (
    <PopUp
      showButtonAccept={false}
      showButtonCancel={false}
      title={'Изменение команды'}
      show={props.showPopUpEditStopRecord}
      closePopUp={() => props.setShowPopUpEditStopRecord(false)}
    >
      <form onSubmit={formik.handleSubmit} className="popup_edit_stop_record">
        <div className="input_ui_main">
          <div className="input_ui_title">Тайминг (<span style={{ textTransform: 'none' }}>время от начала записи вебинара</span>)</div>
          <TimeshiftInputsForm formik={formik}/>
          <div className="input_ui_message input_ui_message_blue">
            Команда <b>завершения записи</b> может быть только последней.
          </div>
        </div>
        <div className="popup_ui_window_buttons_list">
          <Button
            type="submit"
            size="medium"
            color="blue"
            disabled={isDisabled()}
            onClick={null}
          >
            Изменить
          </Button>
          <ButtonBorder
            type="button"
            size="medium"
            color="blue"
            onClick={clearForm}
          >
            Отмена
          </ButtonBorder>
        </div>
      </form>
    </PopUp>
  )
}

PopUpEditStopRecord.propTypes = {
  setShowPopUpEditStopRecord: PropTypes.func.isRequired,
  showPopUpEditStopRecord: PropTypes.bool.isRequired,
  setSingleCommand: PropTypes.func.isRequired,
  singleCommand: PropTypes.shape({
    id: PropTypes.number.isRequired,
    timeshift: PropTypes.number.isRequired
  })
}

export default PopUpEditStopRecord
