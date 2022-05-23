import React, { useEffect, useRef, useState } from 'react'
import './RoomsList.scss'
import {
  Camera,
  Ellipsis,
  Href,
  Humans, Plus,
  Setting
} from '../UI/Icons/Icons'
import Button from '../UI/Button'
import ButtonBorder from '../UI/ButtonBorder'
import Input from '../UI/Input'
import '../UI/Input/input.scss'
import 'react-datepicker/dist/react-datepicker.css'
import PopUp from '../UI/PopUp'
import PaymentWindow from '../PopupPutInDeposit'
import PropTypes from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconQuestionMark from '../../assets/svg/questionmark.svg'
import FacebookPixelTooltip from '../../assets/img/fb_pixel_sample.png'
import { getAdminRooms } from '../../lib/admin/rooms/actions'
import {
  setAccountPixelSettings,
  unsetAccountPixelSettings
} from '../../lib/app/user/actions'
import Header from './Header'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Pagination from '../Pagination'
import PopUpAddRoom from '../PopUpAddRoom'
import PopUpAddWebinar from '../PopUpAddWebinar'
import WebinarStatusInRooms from '../WebinarStatusInRooms'

const HtmlTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#ffffff',
    maxWidth: 430,
    border: '1px solid #ffffff',
    boxShadow: '4px 16px 32px rgba(0, 0, 0, 0.16)',
    borderRadius: '10px'
  }
}))(Tooltip)

const RoomsList = (props) => {
  const { text } = props
  const history = useHistory()
  const [openPayment, setOpenPayment] = useState(false)
  const [optionMenuHeader, setOptionMenuHeader] = useState('rooms')
  const [popUpOpenHref, setPopUpOpenHref] = useState(false)
  const [popUpAddRoom, setPopUpAddRoom] = useState(false)
  const [popUpCreateWebinar, setPopUpCreateWebinar] = useState(false)
  const [popUpCopyRoom, setPopUpCopyRoom] = useState(false)
  const [popUpDeleteRoom, setPopUpDeleteRoom] = useState(false)
  // const [popUpEditDomain, setPopUpEditDomain] = useState(false)
  // const [domainForWebinar, setDomainForWebinar] = useState('')
  const [room, setRoom] = useState({})

  const [fbPixel, setFbPixel] = useState()
  const user = useSelector(state => state.app.user)
  const roomsListOwned = useSelector(state => state.admin?.rooms.rooms)
  const pagination = useSelector(state => state.admin?.rooms.pagination)
  const dispatch = useDispatch()

  useEffect(() => {

    const pixel = user.account?.fb_pixel || ''
    setFbPixel(pixel)

  }, [user])

  const copyRoom = (values) => {
    props.copyRoom(room.id, { slug: values.slug, name: values.nameRoom })
    setPopUpCopyRoom(false)
  }

  const deleteRoom = () => {
    props.deleteRoom(room.id)
    setPopUpDeleteRoom(false)
  }



  const generateIdCopyRoom = async () => {
    const slug = await props.generateId()
    formikCopyRoom.setFieldValue('slug', slug)
  }

  // const newDomain = () => {
  //   props.newDomain(domainForWebinar)
  //   setDomainForWebinar('')
  //   setPopUpEditDomain(false)
  // }

  const changeCopyRoom = () => {
    formikCopyRoom.setFieldValue('nameRoom', room.name)
    setPopUpCopyRoom(true)
  }

  const rangeHighlight = async () => {
    const doc = await document.querySelector('.input_highlight')
    doc.focus()
  }

  const showCopyAndDelete = (i) => {
    const doc = document.getElementById(`more_${i}`)
    if (doc.style.display !== 'block') {
      doc.style.display = 'block'
      doc.focus()
    } else {
      doc.style.display = 'none'
    }
  }

  const showCopyAndDeleteBlur = (i) => {
    const doc = document.getElementById(`more_${i}`)
    doc.style.display = 'none'
  }

  const eachRoom = (data, i) => {
    const isCanDelete = () => !data.webinars.find(webinar => webinar.finished_at)
    return (
      <div className="single_room" tabIndex={i} key={i} onClick={() => setRoom(data)}>
        <WebinarStatusInRooms webinars={data.webinars} typeId={data.type_id} />
        <div className="single_room_flex">
          <Link className="rooms_text single_room_flex_title" style={{ fontWeight: 'bold' }} to={`/rooms/${data.id}`}>{data.name}</Link>
          <div className="single_room_btn_more" onClick={() => showCopyAndDelete(i)}>
            <Ellipsis className="single_webinar_icon" />
            <div onBlur={() => showCopyAndDeleteBlur(i)} className="single_room_list_more" id={`more_${i}`} tabIndex={9 * i}>
              <div className="rooms_text single_room_list_more_btn" onClick={changeCopyRoom}>{text.more?.copyRoom}</div>
              {isCanDelete() && <div className="rooms_text single_room_list_more_btn" onClick={() => setPopUpDeleteRoom(true)}>{text.more?.deleteRoom}</div>}
            </div>
          </div>
        </div>

        <div className="rooms_text_small rooms_text_id rooms_text_id_margin">
          <span>{text.idWebinar}: {data.id}</span>
          <div className="rooms_text single_room_amount">
            <Humans className="single_webinar_icon" />
            <div className="rooms_text_small admin_notice" style={{ textAlign: 'left', paddingLeft: '20px' }}>
              {text.amountOnline}
            </div>
            {data.amountOnline}
          </div>
        </div>
        <div className="single_room_line" />
        <div className="single_room_buttons">
          <Link className="rooms_text single_room_btn" to={`/edit/room/${data.id}`}>
            <Setting className="single_webinar_icon" />
            {text.adminRooms?.settingRoom}
          </Link>
          <div className="rooms_text single_room_btn" onClick={() => { setPopUpOpenHref(true); rangeHighlight() }}>
            <Href className="single_webinar_icon" />
            {text.adminRooms?.hrefForUsers}
          </div>
          <ButtonBorder size="small" onClick={() => history.push(`/rooms/${data.id}`)}>
            <Camera />
            <span>Вебинары</span>
          </ButtonBorder>
          <div className="rooms_text single_room_buttons_add_webinar" onClick={() => setPopUpCreateWebinar(true)}>
            <ButtonBorder size="small">
              <Plus />
            </ButtonBorder>
            <span>Создать</span>
          </div>
          {/* <div className="rooms_text single_room_btn" onClick={() => data.webinars.length ? setPopUpDownloadMembers(true) : null}> */}
          {/*  <Download className="single_webinar_icon" /> */}
          {/*  {text.adminRooms?.downloadMembers} */}
          {/* </div> */}
        </div>
      </div>
    )
  }

  const input = useRef()

  const showRooms = () => roomsListOwned?.map(eachRoom)

  const formikCopyRoom = useFormik({
    initialValues: {
      nameRoom: '',
      slug: ''
    },
    validationSchema: Yup.object().shape({
      nameRoom: Yup.string().required('Введите название комнаты'),
      slug: Yup.string().required()
    }),
    onSubmit: values => {
      copyRoom(values)
    }
  })

  const goToPage = (currentPage) => dispatch(getAdminRooms(currentPage, pagination.per_page))

  const handlePageSizeChanged = (pageSize) => {
    dispatch(getAdminRooms(pagination.current_page, pageSize))
  }

  if (!user.id) {
    return <></>
  }

  return (
    <div className="rooms_main">
      <div className="rooms_title">{text.adminRooms?.title}</div>
      {user.owner && <Header setOptionMenuHeader={setOptionMenuHeader} optionMenuHeader={optionMenuHeader} text={text} user={user} roomsListLength={roomsListOwned.length} />}
      {optionMenuHeader === 'rooms' ? (
        <div className={'rooms_list'} >
          <div className="rooms_list_main_buttons">
            <Button
              disabled={user.account && user.account.is_limited}
              onClick={() => setPopUpAddRoom(true)}
              color="blue"
              size="medium"
              label="Создать комнату"
              className="rooms_list_btn"
            />
            {user.account && user.account.is_limited && (
              <React.Fragment>
                <Button onClick={() => setOpenPayment(true)} size="medium" className="rooms_list_btn" color="green" label="Пополнить счет" />
                {openPayment ? <PaymentWindow hide={() => setOpenPayment(false)} accept={props.refillAccount} /> : null}
              </React.Fragment>
            )}
          </div>
          {user.account && user.account.is_limited && (
            <div className="rooms_text rooms_list_limited_message" style={{ marginBottom: '10px' }}>{text.adminRooms?.limitedMessage}</div>
          )}
          {!roomsListOwned ? (
            <div className="rooms_text rooms_list_text_options">
              {text.adminRooms.emptyRoomsMessage?.title}
              <br />
              <br />
              {text.adminRooms.emptyRoomsMessage?.subtitle}
            </div>
          ) : (
            <div className="rooms_list_flex">
              {showRooms()}
            </div>
          )}
          {(pagination && roomsListOwned.length) ? <Pagination
            setPerPage={handlePageSizeChanged}
            goToPage={goToPage}
            perPage={pagination.per_page}
            from={pagination.from}
            currentPage={pagination.current_page}
            total={pagination.total}
            to={pagination.to}
            dropDownList={[8, 16, 32]}
          /> : null}
        </div>
      ) : <></>}
      {optionMenuHeader === 'domain' && user.account ? (
        <div className="domain_and_parameters">
          {/* <div className="domain_and_parameters_title">домен для вебинаров</div>
          <div className="domain_and_parameters_flex">
            <input disabled={true} placeholder="Домен не задан. Используется Example.com" type="text" className="input_text domain_and_parameters_input" />
            <button className="btn-primary rooms_btn" onClick={() => setPopUpEditDomain(true)}>Изменить домен</button>
          </div> */}
          <div className="domain_and_parameters_title">
            facebook pixel
            <HtmlTooltip
              placement="bottom-start"
              title={
                <React.Fragment>
                  <img src={FacebookPixelTooltip} alt="Facebook pixel sample" />
                </React.Fragment>
              }
            >
              <img className="title_icon_right" src={IconQuestionMark} alt="Facebook pixel sample preview button" />
            </HtmlTooltip>
          </div>
          <div className="domain_and_parameters_flex">
            <input name="fb_pixel" value={fbPixel} onChange={e => setFbPixel(e.target.value)} placeholder="ID вашего приложения в Facebook" type="text" className="input_text domain_and_parameters_input" />
            {!user.account.fb_pixel && <Button size="big" color="blue" onClick={() => dispatch(setAccountPixelSettings(fbPixel))} label={text.adminRooms?.parameters?.fbButton} />}
            {user.account.fb_pixel && <Button size="big" color="red" onClick={() => dispatch(unsetAccountPixelSettings())} label={text.adminRooms?.parameters?.fbDeleteButton} />}
            <div style={{ marginBottom: '30px', maxWidth: '500px' }} className="rooms_admin_alert_label_info">{text.adminRooms?.parameters?.fbText}</div>
          </div>
        </div>
      ) : <></>}
      <PopUpAddRoom popUpAddRoom={popUpAddRoom} setPopUpAddRoom={setPopUpAddRoom} />
      <PopUp
        show={popUpCopyRoom}
        disableScroll={true}
        showButtonAccept={false}
        showButtonCancel={false}
        title={`${text.popUpCopyRoom?.title} ${room.id}`}
        closePopUp={() => setPopUpCopyRoom(false)}
      >
        <form className="popup_copy_room" onSubmit={formikCopyRoom.handleSubmit}>
          <div className="rooms_admin_alert_input_title">{text.popUpCopyRoom?.inputIdRoomTitle}</div>
          <div className="rooms_admin_alert_copy_delete_flex_margin">
            <input name="slug" placeholder="Например, room_1" value={formikCopyRoom.values.slug} onChange={formikCopyRoom.handleChange} type="text" className="input_text rooms_admin_alert_input" />
            <button type="button" className="btn_border btn_border_rooms" onClick={generateIdCopyRoom}>{text.buttonGenerate}</button>
          </div>
          <div className="rooms_text rooms_admin_alert_copy_text">{text.popUpCopyRoom?.text}</div>
          <Input
            name="nameRoom"
            title={true}
            value={formikCopyRoom.values.nameRoom}
            onChange={formikCopyRoom.handleChange}
            titleText="Название комнаты"
            showError={true}
            errorText={formikCopyRoom.errors.nameRoom}
            classNameInput="rooms_admin_alert_input"
          />
          <div className="popup_ui_window_buttons_list">
            <Button
              type="submit"
              size="medium"
            >
              {text.popUpCopyRoom?.buttonCopyRoom}
            </Button>
            <ButtonBorder
              type="button"
              onClick={() => setPopUpCopyRoom(false)}
              size="medium"
            >
              {text.popUpButtonCancel}
            </ButtonBorder>
          </div>
        </form>
      </PopUp>
      <PopUp
        show={popUpDeleteRoom}
        disableScroll={true}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptType="fill"
        buttonCancelType="border"
        buttonAcceptColor="red"
        buttonCancelColor="blue"

        buttonAcceptLabel={text.popUpDeleteRoom?.buttonDeleteRoom}
        buttonCancelLabel={text.popUpButtonCancel}
        onAccept={deleteRoom}
        onCancel={() => setPopUpDeleteRoom(false)}
        title={text.popUpDeleteRoom?.title}
        closePopUp={() => setPopUpDeleteRoom(false)}
      >
        <div className="rooms_text"><b>{text.popUpDeleteRoom?.subtitle} {room.id}</b></div>
        <br />
        <div className="rooms_text rooms_admin_alert_copy_text" dangerouslySetInnerHTML={{ __html: `${text.popUpDeleteRoom?.text}` }} />
      </PopUp>
      <PopUp
        show={popUpOpenHref}
        disableScroll={true}
        showButtonCancel={true}
        buttonCancelType="fill"
        buttonCancelSize="medium"
        buttonCancelColor="blue"
        buttonCancelLabel={text.popUpOpenHref?.closeButton}
        onCancel={() => setPopUpOpenHref(false)}
        title={text.popUpOpenHref?.title}
        closePopUp={() => setPopUpOpenHref(false)}
      >
        <div className="rooms_admin_alert_input_title">{text.popUpOpenHref?.inputHrefTitle}</div>
        <div className="rooms_admin_alert_copy_delete_flex_margin" style={{ alignItems: 'flex-start' }}>
          <div className="rooms_admin_alert_open_href">
            <input ref={input} onFocus={() => input.current.select()} placeholder="https://..." defaultValue={room.url} type="text" className="input_text rooms_admin_alert_input input_highlight" />
            <div className="rooms_admin_alert_label_info">{text.popUpOpenHref?.inputHrefSubtitle}</div>
          </div>
          <button className="btn_border btn_border_rooms" id="btn_margin_top" onClick={() => { rangeHighlight(); setTimeout(() => document.execCommand('copy'), 100) }}>{text.popUpOpenHref?.buttonCopyClipboard}</button>
        </div>
        <div className="rooms_text rooms_admin_alert_copy_text">
          {text.popUpOpenHref?.text}
        </div>
      </PopUp>
      <PopUpAddWebinar
        room={room} context={'ROOMS_LIST'}
        setPopUpAddWebinar={setPopUpCreateWebinar}
        popUpAddWebinar={popUpCreateWebinar}
      />
      {/* {popUpEditDomain && (
        <>
          <div className="rooms_admin_background" />
          <div className="rooms_admin_alert_wrap" style={{ position: 'fixed' }} >
            <div className="rooms_admin_alert_window">
              <div className="rooms_admin_alert_window_header">
                <div>Изменение домена</div>
                <svg className="close_setting_icon rooms_admin_alert_window_close_icon" onClick={() => setPopUpEditDomain(false)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="close_setting_icon_path" d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z" fill="#222B45" />
                </svg>
              </div>
              <div className="rooms_admin_alert_input_title">укажите ваш домен</div>
              <div className="rooms_admin_alert_edit_room_margin">
                <input placeholder="Например, room_1" value={domainForWebinar} onChange={(e) => setDomainForWebinar(e.target.value)} type="text" className="input_text rooms_admin_alert_input" />
              </div>
              <div style={{ marginBottom: '30px' }} className="rooms_admin_alert_label_info">{"Индивидуальные ссылки, генерируемые в письмах шорткодом {{WEBINAR}}, будут направлять на указанный домен вместо start.course-platform.com."}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button disabled={domainForWebinar === ''} className="btn-primary rooms_btn alert_btn_create_room" onClick={() => newDomain()}>Сохранить</button>
                <button className="btn_border btn_border_rooms" onClick={() => setPopUpEditDomain(false)}>Отмена</button>
              </div>
            </div>
          </div>
        </>
      )} */}
    </div>
  )
}

RoomsList.propTypes = {
  copyRoom: PropTypes.func.isRequired,
  deleteRoom: PropTypes.func.isRequired,
  generateId: PropTypes.func.isRequired,
  newDomain: PropTypes.func.isRequired,
  refillAccount: PropTypes.func.isRequired,
  text: PropTypes.object.isRequired
}

export default RoomsList
