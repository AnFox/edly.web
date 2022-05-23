import React from 'react'
import './scenarioPlayerControls.scss'
import PropTypes from 'prop-types'
import Button from '../../UI/Button'
import { MediaPlay, MediaPause, MediaPlayArrowTo, MediaPlayDoubleArrow, MediaPlayRefresh } from '../../UI/Icons/Icons'
import InputRange from '../../UI/inputRange'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ScenarioPlayerControls = (props) => {
  const params = useParams()
  const scenarioSelector = useSelector(state => state.admin.scenario[params.roomId])

  const maxValueLabel = () => {
    const lastCommand = +scenarioSelector[scenarioSelector.length - 1].timeshift
    return {
      minutes: (lastCommand / 1000 / 60).toFixed(),
      seconds: ((lastCommand / 1000) % 60).toFixed()
    }
  }

  const setNewTime = (newTime) => {
    props.setNewTime(newTime)
  }

  const getCurrentTime = () => <div>{~~(props.currentTime / 1000 / 60)} Мин {~~((props.currentTime / 1000) % 60)}  Сек</div>

  const getControlButton = () => {
    switch (props.statusPlayer) {
    case 'pause':
      return <Button onClick={props.playScenario} size="small" color="green"><MediaPlay/></Button>
    case 'play':
      return <Button onClick={props.pauseScenario} size="small" color="yellow"><MediaPause/></Button>
    case 'end':
      return <Button onClick={props.playAgainScenario} size="small" color="green"><MediaPlayRefresh/></Button>
    default:
      return <Button onClick={props.playScenario} size="small" color="green"><MediaPlay/></Button>
    }
  }

  return (
    <div ref={(element) => props.scenarioRefs.current.player = element} className="scenario_player">
      <div className="scenario_player_range_box">
        <div className="scenario_player_range_box_labels">
          {getCurrentTime()}
          <div>{maxValueLabel().minutes} Мин {maxValueLabel().seconds} Сек</div>
        </div>
        <InputRange
          value={props.currentTime || 0}
          onChange={setNewTime}
          minValue={0}
          maxValue={+scenarioSelector[scenarioSelector.length - 1].timeshift}
        />
      </div>
      <div className="scenario_player_buttons_box">
        <div className="scenario_player_button">
          <Button size="small" color="blue" onClick={() => props.backTo(props.currentTime + 10000)}>
            <MediaPlayArrowTo/>
          </Button>
          <span>В начало</span>
        </div>
        <div className="scenario_player_button">
          <Button size="small" color="blue" onClick={() => props.backTo(60000)}>
            <MediaPlayDoubleArrow/>
          </Button>
          <span>60 сек</span>
        </div>
        <div className="scenario_player_button scenario_player_button_desktop">
          <Button size="small" color="blue" onClick={() => props.backTo(10000)}>
            <MediaPlayDoubleArrow/>
          </Button>
          <span>10 сек</span>
        </div>
        <div className="scenario_player_button">
          {getControlButton()}
          <span />
        </div>
        <div className="scenario_player_button scenario_player_button_desktop">
          <Button size="small" color="blue" onClick={() => props.forwardTo(10000)}>
            <MediaPlayDoubleArrow style={{ transform: 'rotate(180deg)' }}/>
          </Button>
          <span>10 сек</span>
        </div>
        <div className="scenario_player_button">
          <Button size="small" color="blue" onClick={() => props.forwardTo(60000)}>
            <MediaPlayDoubleArrow style={{ transform: 'rotate(180deg)' }}/>
          </Button>
          <span>60 сек</span>
        </div>
        <div className="scenario_player_button">
          <Button size="small" color="blue" onClick={() => props.forwardTo(300000)}>
            <MediaPlayDoubleArrow style={{ transform: 'rotate(180deg)' }}/>
          </Button>
          <span>5 мин</span>
        </div>
      </div>
    </div>
  )
}

ScenarioPlayerControls.propTypes = {
  currentTime: PropTypes.number.isRequired,
  forwardTo: PropTypes.func.isRequired,
  backTo: PropTypes.func.isRequired,
  statusPlayer: PropTypes.string.isRequired,
  playScenario: PropTypes.func.isRequired,
  pauseScenario: PropTypes.func.isRequired,
  setNewTime: PropTypes.func.isRequired,
  playAgainScenario: PropTypes.func.isRequired,
  scenarioRefs: PropTypes.shape({
    current: PropTypes.shape({
      player: PropTypes.any
    })
  })
}

export default ScenarioPlayerControls
