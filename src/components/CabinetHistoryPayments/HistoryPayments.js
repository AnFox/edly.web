import React, { useEffect, useState } from 'react'
import FindWindowHeader from '../FindWindowHeader'
import Pagination from '../Pagination'
import 'react-datepicker/dist/react-datepicker.css'
import { CircleFailed, CirclePending, CircleSuccess } from '../UI/Icons/Icons'
import './HistoryPayments.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAccountOrders,
  searchAccountOrders
} from '../../lib/app/orders/actions'

const text = {
  findInput: 'Искать',
  findInputSubtitle: '№ платежа или статус',
  findResult: 'Найдено',
  period: 'Период',
  unit: 'руб.',
  draft: 'В ожидании',
  success: 'Выполнен',
  pending: 'В ожидании',
  canceled: 'Отменен',
  failed: 'Не выполнен',
  startPeriod: 'Начало периода',
  endPeriod: 'Конец периода',
  paginationLabel: 'Заказов на странице'
}

const HistoryPayments = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAccountOrders())
  }, [dispatch])
  const orders = useSelector(state => state.app.orders)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const [findText, setFindText] = useState('')
  const [perPage, setPerPage] = useState(8)
  const getStatus = (status) => {
    switch (status) {
    case 'draft': return (<div className="history_payments_single_payment_status"><CirclePending className="history_payments_single_payment_icon"/> {text.draft}</div>)
    case 'pending': return (<div className="history_payments_single_payment_status"><CirclePending className="history_payments_single_payment_icon"/> {text.pending}</div>)
    case 'paid': return (<div className="history_payments_single_payment_status"><CircleSuccess className="history_payments_single_payment_icon"/> {text.success}</div>)
    case 'canceled': return (<div className="history_payments_single_payment_status"><CircleFailed className="history_payments_single_payment_icon"/> {text.canceled}</div>)
    case 'failed': return (<div className="history_payments_single_payment_status"><CircleFailed className="history_payments_single_payment_icon"/> {text.failed}</div>)
    default: return null
    }
  }
  const eachPayments = (data, i) => {
    const date = new Date(data.date)
    return (
      <div className="history_payments_single_payment" key={i}>
        <div className="history_payments_single_payment_id_type">
          <div><span><b>№&nbsp;{data.id}</b></span>&nbsp;&nbsp;<span className="history_payments_single_payment_id_type_date">{date ? (`${date.toLocaleDateString()} ${date.toLocaleTimeString().substr(0, 5)}`) : ''}</span></div>
          <div>{data.type}</div>
        </div>
        <div><b>{data.price} {text.unit}</b></div>
        {getStatus(data.status)}
      </div>
    )
  }

  const setDate = (date, start) => {
    if (start) {
      setStartDate(date)
    } else {
      setEndDate(date)
    }
  }

  const findPayment = () => {
    const dateStart = startDate ? new Date(startDate).toISOString() : null
    const dateEnd = endDate ? new Date(endDate).toISOString() : null

    dispatch(searchAccountOrders(findText, dateStart, dateEnd))
  }

  const inputKeyPress = (e) => {
    if (e.shiftKey && e.charCode === 13) { return true }
    if (e.charCode === 13) {
      e.preventDefault()
      findPayment()
      return false
    }
    setFindText(e.target.value)
  }

  const showHistory = () => orders.items ? orders.items.map(eachPayments) : []

  const { pagination } = orders

  const goToPage = (currentPage) => {
    const dateStart = startDate ? new Date(startDate).toISOString() : null
    const dateEnd = endDate ? new Date(endDate).toISOString() : null

    dispatch(searchAccountOrders(findText, dateStart, dateEnd, currentPage, perPage))
  }

  const handlePageSizeChanged = (pageSize) => {
    setPerPage(pageSize)
    const dateStart = startDate ? new Date(startDate).toISOString() : null
    const dateEnd = endDate ? new Date(endDate).toISOString() : null

    dispatch(searchAccountOrders(findText, dateStart, dateEnd, pagination.current_page, perPage))
  }
  return (
    <div className="history_payments">
      <FindWindowHeader
        findText={findText}
        inputKeyPress={inputKeyPress}
        find={findPayment}
        startDate={startDate}
        endDate={endDate}
        setDate={setDate}
        text={text}
        count={pagination?.total}
      />
      <div className="history_payments_list">
        {showHistory()}
      </div>
      {pagination &&
          <Pagination
            label={text.paginationLabel}
            setPerPage={handlePageSizeChanged}
            goToPage={goToPage}
            perPage={perPage}
            from={pagination?.from}
            currentPage={pagination?.current_page}
            total={pagination?.total}
            to={pagination?.to}
            dropDownList={[8, 16, 32]}
          />
      }
    </div>
  )
}

export default HistoryPayments
