import React, { useState } from 'react'
import PopUp from '../UI/PopUp'
import { CircleSuccess, CirclePending, CircleFailed, Ellipsis } from '../UI/Icons/Icons'
import Pagination from '../Pagination'
import FindWindow from '../FindWindowHeader'
import RadioButton from '../UI/RadioButton'
import './Orders.scss'

const text = {
  unit: 'руб.',
  findInput: 'Искать',
  findInputSubtitle: '№, статус, эл. почта, ФИО, телефон',
  findResult: 'Найдено заказов',
  statusPending: 'В ожидании',
  statusFailed: 'Не выполнен',
  statusSuccess: 'Выполнен',
  popUpChangeOrder: {
    PopUpTitle: 'Изменить статус заказа',
    popUpAcceptButton: 'Изменить',
    popUpCancelButton: 'Отмена',
  },
  popUpDeleteOrder: {
    popUpTitle: 'Подтвердите',
    popUpSubtitle: 'Вы собираетесь удалить заказ №',
    popUpAcceptButton: 'Удалить',
    popUpCancelButton: 'Отмена',
  },

  subMenu: {
    changeStatus: 'Изменить статус',
    delete: 'Удалить заказ'
  }
}
const Orders = () => {
  const [findText, setFindText] = useState('')
  const [startDate, setStartDate] = useState(new Date("2020/05/19"))
  const [endDate, setEndDate] = useState(new Date())
  const [openPopUp, setOpenPopUp] = useState(false)
  const [currentOrder, setCurrentOrder] = useState()
  const [statusOrder, setStatusOrder] = useState()
  const [zaglushka, setZaglushka] = useState([
    {
      id: 65532,
      name: 'Регистрация на курс',
      date: new Date(),
      user_name: 'Василий',
      user_email: 'example@gmail.com',
      user_phone: '+38 (093) 111-11-11',
      cost: 1200,
      status: 'pending'
    },
    {
      id: 65532,
      name: 'Регистрация на курс',
      date: new Date(),
      user_name: 'Василий',
      user_email: 'example@gmail.com',
      user_phone: '+38 (093) 111-11-11',
      cost: 1200,
      status: 'failed'
    },
    {
      id: 65532,
      name: 'Регистрация на курс',
      date: new Date(),
      user_name: 'Василий',
      user_email: 'example@gmail.com',
      user_phone: '+38 (093) 111-11-11',
      cost: 1200,
      status: 'success'
    }
  ])

  const findOrders = () => {
    let body = { text: findOrders }
  }

  const setPerPage = (perPage) => {
    // установить кол-во для отображения
  }

  const goToPage = (currentPage) => {
    // установить страницу
  }

  const changeOrderStatus = () => {
    let data = {
      id_order: currentOrder.id,
      status: statusOrder
    }
    clearVariable()
  }

  const deleteOrder = () => {
    let data = {
      id_order: currentOrder.id,
    }
    clearVariable()
  }

  const clearVariable = () => {
    setCurrentOrder()
    setStatusOrder()
    setOpenPopUp(false)
  }

  const setDate = (date, start) => {
    if(start){
      setStartDate(date)
    } else {
      setEndDate(date)
    }
  }

  const inputKeyPress = (e) => {
    if (e.shiftKey && e.charCode === 13) { return true }
    if (e.charCode === 13) {
      e.preventDefault()
      findOrders()
      return false
    }
    setFindText(e.target.value)
  }

  const getStatus = (status) => {
    switch(status) {
    case 'pending':
      return(<><CirclePending className="orders_single_order_icon" /> {text.statusPending}</>)
    case 'success':
      return(<><CircleSuccess className="orders_single_order_icon" /> {text.statusSuccess}</>)
    case 'failed':
      return(<><CircleFailed className="orders_single_order_icon" /> {text.statusFailed}</>)
    default:
      return null
    }
  }

  const showSubMenu = (i) => {
    let doc = document.getElementsByClassName('orders_single_order_sub_menu')
    if(doc[i].style.display !== 'block'){
      doc[i].style.display = 'block'
      doc[i].focus()
    } else {
      doc[i].style.display = 'none'
    }
  }

  const showSubMenuBlur = (i) => {
    let doc = document.getElementsByClassName('orders_single_order_sub_menu')
    doc[i].style.display = 'none'
  }

  const eachOrder = (data, i) => {
    return(
      <div className="orders_text orders_single_order">
        <div className="orders_single_order_column">
          <div><b>№ {data.id}</b></div>
          <div>{data.name}</div>
          <div>{data.date ? (`${data.date.toLocaleDateString()} ${data.date.toLocaleTimeString().substr(0, 5)}`) : ''}</div>
        </div>
        <div className="orders_single_order_column">
          <div><b>{data.user_name}</b></div>
          <div>{data.user_email}</div>
          <div>{data.user_phone}</div>
        </div>
        <div className="orders_single_order_columns">
          <div className="price">
            <div><b>{data.cost} {text.unit}</b></div>
          </div>
          <div className="orders_single_order_column status">
            {getStatus(data.status)}
          </div>
        </div>

        <Ellipsis className="orders_single_order_menu" onClick={() => showSubMenu(i)}/>
        <div onBlur={() => showSubMenuBlur(i)} className="orders_single_order_sub_menu" tabIndex={2*i} >
          <div onClick={() => { setOpenPopUp('changeOrder'); setCurrentOrder(data) }}>{text.subMenu.changeStatus}</div>
          <div onClick={() => { setOpenPopUp('deleteOrder'); setCurrentOrder(data) }}>{text.subMenu.delete}</div>
        </div>
      </div>
    )
  }
  const showOrders = () => zaglushka && zaglushka.map(eachOrder)
  return(
    <div className="orders">
      <FindWindow
        text={text}
        findText={findText}
        inputKeyPress={inputKeyPress}
        startDate={startDate}
        endDate={endDate}
        setDate={setDate}
        count={3}
        find={findOrders}
      />
      <div className="orders_list">
        {showOrders()}
      </div>
      <Pagination
        setPerPage={setPerPage}
        goToPage={goToPage}
        perPage={8}
        from={5}
        currentPage={5}
        total={18}
        to={18}
        dropDownList={[8, 16, 32]}
      />
      {/* <Button onClick={() => setOpenPopUp(true)} label="Показать окно"/> */}
      <PopUp
        show={openPopUp === 'changeOrder'}
        title={text.popUpChangeOrder.PopUpTitle}
        disableScroll={false}
        closePopUp={() => setOpenPopUp(false)}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptType="fill"
        buttonAcceptSize="medium"
        buttonAcceptColor="blue"
        buttonAcceptLabel={text.popUpChangeOrder.popUpAcceptButton}
        onAccept={changeOrderStatus}
        buttonCancelType="border"
        buttonCancelSize="medium"
        buttonCancelColor="blue"
        buttonCancelLabel={text.popUpChangeOrder.popUpCancelButton}
        onCancel={() => setOpenPopUp(false)}
      >
        <div className="orders_radio_button_list">
          <RadioButton
            controll={true}
            selected={statusOrder === 'access'}
            onSelect={() => setStatusOrder('access')}
            label={text.statusSuccess}
          />
          <RadioButton
            controll={true}
            selected={statusOrder === 'pending'}
            onSelect={() => setStatusOrder('pending')}
            label={text.statusPending}
          />
          <RadioButton
            controll={true}
            selected={statusOrder === 'failed'}
            onSelect={() => setStatusOrder('failed')}
            label={text.statusFailed}
          />
        </div>
      </PopUp>
      <PopUp
        show={openPopUp === 'deleteOrder'}
        title={text.popUpDeleteOrder.popUpTitle}
        disableScroll={false}
        closePopUp={() => setOpenPopUp(false)}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptType="fill"
        buttonAcceptSize="medium"
        buttonAcceptColor="red"
        buttonAcceptLabel={text.popUpDeleteOrder.popUpAcceptButton}
        onAccept={deleteOrder}
        buttonCancelType="border"
        buttonCancelSize="medium"
        buttonCancelColor="blue"
        buttonCancelLabel={text.popUpDeleteOrder.popUpCancelButton}
        onCancel={() => setOpenPopUp(false)}
      >
        {currentOrder
          ? <div className="order_delete_popup orders_text">
            <div><b>{text.popUpDeleteOrder.popUpSubtitle}&nbsp;{currentOrder.id}</b></div>
            <div>
              <p>
                {currentOrder.name}<br/>{currentOrder.date ? `${currentOrder.date.toLocaleDateString()} ${currentOrder.date.toLocaleTimeString().substr(0, 5)}` : ''}
              </p>
            </div>
            <div>
              <p>

                {currentOrder.user_name}
                <br />
                {currentOrder.user_email}
                <br />
                {currentOrder.user_phone}
              </p>
            </div>
            <div>{currentOrder.cost}&nbsp;{text.unit}</div>
          </div>
          : null}
      </PopUp>
    </div>
  )
}

export default Orders
