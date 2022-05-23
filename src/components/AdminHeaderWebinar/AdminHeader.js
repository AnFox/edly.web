import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Setting from '../RoomSetting'
import {
  Flag,
  Play,
  CameraOnlyStream,
  CameraTopLeft,
  CameraTopRight,
  CameraBottomRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  OutIcon,
  Ellipsis,
  Unlock,
  Lock
} from '../UI/Icons/Icons'
import { Link, useParams } from 'react-router-dom'
import '../CommonStyles/CommonStylesWebinar.scss'
import './AdminHeader.scss'
import { useDispatch, useSelector } from 'react-redux'
import { finishWebinar, startWebinar , webinarSetVideoPosition } from '../../lib/admin/rooms/actions'
import {
  blockChatForEveryone,
  unblockChatForEveryone,
} from '../../lib/app/chat/actions'
import { roomClearSlides } from '../../lib/admin/slides/actions'
import PopUp from '../UI/PopUp'
import webinarIsStarted from '../../utils/webinarIsStarted'
import RightMenu from './RightMenu'
import { WebinarTypeTabsInChat } from '../../dict/webinar'
import Button from '../UI/Button'
import { webinarChangeTabChat } from '../../lib/app/webinar/actions'

const AdminHeader = (props) => {
  const [cameraMenu, setCameraMenu] = useState(false)
  const params = useParams()
  const dispatch = useDispatch()
  const webinar = useSelector(state => state.app.webinar[props.webinarId] || {})
  const webinarOwner = useSelector(state => state.admin.webinars.currentWebinar[props.webinarId] || {})
  const [showPopUpRecord, setShowPopUpRecord] = useState(false)
  const [showClearChatPopUp, setShowClearChatPopUp] = useState(false)
  const [redirectPopUp, setRedirectPopUp] = useState(false)
  const [redirectAfterPopUp, setRedirectAfterPopUp] = useState(false)
  const [redirectURLForPopUp, setRedirectURLForPopUp] = useState('')
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])

  const showMore = (className) => {
    const more = document.querySelector(className)
    more.style.display = more.style.display ? '' : 'block'
  }

  const changeChatTab = (tab, container) => {
    dispatch(webinarChangeTabChat(webinar.id, tab))
    showMore(container)
  }

  const changeRecord = (flag) => {
    const webinarData = {
      is_recordable: flag
    }
    setShowPopUpRecord(false)
    dispatch(startWebinar(webinar.id, webinarData))
  }

  const handleWebinarStart = () => {
    // if (room.request_record && webinar.request_record) {
    if (!webinarOwner.is_recordable) {
      dispatch(startWebinar(webinar.id))
    } else {
      if (room.request_record) {
        setShowPopUpRecord(true)
      } else {
        dispatch(startWebinar(webinar.id))
      }
    }
  }

  const handleWebinarFinish = () => {
    dispatch(finishWebinar(webinar.id))
  }

  const clearChat = () => {
    setShowClearChatPopUp(false)
  }

  const outRoom = () => {
    props.authLogout()
  }
  // ниже клики на иконки
  // const choicePresent = () => {
  //
  // }
  const refresh = () => {

  }
  const onYouTube = () => {

  }
  const blockChat = (bool) => {
    return bool ? dispatch(blockChatForEveryone(webinar.chat_id)) : dispatch(unblockChatForEveryone(webinar.chat_id))
  }

  const redirectToURL = () => {
    // Перенаправить зрителя на...
    if (redirectURLForPopUp !== '') {
      setRedirectPopUp(false)
      setRedirectAfterPopUp(true)
    }
  }

  const [showMenu, setShowMenu] = useState(false)

  const showSetting = (open) => {
    const targetElement = document.getElementById('setting_window')
    const fon = document.getElementById('fon_mob_setting')
    if (open === true) {
      targetElement.style.display = 'block'
      fon.style.display = 'block'
      fon.style.position = 'fixed'
      fon.style.height = '100%'
      // fon.style.height = `${document.getElementById('root').scrollHeight}px`
    } else {
      targetElement.style.display = 'none'
      fon.style.display = 'none'
    }
  }

  const getCameraIcon = () => {
    const layout = webinar.presentation?.layout
    switch (layout) {
    case 'top-left':
      return <CameraTopLeft />
    case 'top-right':
      return <CameraTopRight />
    case 'bottom-right':
      return <CameraBottomRight />
    case 'center':
      return <CameraOnlyStream />
    default:
      return <CameraOnlyStream />
    }
  }

  useEffect(() => {
    return () => dispatch(roomClearSlides({ roomId: params.roomId }))
  },[dispatch])



  function webinarStartStopControl () {
    if (!webinar.finished_at) {
      return <>
        {webinar.starts_at === null ||
        !webinarIsStarted(webinar) ? (
            <button className="button_webinar button_webinar_green"
              onClick={handleWebinarStart}>
              <Play/>
            Начать вебинар
            </button>
          ) : (
            <button className="button_webinar button_webinar_yellow"
              onClick={handleWebinarFinish}>
              <Flag/>
            Закончить вебинар
            </button>
          )}
      </>
    }
  }

  const changeVideoPosition = (status) => {
    webinarSetVideoPosition(webinar.id, status)
  }

  return (
    <>
      {!webinar.finished_at && <Setting optionWindow={'webinar'} webinarId={props.webinarId} showSetting={showSetting}/>}
      <PopUp
        show={redirectPopUp}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptLabel='Перенаправить'
        buttonCancelLabel='Отмена'
        onAccept={redirectToURL}
        onCancel={() => setRedirectPopUp(false)}
        title='Подтвердите'
        closePopUp={() => setRedirectPopUp(false)}
      >
        <div className="admin_header_popup">
          <div className="alert_label">Перенаправить зрителей на
              адрес:
          </div>
          <input style={{
            width: '90%',
            height: '40px',
            minWidth: '0',
            marginTop: '10px'
          }} className="input_text" type="text"
          value={redirectURLForPopUp}
          onChange={(e) => setRedirectURLForPopUp(
            e.target.value)}/>
        </div>
      </PopUp>
      <PopUp
        show={showClearChatPopUp}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptLabel='Очистить'
        buttonCancelLabel='Отмена'
        buttonAcceptColor='red'
        onAccept={clearChat}
        onCancel={() => setShowClearChatPopUp(false)}
        title='Подтвердите'
        closePopUp={() => setShowClearChatPopUp(false)}
      >
        <div className="admin_header_popup">
          <div className="alert_label">Очистить весь чат?</div>
        </div>
      </PopUp>
      <PopUp
        show={redirectAfterPopUp}
        showButtonAccept={true}
        showButtonCancel={false}
        buttonAcceptLabel='Закрыть'
        onAccept={() => setRedirectAfterPopUp(false)}
        title='Подтверждение'
        closePopUp={() => setRedirectAfterPopUp(false)}
      >
        <div className="admin_header_popup">
          <div className="alert_label">
            Зрители были перенаправлены<br/>
            на страницу {redirectURLForPopUp}
          </div>
        </div>
      </PopUp>
      <PopUp
        show={showPopUpRecord}
        onCancel={() => changeRecord(false)}
        onAccept={() => changeRecord(true)}
        showButtonCancel={true}
        showButtonAccept={true}
        buttonAcceptLabel={'Да'}
        buttonCancelLabel={'Нет'}
        closePopUp={() => setShowPopUpRecord(false)}
        title={'Подтвердите'}
      >
        <div className="popup_record">
          <div>Включить запись сценария этого вебинара?</div>
          <span>Внимание! Если для этой комнаты уже есть сценарий, то новый заменит его.</span>
        </div>
      </PopUp>
      <div className="admin_room_header" id="webinar_header">
        <div className="admin_room_header_up">
          <Link className="btn_back_to_rooms"
            style={{ textDecoration: 'none' }} to="/rooms">
            <ArrowLeft style={{ width: '21px' }} />
            <span>Комнаты</span>
          </Link>
          <div
            className="webinar_header_title">{webinar.name}</div>
          <div className="admin_header_out">
            <div
              style={{ textAlign: 'right' }}>{props.user.first_name}</div>
            <div className="admin_header_out_button"
              onClick={() => outRoom()}>
              <div>
                Выйти
              </div>
              <OutIcon className="room_header_icon" />
            </div>
          </div>
        </div>
        <div className="admin_room_header_navigation">
          <div className="admin_room_header_navigation_left_buttons">
            {!webinar.finished_at
              && <div className="btn-primary admin_room_btn"
                onClick={() => showSetting(true)}>
                <svg className="room_header_setting_icon" width="24"
                  height="24" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.61028 22C8.1223 21.9971 7.64849 21.8357 7.26028 21.54L5.19028 20C4.71259 19.6276 4.39563 19.0863 4.30451 18.4875C4.21338 17.8887 4.355 17.2777 4.70028 16.78C4.88297 16.5102 4.99907 16.201 5.03905 15.8777C5.07903 15.5543 5.04176 15.2261 4.93028 14.92L4.87028 14.76C4.79266 14.4829 4.65079 14.228 4.45619 14.0161C4.26158 13.8041 4.01974 13.641 3.75028 13.54H3.59028C3.00615 13.3436 2.52309 12.9247 2.24599 12.3742C1.96889 11.8237 1.92012 11.1862 2.11028 10.6L2.93028 8C3.00576 7.69876 3.14474 7.41713 3.33789 7.17396C3.53105 6.93078 3.77393 6.73169 4.05028 6.59C4.30763 6.4574 4.58921 6.3784 4.87798 6.35777C5.16674 6.33715 5.45669 6.37533 5.73028 6.47C6.02816 6.57025 6.34602 6.59624 6.65624 6.5457C6.96645 6.49516 7.25962 6.36962 7.51028 6.18L7.64028 6.08C7.86717 5.89895 8.05055 5.6693 8.17689 5.40796C8.30323 5.14663 8.36932 4.86027 8.37028 4.57V4.33C8.36759 3.71813 8.60673 3.12997 9.03563 2.69358C9.46453 2.25719 10.0485 2.00791 10.6603 2H13.2103C13.508 2.0008 13.8025 2.0604 14.0771 2.17538C14.3517 2.29036 14.6009 2.45845 14.8103 2.67C15.2506 3.11779 15.4951 3.72202 15.4903 4.35V4.63C15.4852 4.90575 15.545 5.17884 15.6649 5.42723C15.7847 5.67562 15.9613 5.89237 16.1803 6.06L16.2903 6.14C16.5147 6.3083 16.7765 6.41984 17.0534 6.46511C17.3302 6.51039 17.6139 6.48805 17.8803 6.4L18.2203 6.29C18.5083 6.19451 18.8127 6.15802 19.1152 6.1827C19.4176 6.20737 19.712 6.29272 19.9808 6.43364C20.2496 6.57456 20.4872 6.76817 20.6796 7.00292C20.8719 7.23767 21.015 7.50876 21.1003 7.8L21.8903 10.32C22.0731 10.9024 22.0231 11.533 21.7509 12.0793C21.4786 12.6256 21.0053 13.0452 20.4303 13.25L20.2303 13.32C19.9361 13.4163 19.6701 13.5834 19.4556 13.8066C19.2412 14.0298 19.0848 14.3022 19.0003 14.6C18.9207 14.8768 18.9018 15.1675 18.945 15.4523C18.9881 15.7371 19.0923 16.0092 19.2503 16.25L19.5103 16.63C19.8551 17.1304 19.9954 17.7438 19.9024 18.3444C19.8094 18.945 19.4902 19.4872 19.0103 19.86L17.0003 21.41C16.7574 21.5957 16.4792 21.7297 16.1826 21.8039C15.886 21.878 15.5774 21.8906 15.2757 21.8409C14.9741 21.7913 14.6858 21.6804 14.4286 21.5152C14.1714 21.3499 13.9508 21.1337 13.7803 20.88L13.6603 20.71C13.4965 20.4639 13.273 20.2632 13.0107 20.1268C12.7484 19.9904 12.4558 19.9227 12.1603 19.93C11.8783 19.9373 11.6019 20.0108 11.3535 20.1445C11.1051 20.2783 10.8916 20.4686 10.7303 20.7L10.5003 21.03C10.3297 21.2855 10.1086 21.5034 9.85067 21.6702C9.59269 21.8371 9.30328 21.9493 9.00028 22C8.87059 22.0127 8.73997 22.0127 8.61028 22ZM4.40028 11.62C4.96497 11.8214 5.4745 12.1525 5.88788 12.5867C6.30125 13.0209 6.60692 13.5461 6.78028 14.12V14.24C6.99621 14.8366 7.06712 15.4761 6.98713 16.1055C6.90715 16.735 6.67857 17.3363 6.32028 17.86C6.25704 17.9299 6.22201 18.0208 6.22201 18.115C6.22201 18.2092 6.25704 18.3001 6.32028 18.37L8.47028 20C8.49833 20.022 8.53077 20.0378 8.56542 20.0463C8.60007 20.0547 8.63613 20.0557 8.67118 20.049C8.70623 20.0424 8.73945 20.0284 8.76861 20.0078C8.79778 19.9873 8.82222 19.9608 8.84028 19.93L9.07028 19.6C9.41717 19.0988 9.88042 18.6891 10.4203 18.4062C10.9602 18.1232 11.5607 17.9754 12.1703 17.9754C12.7798 17.9754 13.3803 18.1232 13.9202 18.4062C14.4601 18.6891 14.9234 19.0988 15.2703 19.6L15.3903 19.78C15.4333 19.841 15.4974 19.8838 15.5703 19.9C15.6037 19.9049 15.6377 19.903 15.6704 19.8944C15.7031 19.8859 15.7336 19.8707 15.7603 19.85L17.8203 18.29C17.8924 18.2328 17.9398 18.1501 17.9529 18.0589C17.9659 17.9678 17.9435 17.8751 17.8903 17.8L17.6303 17.42C17.2915 16.926 17.068 16.3622 16.9763 15.7703C16.8845 15.1783 16.9269 14.5734 17.1003 14C17.276 13.3974 17.5939 12.8458 18.0272 12.3916C18.4605 11.9374 18.9966 11.5939 19.5903 11.39L19.7903 11.32C19.8736 11.2866 19.9404 11.2216 19.976 11.1392C20.0116 11.0567 20.0131 10.9636 19.9803 10.88L19.2003 8.39C19.1816 8.34643 19.1542 8.30713 19.1198 8.27446C19.0854 8.2418 19.0447 8.21647 19.0003 8.2C18.9708 8.18507 18.9383 8.17728 18.9053 8.17728C18.8723 8.17728 18.8397 8.18507 18.8103 8.2L18.4703 8.31C17.8951 8.49982 17.2825 8.54712 16.685 8.44783C16.0875 8.34855 15.5231 8.10564 15.0403 7.74L15.0003 7.65C14.537 7.29912 14.1613 6.84561 13.9028 6.32509C13.6442 5.80456 13.5099 5.23119 13.5103 4.65V4.34C13.5121 4.24362 13.4762 4.15033 13.4103 4.08C13.3527 4.02801 13.2778 3.99946 13.2003 4H10.6603C10.6195 4.00254 10.5797 4.01311 10.5431 4.03109C10.5064 4.04906 10.4737 4.0741 10.4467 4.10476C10.4198 4.13542 10.3992 4.1711 10.386 4.20976C10.3729 4.24841 10.3676 4.28927 10.3703 4.33V4.58C10.3703 5.17704 10.2333 5.76612 9.9698 6.30185C9.70627 6.83758 9.32326 7.30565 8.85028 7.67L8.72028 7.77C8.21001 8.15851 7.61201 8.41553 6.97898 8.51842C6.34594 8.62131 5.69732 8.5669 5.09028 8.36C5.04486 8.34476 4.9957 8.34476 4.95028 8.36C4.89384 8.39429 4.85134 8.44741 4.83028 8.51L4.00028 11.12C3.97135 11.2089 3.97813 11.3056 4.01918 11.3895C4.06024 11.4735 4.13236 11.5382 4.22028 11.57L4.40028 11.62Z"
                    fill="white"/>
                  <path
                    d="M12 15.5C11.3078 15.5 10.6311 15.2947 10.0555 14.9101C9.47993 14.5256 9.03133 13.9789 8.76642 13.3394C8.50152 12.6999 8.4322 11.9961 8.56725 11.3172C8.7023 10.6383 9.03564 10.0146 9.52513 9.52513C10.0146 9.03564 10.6383 8.7023 11.3172 8.56725C11.9961 8.4322 12.6999 8.50152 13.3394 8.76642C13.9789 9.03133 14.5256 9.47993 14.9101 10.0555C15.2947 10.6311 15.5 11.3078 15.5 12C15.5 12.9283 15.1313 13.8185 14.4749 14.4749C13.8185 15.1313 12.9283 15.5 12 15.5ZM12 10.5C11.7033 10.5 11.4133 10.588 11.1666 10.7528C10.92 10.9176 10.7277 11.1519 10.6142 11.426C10.5007 11.7001 10.4709 12.0017 10.5288 12.2926C10.5867 12.5836 10.7296 12.8509 10.9393 13.0607C11.1491 13.2704 11.4164 13.4133 11.7074 13.4712C11.9983 13.5291 12.2999 13.4994 12.574 13.3858C12.8481 13.2723 13.0824 13.08 13.2472 12.8334C13.412 12.5867 13.5 12.2967 13.5 12C13.5 11.6022 13.342 11.2206 13.0607 10.9393C12.7794 10.658 12.3978 10.5 12 10.5Z"
                    fill="white"/>
                </svg>
                Настройки
              </div>}


            {webinarStartStopControl()}

            {/* <svg className="btn_volume" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> */}
            {/*  <path className="btn_volume_path" d="M18.2805 8.37C  18.1134 8.16313 17.871 8.03111 17.6065 8.00298C17.3421 7.97485 17.0773 8.05292 16.8705 8.22C16.6636 8.38709 16.5316 8.62951 16.5035 8.89394C16.4753 9.15836 16.5534 9.42313 16.7205 9.63C17.2257 10.3169 17.4982 11.1473 17.4982 12C17.4982 12.8527 17.2257 13.6831 16.7205 14.37C16.6013 14.517 16.5262 14.6947 16.504 14.8827C16.4818 15.0706 16.5133 15.261 16.595 15.4317C16.6767 15.6024 16.8052 15.7464 16.9654 15.847C17.1257 15.9476 17.3112 16.0006 17.5005 16C17.6499 16.0005 17.7975 15.9675 17.9325 15.9035C18.0674 15.8395 18.1864 15.746 18.2805 15.63C19.0737 14.5861 19.5031 13.3111 19.5031 12C19.5031 10.6889 19.0737 9.41392 18.2805 8.37Z" fill="#222B45"/> */}
            {/*  <path className="btn_volume_path" d="M19.6398 5.23C19.5387 5.14595 19.422 5.08265 19.2964 5.04369C19.1708 5.00474 19.0388 4.99091 18.9079 5.00298C18.777 5.01505 18.6497 5.05279 18.5333 5.11405C18.417 5.17531 18.3139 5.25888 18.2298 5.36C18.1458 5.46112 18.0825 5.5778 18.0435 5.70338C18.0046 5.82897 17.9907 5.96099 18.0028 6.09192C18.0149 6.22285 18.0526 6.35012 18.1139 6.46647C18.1751 6.58281 18.2587 6.68595 18.3598 6.77C19.1618 7.38987 19.8151 8.18121 20.2719 9.08611C20.7287 9.99101 20.9774 10.9866 20.9998 12C20.9774 13.0134 20.7287 14.009 20.2719 14.9139C19.8151 15.8188 19.1618 16.6101 18.3598 17.23C18.2585 17.3139 18.1748 17.417 18.1135 17.5334C18.0521 17.6497 18.0143 17.777 18.0023 17.908C17.9902 18.039 18.0041 18.1711 18.0431 18.2967C18.0822 18.4223 18.1456 18.5389 18.2298 18.64C18.3238 18.7529 18.4416 18.8437 18.5747 18.9059C18.7077 18.9681 18.8529 19.0002 18.9998 19C19.2335 19.0005 19.4599 18.9191 19.6398 18.77C20.6702 17.9644 21.507 16.9381 22.0885 15.7665C22.6699 14.5949 22.9814 13.3078 22.9998 12C22.9814 10.6922 22.6699 9.40511 22.0885 8.23351C21.507 7.06191 20.6702 6.03557 19.6398 5.23Z" fill="#222B45"/> */}
            {/*  <path className="btn_volume_path" d="M14.9995 3.12C14.8475 3.03223 14.6751 2.98602 14.4995 2.98602C14.324 2.98602 14.1516 3.03223 13.9995 3.12L7.51953 7.57H2.51953C2.25431 7.57 1.99996 7.67535 1.81242 7.86289C1.62489 8.05043 1.51953 8.30478 1.51953 8.57V15.43C1.51953 15.6952 1.62489 15.9496 1.81242 16.1371C1.99996 16.3246 2.25431 16.43 2.51953 16.43H7.51953L13.9295 20.83C14.0994 20.9399 14.2972 20.9989 14.4995 21C14.7647 21 15.0191 20.8946 15.2066 20.7071C15.3942 20.5196 15.4995 20.2652 15.4995 20V4C15.502 3.8221 15.457 3.64676 15.3691 3.49207C15.2812 3.33738 15.1536 3.20894 14.9995 3.12ZM13.5295 18.12L8.39953 14.6C8.23117 14.4868 8.03238 14.4275 7.82953 14.43H3.49953V9.57H7.82953C8.03238 9.57246 8.23117 9.51317 8.39953 9.4L13.4995 5.9L13.5295 18.12Z" fill="#222B45"/> */}
            {/* </svg> */}
            <div className="admin_room_header_camera" onClick={() => webinar.presentation ? setCameraMenu(!cameraMenu) : null }>
              {getCameraIcon()}
              {cameraMenu ? <ArrowUp/> : <ArrowDown/>}
              <div className="admin_room_header_camera_menu" style={{ display: cameraMenu ? 'block' : 'none' }}>
                <div className="admin_room_header_camera_menu_btn" onClick={() => changeVideoPosition('video-only')}>
                  <CameraOnlyStream />
                  <div>Только трансляция</div>
                </div>
                <div className="admin_room_header_camera_menu_btn" onClick={() => changeVideoPosition('top-left')}>
                  <CameraTopLeft />
                  <span>Презентация + видео в левом верхнем углу</span>
                </div>
                <div className="admin_room_header_camera_menu_btn" onClick={() => changeVideoPosition('top-right')}>
                  <CameraTopRight />
                  <span>Презентация + видео в правом верхнем углу</span>
                </div>
                <div className="admin_room_header_camera_menu_btn" onClick={() => changeVideoPosition('bottom-right')}>
                  <CameraBottomRight />
                  <span>Презентация + видео в правом нижнем углу</span>
                </div>
              </div>
            </div>
          </div>
          <div/>
          <div className="admin_room_header_navigation_right_buttons">
            <Button onClick={() => showMore('.header_clear_and_redirect')} className="button_webinar btn_more">
              <Ellipsis className="btn_more_icon" />
            </Button>
            <div className="header_clear_and_redirect">
              {/*<Button size="small" onClick={() => props.setShowClearChatPopUp(true)}>Очистить чат</Button>*/}
              {/*<Button size="small" onClick={() => props.setRedirectPopUp(true)}>Перенаправить на URL...</Button>*/}
              <Button size="small" className="button_webinar" onClick={() => changeChatTab(WebinarTypeTabsInChat.PRODUCTS, '.header_clear_and_redirect')}>Переключить на товары</Button>
            </div>
            {/*<div className="btn-primary admin_room_btn btn_more" onClick={() => showMore(0)}>*/}
            {/*    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
            {/*        <path*/}
            {/*          d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"*/}
            {/*          fill="white"/>*/}
            {/*        <path*/}
            {/*          d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"*/}
            {/*          fill="white"/>*/}
            {/*        <path*/}
            {/*          d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"*/}
            {/*          fill="white"/>*/}
            {/*    </svg>*/}
            {/*</div>*/}
            {!webinar.chat_enabled ? (
              <Button size="small" color="green" className="admin_room_btn btn_block_chat" onClick={() => blockChat(false)}>
                <Lock />
                Разблокировать чат
              </Button>
            ) : (
              <Button size="small" color="yellow" className="admin_room_btn btn_block_chat" onClick={() => blockChat(true)}>
                <Unlock />
                Заблокировать чат
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="admin_room_header_mobile">
        <div/>
        <div className="webinar_header_title">{webinar.name}</div>
        <div className="menu_button_mobile"
          onClick={() => setShowMenu(true)}>
          <svg className="menu_icon" width="32" height="32"
            viewBox="0 0 32 32" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path className="menu_icon_path"
              d="M26.7333 14.6667H5.26667C4.56711 14.6667 4 15.2338 4 15.9333V16.0667C4 16.7662 4.56711 17.3333 5.26667 17.3333H26.7333C27.4329 17.3333 28 16.7662 28 16.0667V15.9333C28 15.2338 27.4329 14.6667 26.7333 14.6667Z"
              fill="#222B45"/>
            <path className="menu_icon_path"
              d="M26.7333 21.3333H5.26667C4.56711 21.3333 4 21.9004 4 22.6V22.7333C4 23.4329 4.56711 24 5.26667 24H26.7333C27.4329 24 28 23.4329 28 22.7333V22.6C28 21.9004 27.4329 21.3333 26.7333 21.3333Z"
              fill="#222B45"/>
            <path className="menu_icon_path"
              d="M26.7333 8H5.26667C4.56711 8 4 8.56711 4 9.26667V9.4C4 10.0996 4.56711 10.6667 5.26667 10.6667H26.7333C27.4329 10.6667 28 10.0996 28 9.4V9.26667C28 8.56711 27.4329 8 26.7333 8Z"
              fill="#222B45"/>
          </svg>
        </div>
      </div>

      <RightMenu
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        webinarStartStopControl={webinarStartStopControl}
        outRoom={outRoom}
        openHelp={props.openHelp}
        showSetting={showSetting}
        cameraMenu={cameraMenu}
        setCameraMenu={setCameraMenu}
        getCameraIcon={getCameraIcon}
        refresh={refresh}
        changeVideoPosition={changeVideoPosition}
        onYouTube={onYouTube}
        blockChat={blockChat}
        setShowClearChatPopUp={setShowClearChatPopUp}
        setRedirectPopUp={setRedirectPopUp}
        showMore={showMore}
        changeChatTab={changeChatTab}
        webinarId={props.webinarId}
      />
    </>
  )
}

AdminHeader.propTypes = {
  authLogout: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  openHelp: PropTypes.func.isRequired,
  webinarId: PropTypes.number.isRequired
}

export default AdminHeader
