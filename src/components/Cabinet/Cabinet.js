import React, { useState } from 'react'
import { Card, History, Profile as ProfileIcon } from '../UI/Icons/Icons'
import './Cabinet.scss'
import Profile from '../CabinetProfile'
import Balance from '../CabinetBalance'
import HistoryPayments from '../CabinetHistoryPayments'

const text = {
  title: 'Личный кабинет',
  profile: 'Профиль',
  balance: 'Баланс',
  historyPayments: 'История платежей'
}
const Cabinet = () => {
  const [open, setOpen] = useState([true, false, false])
  const setWindow = (index) => {
    let temp = [...open]
    for(let i = 0; i < temp.length; i++){
      temp[i] = i === index
    }
    setOpen(temp)
  }
  return(
    <div className="cabinet">
      <div className="cabinet_title">{text.title}</div>
      <div className="cabinet_content">
        <div className="cabinet_content_nav_menu">
          <div onClick={() => setWindow(0)} className={`cabinet_content_nav_menu_option ${open[0] ? 'cabinet_content_nav_menu_option_selected' : ''}`}><ProfileIcon />{text.profile}</div>
          <div onClick={() => setWindow(1)} className={`cabinet_content_nav_menu_option ${open[1] ? 'cabinet_content_nav_menu_option_selected' : ''}`}><Card />{text.balance}</div>
          <div onClick={() => setWindow(2)} className={`cabinet_content_nav_menu_option ${open[2] ? 'cabinet_content_nav_menu_option_selected' : ''}`}><History />{text.historyPayments}</div>
        </div>
        {open[0] ? <Profile /> : null}
        {open[1] ? <Balance /> : null}
        {open[2] ? <HistoryPayments /> : null}
      </div>
    </div>
  )
}

export default Cabinet
