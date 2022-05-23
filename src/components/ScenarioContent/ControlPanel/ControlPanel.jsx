import React, { useRef, useState } from 'react'
import './ControlPanel.scss'
import PropTypes from 'prop-types'
import Button from '../../UI/Button'
import { ArrowDown, ArrowsUpDown, CheckSquare, Download, Pencil, Plus, Refresh, Play } from '../../UI/Icons/Icons'
import ButtonBorder from '../../UI/ButtonBorder'
import PopUp from '../../UI/PopUp'
import CheckBox from '../../UI/CheckBox'
import Input from '../../UI/Input'
import '../../UI/Input/input.scss'
import InputRange from '../../UI/inputRange'
import { msToTime, toReadTime } from '../../../utils/msToTime'
import RadioButton from '../../UI/RadioButton'
import { deleteAllCommands, deleteCommand, updateCommand } from '../../../lib/admin/scenario/actions'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import LoadJsonScript from '../../LoadJsonScript'
import useScreenInfo from '../../../utils/useScreenInfo'

const ControlPanel = (props) => {
  const { text } = props
  const dispatch = useDispatch()
  const params = useParams()
  const [showDeleteOptions, setShowDeleteOptions] = useState(false)
  const eventKey = useRef()
  const windowSize = useScreenInfo()

  const [showPopUpSelectedCommands, setShowPopUpSelectedCommands] = useState(false)
  const initialStateSelectedCheckList = {
    postMessage: false,
    postBanner: false,
    startStream: false,
    stopStream: false,
    chatBlock: false,
    chatUnblock: false,
    setWebinarLayout: false,
    setCurrentSlide: false
  }
  const [selectedCheckList, setSelectedCheckList] = useState(initialStateSelectedCheckList)
  const [selectedCommandsRange, setSelectedCommandsRange] = useState({ min: '', max: '' })

  const [showPopUpMove, setShowPopUpMove] = useState(false)
  const [moveRange, setMoveRange] = useState({ value: '' })

  const [showPopUpDeleteAll, setShowPopUpDeleteAll] = useState(false)
  const [showPopUpDeleteSelected, setShowPopUpDeleteSelected] = useState(false)

  const [showPopUpExport, setShowPopUpExport] = useState(false)
  const [exportOption, setExportOption] = useState('all')

  const selectCommands = () => {
    props.refreshSelectedCommands()
    props.scenario.forEach((scenarioCommand, i) => {
      if (scenarioCommand.timeshift >= inputRangeToMs(selectedCommandsRange.min) &&
        scenarioCommand.timeshift <= inputRangeToMs(selectedCommandsRange.max) &&
        selectedCheckList[scenarioCommand.action]) {
        props.changeCommand(scenarioCommand.id, i)
      }
    })
    setSelectedCommandsRange({ min: '', max: '' })
    setSelectedCheckList(initialStateSelectedCheckList)
    setShowPopUpSelectedCommands(false)
  }

  const changePositionNavButtons = (e) => {
    const navMenu = document.querySelector('.scenario_content_control_panel_main_buttons')
    navMenu.scrollLeft = e.clientX - (e.clientX - navMenu.getBoundingClientRect().left)
  }

  const mouseDownMainButtons = () => {
    document.querySelector('.scenario_content_control_panel_main_buttons').addEventListener('mousemove', changePositionNavButtons)
  }

  const mouseUpMainButtons = () => {
    document.querySelector('.scenario_content_control_panel_main_buttons').removeEventListener('mousemove', changePositionNavButtons)
  }

  const isAcceptValue = (value) => !value.match(/[^.\d]/g)

  const isAddDot = (value) => ((value.toString().length === 2 || value.toString().length === 5 || value.toString().length === 8) && eventKey.current !== 8)

  const isDeleteDot = (value) => value[value.length - 1] === '.'

  const handleChangePopUpMove = (value) => {
    if (isAcceptValue(value)) {
      if (isAddDot(value)) {
        setMoveRange({ value: value + '.' })
      } else {
        if (isDeleteDot(value)) {
          setMoveRange({ value: value.slice(0, value.length - 1) })
        } else {
          setMoveRange({ value: value })
        }
      }
    }
  }

  const handleChangePopUpSelected = (value, side) => {
    if (isAcceptValue(value)) {
      if (isAddDot(value)) {
        if (side === 'min') {
          setSelectedCommandsRange({ ...selectedCommandsRange, min: value + '.' })
        } else {
          setSelectedCommandsRange({ ...selectedCommandsRange, max: value + '.' })
        }
      } else {
        if (isDeleteDot(value)) {
          if (side === 'min') {
            setSelectedCommandsRange({ ...selectedCommandsRange, min: value.slice(0, value.length - 1) })
          } else {
            setSelectedCommandsRange({ ...selectedCommandsRange, max: value.slice(0, value.length - 1) })
          }
        } else {
          if (side === 'min') {
            setSelectedCommandsRange({ ...selectedCommandsRange, min: value })
          } else {
            setSelectedCommandsRange({ ...selectedCommandsRange, max: value })
          }
        }
      }
    }
  }

  const inputRangeToMs = (value) => {
    const array = value.split('.')
    let result = 0
    switch (array.length) {
    case 0:
      break
    case 1:
      result = array[0] * 60 * 60 * 1000
      break
    case 2:
      result = array[0] * 60 * 60 * 1000 + array[1] * 60 * 1000
      break
    case 3:
      result = array[0] * 60 * 60 * 1000 + array[1] * 60 * 1000 + array[2] * 1000
      break
    case 4:
      result = array[0] * 60 * 60 * 1000 + array[1] * 60 * 1000 + array[2] * 1000 + +array[3]
      break
    }
    return result
  }

  const inputRangeHandleRange = (newRange) => {
    const resMin = msToTime(newRange.min < 0 ? 0 : newRange.min)
    const resMax = msToTime(newRange.max)
    const resMinToReadTine = toReadTime(resMin)
    const resMaxToReadTine = toReadTime(resMax)
    setSelectedCommandsRange({
      min: `${resMinToReadTine.hours}.${resMinToReadTine.minutes}.${resMinToReadTine.seconds}.${resMinToReadTine.milliseconds}`,
      max: `${resMaxToReadTine.hours}.${resMaxToReadTine.minutes}.${resMaxToReadTine.seconds}.${resMaxToReadTine.milliseconds}`
    })
  }

  const inputMoveRange = (newValue) => {
    const res = msToTime(newValue < 0 ? 0 : newValue)
    const resToReadTine = toReadTime(res)
    setMoveRange({ value: `${resToReadTine.hours}.${resToReadTine.minutes}.${resToReadTine.seconds}.${resToReadTine.milliseconds}` })
  }

  const onKeyDownSaveKey = (keyCode) => {
    eventKey.current = keyCode
  }

  const deleteAll = () => {
    dispatch(deleteAllCommands(params.roomId))
    setShowPopUpDeleteAll(false)
  }

  const deleteSelected = () => {
    props.selectedCommands.forEach(command => {
      if (command.action !== 'stopRecord' && command.action !== 'startRecord') {
        dispatch(deleteCommand(params.roomId, command.id))
      }
    })
    props.refreshSelectedCommands()
    setShowPopUpDeleteSelected(false)
  }

  const moveCommands = () => {
    if (props.selectedCommands.length) {
      props.selectedCommands.forEach(command => {
        const data = {
          id: command.id,
          action: command.action,
          payload: command.payload,
          timeshift: inputRangeToMs(moveRange.value)
        }
        dispatch(updateCommand(params.roomId, command.id, data))
      })
    } else {
      props.scenario.forEach(command => {
        const data = {
          id: command.id,
          action: command.action,
          payload: command.payload,
          timeshift: inputRangeToMs(moveRange.value)
        }
        dispatch(updateCommand(params.roomId, command.id, data))
      })
    }
    setShowPopUpMove(false)
  }

  const exportScenario = () => {
    if (props.selectedCommands.length) {
      //
    }
  }

  const showPreview = () => {
    props.refreshSelectedCommands()
    props.setIsShowPreview(true)
  }

  const popUpButtonAcceptDisabled = () => selectedCommandsRange.min === selectedCommandsRange.max ||
    !(selectedCheckList.postMessage ||
    selectedCheckList.postBanner ||
    selectedCheckList.stopStream ||
    selectedCheckList.chatBlock ||
    selectedCheckList.setWebinarLayout ||
    selectedCheckList.setCurrentSlide)

  return (
    <div className="scenario_content_control_panel_wrap">
      <Button
        className="btn_ui_custom scenario_content_control_panel_buttons_show"
        onClick={() => props.setShowPanel(state => !state)} >
        <div className="scenario_content_buttons_content">
          <div>
            <Pencil />
            <span>{text.controlPanel.title}</span>
          </div>

          <ArrowDown />
        </div>
      </Button>
      <div className="scenario_content_control_panel"
      >
        <div className="scenario_content_control_panel_main_buttons" onMouseDown={mouseDownMainButtons} onMouseUp={mouseUpMainButtons} >
          <Button className="btn_ui_custom" onClick={() => props.newCommand(true)}>
            <div className="scenario_content_buttons_content">
              <Plus />
              <span>{windowSize.width > 650 ? text.controlPanel.createCommand : text.controlPanel.createCommandMobile}</span>
            </div>
          </Button>
          <Button
            className="btn_ui_custom"
            color="green"
            disabled={!props.scenario.length || props.scenario.length < 2}
            onClick={showPreview}
          >
            <div className="scenario_content_buttons_content">
              <Play />
              <span>{windowSize.width > 650 ? text.controlPanel.previewScenario : text.controlPanel.previewScenarioMobile}</span>
            </div>
          </Button>
          <ButtonBorder
            className="btn_ui_border_custom"
            onClick={() => setShowPopUpSelectedCommands(true)}
            disabled={!props.scenario.length}
          >
            <div className="scenario_content_buttons_content">
              <CheckSquare />
              <span>{windowSize.width > 650 ? text.controlPanel.selectTeams : text.controlPanel.selectTeamsMobile}</span>
            </div>
          </ButtonBorder>
        </div>
        <div className="scenario_content_control_panel_marked_box">
          <span>{text.controlPanel.marked}: <b>{props.selectedCommands.length}</b></span><span onClick={props.refreshSelectedCommands} className="scenario_content_control_panel_marked_reset"><Refresh className="scenario_icon_black" /> {text.controlPanel.reset}</span>
        </div>
        <div className="scenario_content_control_panel_buttons">
          <div className="scenario_content_control_panel_buttons_first">
            <ButtonBorder
              className="btn_ui_border_custom"
              onClick={() => setShowPopUpMove(true)}
              disabled={!props.scenario.length}
            >
              <div className="scenario_content_buttons_content">
                <ArrowsUpDown />
                <span>{text.controlPanel.move}</span>
              </div>
            </ButtonBorder>
            <div className="scenario_content_delete_command_wrap">
              <Button
                className="btn_ui_custom"
                color="red"
                disabled={!props.scenario.length}
                onClick={() => { document.querySelector('.scenario_delete_command_options').focus(); setShowDeleteOptions(!showDeleteOptions) }}
              >
                <div className="scenario_content_buttons_content scenario_delete_command">
                  <div>
                    <Plus />
                    <span>{text.controlPanel.delete}</span>
                  </div>
                  <ArrowDown style={{ transform: showDeleteOptions ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>
              </Button>
              <div tabIndex={11} onBlur={() => setShowDeleteOptions(false)} className="scenario_delete_command_options" style={{ height: showDeleteOptions ? '88px' : '0' }} >
                <div onClick={() => {
                  setShowDeleteOptions(false)
                  setShowPopUpDeleteSelected(!!props.selectedCommands.length)
                }}>Отмеченные</div>
                <div onClick={() => {
                  setShowDeleteOptions(false)
                  setShowPopUpDeleteAll(true)
                }}>Все команды</div>
              </div>
            </div>

          </div>
          <div className="scenario_content_control_panel_buttons_second">
            {/*<ButtonBorder className="btn_ui_border_custom" onClick={() => setShowPopUpExport(true)}>*/}
            {/*  <div className="scenario_content_buttons_content">*/}
            {/*    <Download />*/}
            {/*    <span>{text.controlPanel.export}</span>*/}
            {/*  </div>*/}
            {/*</ButtonBorder>*/}
            <ButtonBorder className="btn_ui_border_custom" onClick={() => document.getElementById('load_json').click()}>
              <div className="scenario_content_buttons_content">
                <Download style={{ transform: 'rotate(180deg)' }} />
                <span>{text.controlPanel.import}</span>
              </div>
            </ButtonBorder>
          </div>
        </div>

      </div>
      <PopUp
        show={showPopUpExport}
        closePopUp={() => setShowPopUpExport(false)}
        title="Параметры экспорта"
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptLabel="Экспорт"
        buttonCancelLabel="Отмена"
        onAccept={exportScenario}
        onCancel={() => setShowPopUpExport(false)}
      >
        <div className="scenario_content_control_panel_popup_export">
          <div className="scenario_content_popup_subtitle">Экспортировать</div>
          <RadioButton
            label="Весь сценарий целиком"
            controll={true}
            selected={exportOption === 'all'}
            onSelect={() => setExportOption('all')}
          />
          <RadioButton
            label="Отмеченные"
            controll={true}
            selected={exportOption === 'selected'}
            onSelect={() => setExportOption('selected')}
          />
        </div>
      </PopUp>
      <PopUp
        show={showPopUpMove}
        closePopUp={() => setShowPopUpMove(false)}
        title="Перемещение выделенных команд по шкале времени"
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptLabel="Переместить"
        buttonCancelLabel="Отмена"
        onAccept={moveCommands}
        onCancel={() => setShowPopUpMove(false)}
        ButtonAcceptDisabled={!moveRange.value}
      >
        <div className="scenario_content_control_panel_popup_move">
          <div className="scenario_content_popup_subtitle popup_input_range_subtitle_margin">Сдвинуть выделенный блок команд в точку</div>
          <InputRange
            minValue={0}
            maxValue={(12 * 60 * 60 * 1000)}
            value={inputRangeToMs(moveRange.value)}
            onChange={(newRange) => inputMoveRange(newRange)}
          />
          <div className="input_ui_main">
            <div className="input_ui_title">относительно начала сценария</div>
            <input
              className="input_ui_input"
              onKeyDown={(e) => onKeyDownSaveKey(e.keyCode)}
              maxLength={12} placeholder="ЧЧ.ММ.СС.МС"
              value={moveRange.value}
              onChange={(e) => handleChangePopUpMove(e.target.value)}
            />
            <div className="input_ui_message input_ui_message_blue">
              Если какие-то команды выделены, сдвигаются они.
              Если ничего не выделено — сдвигаются <b>все команды</b> в сценарии.
            </div>
          </div>
        </div>
      </PopUp>
      <PopUp
        show={showPopUpSelectedCommands}
        closePopUp={() => setShowPopUpSelectedCommands(false)}
        title="Выделить команды"
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptLabel="Выделить"
        buttonCancelLabel="Отмена"
        onAccept={selectCommands}
        onCancel={() => setShowPopUpSelectedCommands(false)}
        ButtonAcceptDisabled={popUpButtonAcceptDisabled()}
      >
        <div className="scenario_content_control_panel_popup_selected">
          <div className="scenario_content_popup_subtitle popup_input_range_subtitle_margin">Временной интервал</div>
          <InputRange
            minValue={0}
            maxValue={props.scenario.length ? props.scenario[props.scenario.length - 1].timeshift : 1}
            value={{ min: inputRangeToMs(selectedCommandsRange.min), max: inputRangeToMs(selectedCommandsRange.max) }}
            onChange={(newRange) => inputRangeHandleRange(newRange)}
          />
          <div className="scenario_content_popup_selected_commands_inputs">
            <Input
              className="scenario_content_popup_selected_commands_input"
              onKeyDown={(e) => onKeyDownSaveKey(e.keyCode)}
              maxLength={12} placeholder="ЧЧ.ММ.СС.МС"
              value={selectedCommandsRange.min}
              onChange={(e) => handleChangePopUpSelected(e.target.value, 'min')}
              title={true}
              titleText="От" />
            <Input
              className="scenario_content_popup_selected_commands_input"
              onKeyDown={(e) => onKeyDownSaveKey(e.keyCode)}
              maxLength={12} placeholder="ЧЧ.ММ.СС.МС"
              value={selectedCommandsRange.max}
              onChange={(e) => handleChangePopUpSelected(e.target.value, 'max')}
              title={true}
              titleText="До" />
          </div>
          <div className="scenario_content_popup_selected_commands_checkbox_list">
            <div className="scenario_content_popup_subtitle">Типы</div>
            <CheckBox
              checked={selectedCheckList.postMessage}
              onCheck={() => setSelectedCheckList({ ...selectedCheckList, postMessage: !selectedCheckList.postMessage })}
              label="Сообщения в чат" />
            <CheckBox
              checked={selectedCheckList.postBanner}
              onCheck={() => setSelectedCheckList({ ...selectedCheckList, postBanner: !selectedCheckList.postBanner })}
              label="Баннер в чат" />
            <CheckBox
              checked={selectedCheckList.startStream}
              onCheck={() => setSelectedCheckList({ ...selectedCheckList, startStream: !selectedCheckList.startStream, stopStream: !selectedCheckList.stopStream })}
              label="Трансляция" />
            <CheckBox
              checked={selectedCheckList.chatBlock}
              onCheck={() => setSelectedCheckList({ ...selectedCheckList, chatBlock: !selectedCheckList.chatBlock, chatUnblock: !selectedCheckList.chatUnblock })}
              label="Блокировка чата" />
            <CheckBox
              checked={selectedCheckList.setWebinarLayout}
              onCheck={() => setSelectedCheckList({ ...selectedCheckList, setWebinarLayout: !selectedCheckList.setWebinarLayout })}
              label="Расположение видео и презентации" />
            <CheckBox
              checked={selectedCheckList.setCurrentSlide}
              onCheck={() => setSelectedCheckList({ ...selectedCheckList, setCurrentSlide: !selectedCheckList.setCurrentSlide })}
              label="Номер слайда" />
          </div>
        </div>
      </PopUp>
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
        <div className="scenario_content_popup_delete">
          <div className="scenario_content_popup_delete_subtitle">Вы собираетесь удалить все команды этой комнаты</div>
          <span>Вы можете сделать резервную копию всего сценария, нажав на &quot;Экспорт&quot;.</span>
        </div>
      </PopUp>
      <PopUp
        show={showPopUpDeleteSelected}
        closePopUp={() => setShowPopUpDeleteSelected(false)}
        title="Подтвердите"
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptColor="red"
        buttonAcceptLabel="Удалить"
        buttonCancelLabel="Отмена"
        onAccept={deleteSelected}
        onCancel={() => setShowPopUpDeleteSelected(false)}
      >
        <div className="scenario_content_popup_delete">
          <div className="scenario_content_popup_delete_subtitle">
            Вы собираетесь удалить выбранные команды ({props.selectedCommands.length})
          </div>
          <span>Вы можете сделать резервную копию всего сценария, нажав на &quot;Экспорт&quot;.</span>
        </div>
      </PopUp>
      <LoadJsonScript id={'load_json'} />
    </div>
  )
}

ControlPanel.propTypes = {
  text: PropTypes.shape({
    controlPanel: PropTypes.shape({
      title: PropTypes.string,
      import: PropTypes.string,
      createCommand: PropTypes.string,
      createCommandMobile: PropTypes.string,
      previewScenario: PropTypes.string,
      previewScenarioMobile: PropTypes.string,
      selectTeams: PropTypes.string,
      selectTeamsMobile: PropTypes.string,
      marked: PropTypes.string,
      move: PropTypes.string,
      delete: PropTypes.string,
      reset: PropTypes.string,
      export: PropTypes.string
    }).isRequired
  }),
  totalMilliseconds: PropTypes.number,
  selectedCommands: PropTypes.arrayOf(PropTypes.object),
  scenario: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    timeshift: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    payload: PropTypes.string
  })).isRequired,
  refreshSelectedCommands: PropTypes.func.isRequired,
  setScenario: PropTypes.func,
  changeCommand: PropTypes.func.isRequired,
  newCommand: PropTypes.func.isRequired,
  setIsShowPreview: PropTypes.func.isRequired,
  setShowPanel: PropTypes.func.isRequired,
}

export default ControlPanel
