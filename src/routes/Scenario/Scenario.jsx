import React, { useEffect, useRef, useState } from 'react'
import './Scenario.scss'
import { useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/RoomsHeader'
import TitleForRouteScreen from '../../components/UI/TitleForRouteScreen'
import ScenarioContent from '../../components/ScenarioContent'
import { useSelector } from 'react-redux'
import ScenarioPlayerControls from '../../components/ScenarioContent/scenarioPlayerControls'
import useScreenInfo from '../../utils/useScreenInfo'
import RouteWrapper from '../../components/UI/RouteWrapper'

const text = {
  title: 'Сценарий вебинара',
  minutes: 'мин',
  seconds: 'сек',
  emptyCommands: 'Вы еще не создали ни одной команды.',
  controlPanel: {
    title: 'Редактор команд',
    createCommand: 'Создать команду',
    previewScenario: 'Просмотр сценария',
    selectTeams: 'Выделить команды',
    createCommandMobile: 'Создать',
    previewScenarioMobile: 'Просмотр',
    selectTeamsMobile: 'Выделить',
    marked: 'Отмечено',
    reset: 'сброс',
    move: 'Переместить',
    delete: 'Удалить',
    export: 'Экспорт',
    import: 'Импорт'
  }
}

let timer = null
let timerUpdateState = null

const Scenario = () => {
  const params = useParams()
  const list = useRef()
  const player = useRef()
  const scroll = useRef(true)
  const [isScroll, setIsScroll] = useState(true)
  const scrollContainer = useRef()
  const scenarioSelector = useSelector(state => state.admin.scenario[params.roomId])
  const time = useRef(0)
  const [statusPlayer, setStatusPlayer] = useState('')
  const [completedCommandsState, setCompletedCommandsState] = useState([])
  const [isShowPreview, setIsShowPreview] = useState(false)
  const [timeState, setTimeState] = useState(0)
  const [showPanel, setShowPanel] = useState(false)
  const windowSize = useScreenInfo()

  const next = useRef()
  const current = useRef()
  const index = useRef(0)
  const completedCommands = useRef([])

  useEffect(() => {
    let title = document.querySelector('.scenario_title')
    let header = document.querySelector('.header_main')
    let controlPanel = document.querySelector('.scenario_content_control_panel')
    let footer = document.querySelector('.footer')
    const headerAndFooter = (show) => {

      if (show) {
        footer.style.display = ''
        header.style.display = ''
      } else {
        footer.style.display = 'none'
        header.style.display = 'none'
      }
    }

    if (isShowPreview) {
      let list = document.querySelector('.scenario_content_command_list')
      if (windowSize.width <= 650) {
        headerAndFooter(false)
        title.style.display = 'none'
        scenarioRefs.current.scenario.style.marginBottom = '0'
        if (list) {
          list.style.maxHeight =
            `calc(${windowSize.height}px - 
            ${scenarioRefs.current.video.scrollHeight}px - 
            ${scenarioRefs.current.player.scrollHeight}px - 
            ${document.querySelector('.scenario_content_header').clientHeight}px)`
        }
      } else {
        headerAndFooter(true)
        title.style.display = ''
        scenarioRefs.current.scenario.style.marginBottom = ''
        list.style.maxHeight = ''
      }
    } else {
      footer.style.display = ''
    }

    if (windowSize.width <= 650 && !isShowPreview) {
      if (showPanel) {
        footer.style.display = 'none'
        title.style.display = 'none'
        header.style.display = 'none'
        controlPanel.style.height = ``
        controlPanel.style.padding = ''
      } else {
        footer.style.display = ''
        title.style.display = ''
        header.style.display = ''
        controlPanel.style.height = '0'
        controlPanel.style.padding = '0'

      }
    } else {
      if (windowSize.width > 650 && !isShowPreview) {
        title.style.display = ''
        header.style.display = ''
        controlPanel.style.height = ``
        controlPanel.style.padding = ''
        setShowPanel(true)
      }
    }

    scenarioRefs.current.scenarioContent.style.height =
      `${windowSize.height - title.scrollHeight - 
      parseInt(window.getComputedStyle(title, null).marginTop) - 
      parseInt(window.getComputedStyle(title, null).marginBottom) - 
      header.scrollHeight - footer.scrollHeight}px`

  }, [isShowPreview, showPanel, windowSize])

  const nextCommand = () => {
    completedCommands.current.push(current.current)
    current.current = next.current
    index.current++
    if (index.current >= scenarioSelector.length) {
      clearInterval(timer)
      setTimeout(() => clearInterval(timerUpdateState), 500)
      if (player.current) {
        player.current.pause()
      }
      setPlayerTime(0)
      setStatusPlayer('end')
      next.current = null
    } else {
      next.current = scenarioSelector[index.current + 1]
    }
  }

  const changeIsScroll = () => {
    scroll.current = !isScroll
    setIsScroll(!isScroll)
  }

  const overtake = () => new Promise(resolve => {
    let flag = true

    while (flag) {
      if (current.current) {
        if (+current.current.timeshift <= time.current) {
          nextCommand()
          if (next.current) {
            if (+next.current.timeshift > time.current) {
              flag = false
            }
          } else {
            flag = false
          }

        }
      } else {
        flag = false
      }

    }
    resolve(true)
  })

  const playScenario = () => {
    current.current = scenarioSelector[index.current]
    next.current = scenarioSelector[index.current + 1]
    setStatusPlayer('play')
    if (player.current) {
      player.current.play()
    }
    timer = setInterval(nextStepPlayScenario, 10)
    timerUpdateState = setInterval(updateState, 500)
  }

  const nextStepPlayScenario = async () => {
    time.current += 10
    const range = list.current.getVisibleRange()
    const index = scenarioSelector.findIndex(command => command.id === current.current.id)
    if (range[0] < index - 2 && scroll.current) {
      const speed = (index - 2 - range[0]) * 10
      scrollContainer.current.scrollTo(0, scrollContainer.current.scrollTop + speed)
    } else {
      if (range[0] > index + 1 && scroll.current) {
        list.current.scrollTo(index - 1)
      }
    }
    if (+current.current.timeshift <= time.current) {
      nextCommand()
      if (next.current && +next.current.timeshift <= time.current) {
        await overtake()
      }
    }
  }

  const pauseScenario = () => {
    setStatusPlayer('pause')
    if (player.current) {
      player.current.pause()
    }
    clearInterval(timer)
    clearInterval(timerUpdateState)
  }

  const forwardTo = (ms) => {
    if (scenarioSelector[scenarioSelector.length - 1].timeshift > time.current + ms) {
      time.current += ms
      setPlayerTime(time.current / 1000)
    } else {
      time.current = scenarioSelector[scenarioSelector.length - 1].timeshift
      setPlayerTime(scenarioSelector[scenarioSelector.length - 1].timeshift / 1000)
    }
  }

  const backTo = (ms) => {
    clearInterval(timerUpdateState)
    clearInterval(timer)
    if (time.current - ms < 0) {
      time.current = 0
      setPlayerTime(0)
    } else {
      time.current -= ms
      setPlayerTime(time.current / 1000)
    }
    for (let i = 0; i < completedCommands.current.length; i++) {
      if (completedCommands.current[i].timeshift > time.current) {
        current.current = completedCommands.current[i]
        next.current = scenarioSelector[i + 1]
        index.current = i
        completedCommands.current = completedCommands.current.filter(command => command.timeshift < time.current)
        break
      }
    }

    updateState()
    list.current.scrollTo(index.current)
    if (statusPlayer === 'play') {
      timer = setInterval(nextStepPlayScenario, 10)
      timerUpdateState = setInterval(updateState, 500)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(timer)
      clearInterval(timerUpdateState)
    }
  }, [])

  const setNewTime = (newTime) => {
    if (newTime > time.current) {
      clearInterval(timerUpdateState)
      clearInterval(timer)
      time.current = newTime
      setPlayerTime(newTime / 1000)
      updateState()
      timer = setInterval(nextStepPlayScenario, 10)
      timerUpdateState = setInterval(updateState, 500)
    } else {
      backTo(time.current - newTime)
    }
  }

  const updateState = () => {
    setTimeState(time.current)
    setCompletedCommandsState([...completedCommands.current])
  }

  const playAgainScenario = () => {
    time.current = 0
    index.current = 0
    setTimeState(0)
    setCompletedCommandsState([])
    completedCommands.current = []
    list.current.scrollTo(0)
    playScenario()
  }

  const exitOfThePreview = () => {
    clearInterval(timerUpdateState)
    clearInterval(timer)

    if (player.current) {
      player.current.pause()
      setPlayerTime(0)
    }
    scroll.current = true
    setIsScroll(true)
    time.current = 0
    current.current = null
    next.current = null
    index.current = 0
    completedCommands.current = []
    setStatusPlayer('')
    setIsShowPreview(false)
    setTimeState(0)
    setCompletedCommandsState([])
  }

  const setPlayerTime = (ms) => player.current ? player.current.currentTime = ms : false

  const scenarioRefs = useRef({
    scenario: null,
    player: null,
    scenarioContent: null,
    video: null
  })




  return (
    <>
      <Header />
      <RouteWrapper>
        <div className="scenario_route">
          <div ref={(element) => scenarioRefs.current.scenario = element} className="scenario">
            <TitleForRouteScreen name="scenario_title" className="scenario_title">
              {text.title}: {params.roomId}
            </TitleForRouteScreen>
            <ScenarioContent
              scenarioRefs={scenarioRefs}
              text={text}
              list={list}
              scrollContainer={scrollContainer}
              completedCommands={completedCommandsState}
              setIsShowPreview={setIsShowPreview}
              isShowPreview={isShowPreview}
              player={player}
              isScroll={isScroll}
              changeIsScroll={changeIsScroll}
              setShowPanel={setShowPanel}
              exitOfThePreview={exitOfThePreview}
            />
            {isShowPreview && <ScenarioPlayerControls
              playScenario={playScenario}
              pauseScenario={pauseScenario}
              playAgainScenario={playAgainScenario}
              statusPlayer={statusPlayer}
              forwardTo={forwardTo}
              backTo={backTo}
              currentTime={timeState}
              setNewTime={setNewTime}
              scenarioRefs={scenarioRefs}
            />}
          </div>
        </div>
      </RouteWrapper>
      <Footer className="scenario_route_footer" />
    </>
  )
}

export default Scenario
