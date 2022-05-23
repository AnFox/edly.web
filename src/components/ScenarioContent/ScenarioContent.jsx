import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ScenarioContent.scss'
import ControlPanel from './ControlPanel'
import PropTypes from 'prop-types'
import ReactList from 'react-list'
import Command from './Command'
import { msToTime, toReadTime } from '../../utils/msToTime'
import PopUpCreateOrEditCommand from './PopUpCreateOrEditCommand'
import PopUpEditStopRecord from './PopUpEditStopRecord'
import { useDispatch, useSelector } from 'react-redux'
import { getScenario, scenarioClear, deleteCommand, updateCommand } from '../../lib/admin/scenario/actions'
import { getBanners } from '../../lib/admin/banner/actions'
import PopUp from '../UI/PopUp'
import PlyrPlayer from '../PlyrPlayer'
import { ArrowLeft, Tab } from '../UI/Icons/Icons'
import CheckBox from '../UI/CheckBox'
import BackStickerButton from '../backStickerButton'

const ScenarioContent = (props) => {
  const { text } = props
  const params = useParams()
  const dispatch = useDispatch()
  const scenarioSelector = useSelector(state => state.admin.scenario[params.roomId])
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])

  const [scenario, setScenario] = useState([])
  const [totalTime, setTotalTime] = useState({ hours: null, minutes: null, seconds: null })
  const [selectedCommands, setSelectedCommands] = useState([])
  const selectedCommandsRef = useRef([])
  const [showPopUpCreateOrEdit, setShowPopUpCreateOrEdit] = useState(false)
  const [showPopUpEditStopRecord, setShowPopUpEditStopRecord] = useState(false)
  const [singleCommand, setSingleCommand] = useState()
  const [showPopUpDeleteCommand, setShowPopUpDeleteCommand] = useState(false)

  const totalMilliseconds = useMemo(() => scenario.length && scenario.reduce((accumulator, command) => accumulator + +command.timeshift, 0), [scenario])

  useEffect(() => {
    dispatch(getScenario(params.roomId))
  }, [dispatch, params.roomId])

  const checkTimeshiftStopRecord = useCallback(() => {
    const stopRecord = scenarioSelector && scenarioSelector.find(command => command.action === 'stopRecord')
    if (scenarioSelector && scenarioSelector.length && stopRecord && stopRecord.timeshift < scenarioSelector[scenarioSelector.length - 1].timeshift) {
      const data = {
        timeshift: scenarioSelector[scenarioSelector.length - 1].timeshift + 2,
        action: 'stopRecord',
        payload: JSON.stringify({ text: 'Конец записи' })
      }
      dispatch(updateCommand(params.roomId, stopRecord.id, data))
    }
  }, [dispatch, params.roomId, scenarioSelector])

  useEffect(checkTimeshiftStopRecord, [checkTimeshiftStopRecord])

  useEffect(() => {
    if (scenarioSelector && scenarioSelector.length) {
      setScenario(scenarioSelector.filter(command => {
        return command.action === 'setWebinarLayout' ||
          command.action === 'setCurrentSlide' ||
          command.action === 'startStream' ||
          command.action === 'stopStream' ||
          command.action === 'postMessage' ||
          command.action === 'chatBlock' ||
          command.action === 'chatUnblock' ||
          command.action === 'postBanner' ||
          command.action === 'startRecord' ||
          command.action === 'stopRecord'
      }))
      const date = msToTime(+scenarioSelector[scenarioSelector.length - 1].timeshift)
      const result = toReadTime(date)
      setTotalTime(result)
    } else {
      setScenario([])
    }
  }, [scenarioSelector])

  useEffect(() => {
    dispatch(getBanners(params.roomId))
    return () => dispatch(scenarioClear(params.roomId))
  }, [dispatch, params.roomId])

  const changeCommand = (commandId, commandIndex) => {
    const index = selectedCommandsRef.current.findIndex(command => command.id === commandId)
    if (index === -1) {
      selectedCommandsRef.current.push(scenario[commandIndex])
    } else {
      selectedCommandsRef.current.splice(index, 1)
    }
    setSelectedCommands([...selectedCommandsRef.current])
  }

  const refreshSelectedCommands = () => {
    setSelectedCommands([])
    selectedCommandsRef.current = []
  }

  const showTotalTime = () => {
    return (
      <span><b>{totalTime.hours} ч {totalTime.minutes} {text.minutes} {totalTime.seconds} {text.seconds}</b></span>
    )
  }

  const editCommand = (commandData) => {
    setSingleCommand(commandData)
    if (commandData.action === 'stopRecord') {
      setShowPopUpEditStopRecord(true)
    } else {
      setShowPopUpCreateOrEdit(true)
    }

  }

  const deleteCommandShow = (commandData) => {
    setSingleCommand(commandData)
    setShowPopUpDeleteCommand(true)
  }

  const delCommand = () => {
    dispatch(deleteCommand(params.roomId, singleCommand.id))
    setShowPopUpDeleteCommand(false)
    refreshSelectedCommands()
  }

  const renderItem = (index, key) => {
    return (
      <React.Fragment key={key}>
        <Command
          command={scenario[index]}
          completedCommands={props.completedCommands}
          selectedCommands={selectedCommands}
          editCommand={editCommand}
          deleteCommandShow={deleteCommandShow}
          index={index}
          changeCommand={changeCommand}
          isShowPreview={props.isShowPreview}
        />
      </React.Fragment>
    )
  }

  const config = {
    youtube: {
      noCookie: true,
      rel: 0,
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      autoplay: 0
    },
    fullscreen: { enabled: false, fallback: true, iosNative: false, container: null },
    controls: []
  }

  const playerOnReady = (event) => {
    props.player.current = event.detail.plyr
  }

  return (
    <div className="scenario_content" ref={(element) => props.scenarioRefs.current.scenarioContent = element}>
      <BackStickerButton to={{
        pathname: `/edit/room/${params.roomId}`,
        state: { tab: 'Stream' }
      }}>
        <Tab /><span>{'Трансляция'}</span>
      </BackStickerButton>
      <div className="scenario_content_header">
        {props.isShowPreview
          ? <div className="scenario_content_header_back" onClick={props.exitOfThePreview}>
            <ArrowLeft/>
            <span>Выйти из режима просмотра</span>
          </div>
          : <span>{showTotalTime()} [{scenario.length}]</span>}
      </div>
      <div className="scenario_content_flex">
        <div
          ref={(element) => props.scenarioRefs.current.video = element}
          className="scenario_content_video_box"
          style={{ display: props.isShowPreview ? 'block' : 'none' }}
        >
          <div className="scenario_content_video">
            {room && <PlyrPlayer
              config={config}
              className={''}
              hideControl={true}
              videoId={room.video_id}
              onReady={playerOnReady}
              overlay={true}
            />}
          </div>
          <CheckBox
            className="scenario_content_video_box_checkbox"
            checked={props.isScroll}
            onCheck={props.changeIsScroll}
            label="Прокручивать к текущей команде"
          />
        </div>
        {!props.isShowPreview && <ControlPanel
          text={text}
          newCommand={() => setShowPopUpCreateOrEdit(true)}
          changeCommand={changeCommand}
          totalMilliseconds={totalMilliseconds}
          selectedCommands={selectedCommands}
          scenario={scenario}
          setScenario={setScenario}
          refreshSelectedCommands={refreshSelectedCommands}
          setIsShowPreview={props.setIsShowPreview}
          setShowPanel={props.setShowPanel}
        />}
        {scenario.length
          ? <div className="scenario_content_command_list" ref={props.scrollContainer}>
            <ReactList
              ref={props.list}
              itemRenderer={renderItem}
              length={scenario.length}
              useTranslate3d={true}
              type='variable'
            />
          </div>
          : <div className="empty_scenario">{text.emptyCommands}</div> }
      </div>
      <PopUpCreateOrEditCommand
        showPopUpCreateOrEdit={showPopUpCreateOrEdit}
        setShowPopUpCreateOrEdit={setShowPopUpCreateOrEdit}
        singleCommand={singleCommand}
        setSingleCommand={setSingleCommand}
        isEdit={!!singleCommand}
      />
      <PopUpEditStopRecord
        showPopUpEditStopRecord={showPopUpEditStopRecord}
        setShowPopUpEditStopRecord={setShowPopUpEditStopRecord}
        singleCommand={singleCommand}
        setSingleCommand={setSingleCommand}
      />
      <PopUp
        show={showPopUpDeleteCommand}
        closePopUp={() => setShowPopUpDeleteCommand(false)}
        title="Подтвердите"
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptColor="red"
        buttonAcceptLabel="Удалить"
        buttonCancelLabel="Отмена"
        onAccept={delCommand}
        onCancel={() => setShowPopUpDeleteCommand(false)}
      >
        <div className="scenario_content_popup_delete">
          <div className="scenario_content_control_delete_subtitle">
            Вы собираетесь удалить команду
          </div>
          <span>Вы можете сделать резервную копию всего сценария, нажав на &quot;Экспорт&quot;.</span>
        </div>
      </PopUp>
    </div>
  )
}

ScenarioContent.propTypes = {
  text: PropTypes.shape({
    emptyCommands: PropTypes.string.isRequired,
    minutes: PropTypes.string.isRequired,
    seconds: PropTypes.string.isRequired
  }).isRequired,
  setIsShowPreview: PropTypes.func.isRequired,
  isShowPreview: PropTypes.bool.isRequired,
  completedCommands: PropTypes.array,
  list: PropTypes.shape({
    current: PropTypes.any
  }),
  scrollContainer: PropTypes.shape({
    current: PropTypes.any
  }),
  player: PropTypes.shape({
    current: PropTypes.any
  }),
  setShowPanel: PropTypes.func,
  isScroll: PropTypes.bool,
  changeIsScroll: PropTypes.func.isRequired,
  exitOfThePreview: PropTypes.func.isRequired,
  scenarioRefs: PropTypes.shape({
    current: PropTypes.shape({
      video: PropTypes.any,
      scenarioContent: PropTypes.any
    })
  })
}

export default ScenarioContent
