import React, { useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight } from '../UI/Icons/Icons'
import { usePagination } from '@material-ui/lab/Pagination'
import PropTypes from 'prop-types'
import './Pagination.scss'

/*
   label = string, default = "Элементов на странице"
   setPerPage = func, получает число для кол-ва Элементов на странице
   goToPage = func, получает число для перехода на страницу
   perPage = int кол-во Элементов на странице
   total = кол-во страниц
   currentPage = int, текущая страница
   dropDownList={[8, 16, 32]} - для настройки чисел выпадающего списка
*/

const UsePagination = (props) => {
  const setPage = (event, value) => {
    props.goToPage(value)
  }
  const { items } = usePagination({
    count: Math.ceil(props.total / props.perPage),
    onChange: setPage,
    page: props.currentPage
  })
  return (
    <nav>
      <ul className="pagination_nav pagination_nav_list">
        {items.map(({ page, type, selected, ...item }, index) => {
          let children

          if (type === 'start-ellipsis' || type === 'end-ellipsis') {
            children = '…'
          } else if (type === 'page') {
            children = (
              <button className="pagination_text pagination_nav_list_single number" type="button" style={{ color: selected ? '#3366FF' : undefined }} {...item}>
                {page}
              </button>
            )
          } else {
            children = type === 'previous' ? (
              <button className="pagination_text pagination_nav_list_single" type="button" {...item}>
                <ArrowLeft className="pagination_icon" />
              </button>
            ) : (
              <button className="pagination_text pagination_nav_list_single" type="button" {...item}>
                <ArrowRight className="pagination_icon" />
              </button>
            )
          }

          return <li key={index} className="pagination_text">{children}</li>
        })}
      </ul>
    </nav>
  )
}

UsePagination.propTypes = {
  perPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  goToPage: PropTypes.func
}

const Pagination = (props) => {
  const setPerPage = (perPage) => {
    props.setPerPage(perPage)
    setShowDropDown(false)
  }

  const eachList = (data, i) => {
    return (
      <div key={i} onClick={() => setPerPage(data)} className="pagination_per_page_dropdown_list_single">{data}</div>
    )
  }

  const [showDropDown, setShowDropDown] = useState(false)

  const showDropList = async () => {
    setShowDropDown(true)
    const doc = await document.getElementsByClassName('pagination_per_page_dropdown_list')
    doc[0].focus()
  }

  const showDropdownList = () => props.dropDownList && props.dropDownList.map(eachList)

  return (
    <div className="pagination">
      <div className="pagination_text pagination_per_page">
        {props.label || 'Элементов на странице'}:&nbsp;<b>{props.perPage}</b>
        <ArrowDown className="pagination_icon" onClick={showDropList} />

        <div onBlur={() => setShowDropDown(false)} className="pagination_per_page_dropdown_list" style={{ display: `${showDropDown ? 'block' : 'none'}` }} id="dropdown_list" tabIndex={4}>
          {showDropdownList()}
        </div>

      </div>
      {props.dropDownList && props.total >= props.dropDownList[0]
        ? <UsePagination perPage={props.perPage} total={props.total} currentPage={props.currentPage} goToPage={props.goToPage} />
        : null
      }

    </div>
  )
}

Pagination.propTypes = {
  perPage: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  goToPage: PropTypes.func,
  label: PropTypes.string,
  dropDownList: PropTypes.array,
  setPerPage: PropTypes.func
}

export default Pagination
