import React, { useEffect, useState } from 'react'
import Input from '../UI/Input'
import DatePicker, { registerLocale } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import { Calendar, CloseIcon, Magnifier } from '../UI/Icons/Icons'
import './FindWindow.scss'
import Button from '../UI/Button'

const text = {
  searchButtonCaption: 'Найти'
}

const FindWindow = (props) => {
  const [showCalendar, setShowCalendar] = useState(false)
  useEffect(() => { registerLocale('ru', ru) }, [])
  const showChangeCalendar = () => {
    setShowCalendar(true)
    const calendar = document.getElementById('payments_calendar')
    calendar.focus()
  }
  return (
    <div className="find_window_header">
      <div className="find_window_header_input_main">
        <div className="find_window_header_input">
          <Input
            title={false}
            showError={false}
            classNameInput="input_ui_input_icon"
            value={props.findText}
            placeholder={props.text.findInput}
            onChange={props.inputKeyPress}
            onKeyPress={props.inputKeyPress}
          />
          <div className="find_window_header_input_icon">
            <Magnifier onClick={props.find} />
          </div>
        </div>

        <div className="find_window_header_input_subtitle">
          {props.text.findInputSubtitle}
        </div>
      </div>
      <div className="find_window_header_date">
        <div className="find_window_relative">{props.text.period}&nbsp;<b>{props.startDate?.toLocaleDateString()} — {props.endDate?.toLocaleDateString()}</b> <Calendar onClick={showChangeCalendar} />
          <div className="find_window_calendar_picker" id="payments_calendar" style={{ display: `${showCalendar ? 'flex' : 'none'}` }} tabIndex={679}>
            <div className="date-picker-container">
              <div>
                <div className="find_window_header_date_label">{props.text.startPeriod}</div>
                <DatePicker
                  selected={props.startDate}
                  onChange={date => props.setDate(date, true)}
                  selectsStart
                  startDate={props.startDate}
                  endDate={props.endDate}
                  dateFormat="dd/MM/yyyy"
                  className="calendar_input"
                  locale="ru"
                />
              </div>
              <div>
                <div className="find_window_header_date_label">{props.text.endPeriod}</div>
                <DatePicker
                  selected={props.endDate}
                  onChange={date => props.setDate(date, false)}
                  selectsEnd
                  startDate={props.startDate}
                  endDate={props.endDate}
                  minDate={props.startDate}
                  dateFormat="dd/MM/yyyy"
                  className="calendar_input"
                  locale="ru"
                />
              </div>
            </div>

            <CloseIcon className="find_window_calendar_picker_close_icon" onClick={() => setShowCalendar(false)} />
          </div>
        </div>
        <div className="find_window_search_action_container">
          <Button size="medium" type="submit" onClick={props.find} className="find_window_search_button_container" label={text.searchButtonCaption} />
          {props.text.findResult}: <b>{props.count}</b>
        </div>
      </div>
    </div>
  )
}

export default FindWindow
