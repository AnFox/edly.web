import React, { useEffect, useState } from 'react'
import './AutoStream.scss'
import PropTypes from 'prop-types'
import ButtonBorder from '../../../UI/ButtonBorder'
import { CloseIcon, Download, Link, Plus } from '../../../UI/Icons/Icons'
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import Select from '../../../UI/Select'
import LoadJsonScript from '../../../LoadJsonScript'
import { useHistory, useParams } from 'react-router-dom'
import Button from '../../../UI/Button'
import PopUp from '../../../UI/PopUp'
import { deleteAllCommands } from '../../../../lib/admin/scenario/actions'
import { useDispatch, useSelector } from 'react-redux'

const AutoStream = (props) => {
  const params = useParams()
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])
  const scenario = useSelector(state => state.admin.scenario[params.roomId])
  const history = useHistory()
  const dispatch = useDispatch()
  const [showPopUpDeleteAll, setShowPopUpDeleteAll] = useState(false)
  const selectRules = [
    {
      value: '1W',
      label: 'Каждую неделю'
    },
    {
      value: '2W',
      label: 'Каждые 2 недели'
    },
    {
      value: '3W',
      label: 'Каждые 3 недели'
    },
    {
      value: '4W',
      label: 'Каждые 4 недели'
    },
    {
      value: '1D',
      label: 'каждый день'
    },
    {
      value: '2D',
      label: 'каждые 2 дня'
    },
    {
      value: '3D',
      label: 'каждые 3 дня'
    },
    {
      value: '4D',
      label: 'каждые 4 дня'
    },
    {
      value: '5D',
      label: 'каждые 5 дней'
    },
    {
      value: '6D',
      label: 'каждые 6 дней'
    }
  ]

  useEffect(() => { registerLocale('ru', ru) }, [])

  const getValue = () => {
    const rule = selectRules.find(selectRule => selectRule.value === props.values.scheduleInterval)
    return rule ? rule.label : ''
  }

  const deleteAll = () => {
    dispatch(deleteAllCommands(room.id))
    setShowPopUpDeleteAll(false)
  }

  const clearRule = () => {
    props.setFieldValue('scheduledAt', '')
    props.setFieldValue('scheduleInterval', '')
  }

  const addRule = () => {
    props.setFieldValue('scheduledAt', new Date())
  }

  return (
    <>
      <div className={props.isWebinar ? 'webinar_setting_stream_buttons webinar_setting_stream_import_edit' : 'setting_stream_buttons webinar_setting_stream_import_edit'}>
        <ButtonBorder type="button" size={props.isWebinar ? 'small' : 'medium'} onClick={() => history.push(`/scenario/${room.id}`)}><div className="setting_stream_button"><Link /><span>Редактор сценария</span></div></ButtonBorder>
        <ButtonBorder type="button" size={props.isWebinar ? 'small' : 'medium'} onClick={() => document.getElementById('load_json').click()}><div className="setting_stream_button"><Download/><span>Импорт сценария</span></div></ButtonBorder>
        {(scenario && scenario.length) ? <Button
          type="button"
          color="red"
          size={props.isWebinar ? 'small' : 'medium'}
          onClick={() => setShowPopUpDeleteAll(true)}
        >
          Удалить сценарий
        </Button> : null}
      </div>
      <div className={props.isWebinar ? 'setting_label webinar_setting_label' : 'setting_label'}>Расписание автовебинара</div>
      <div className="setting_stream_rules">
        {props.values.scheduledAt && (
          <div className="setting_stream_rule">
            <div className="input_ui_main">
              <DatePicker
                name='dateStart'
                popperPlacement="top-right"
                fixedHeight={true}
                className="input_ui_input"
                onChange={(date) => props.setFieldValue('scheduledAt', date)}
                selected={props.values.scheduledAt}
                placeholderText="00.00.0000 - 00:00"
                showTimeSelect
                timeFormat="HH:mm"
                minDate={new Date()}
                timeIntervals={30}
                timeCaption="time"
                dateFormat="dd MMMM yyyy HH:mm"
                locale="ru"
              />
            </div>
            <Select
              className="setting_stream_rule_select"
              list={selectRules}
              value={getValue()}
              onChange={(option) => props.setFieldValue('scheduleInterval', option.value)}
            />
            <CloseIcon onClick={clearRule} className="setting_stream_rule_close" />
          </div>
        )}
      </div>
      {!props.values.scheduledAt && <div className="setting_stream_add_rule" onClick={addRule}><Plus />Добавить расписание</div>}
      <LoadJsonScript id={'load_json'} />
      <PopUp
        show={showPopUpDeleteAll}
        closePopUp={() => setShowPopUpDeleteAll(false)}
        title="Подтвердите"
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptColor="red"
        buttonAcceptLabel="Удалить"
        buttonCancelLabel="Отмена"
        onAccept={deleteAll}
        onCancel={() => setShowPopUpDeleteAll(false)}
      >
        <div className="scenario_popup_delete">
          <div className="scenario_popup_delete_subtitle">Вы собираетесь удалить сценарий этой комнаты</div>
        </div>
      </PopUp>
    </>
  )
}

AutoStream.propTypes = {
  isWebinar: PropTypes.bool,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    scheduledAt: PropTypes.string,
    scheduleInterval: PropTypes.string
  })
}

export default AutoStream
