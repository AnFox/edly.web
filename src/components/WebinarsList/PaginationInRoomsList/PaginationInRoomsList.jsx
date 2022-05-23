import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Pagination from '../../Pagination'
import PropTypes from 'prop-types'
import { getWebinarsVisited } from '../../../lib/app/webinars/actions'
import { getWebinars } from '../../../lib/admin/webinars/actions'

const PaginationInRoomsList = (props) => {
  const dispatch = useDispatch()
  const ownerPagination = useSelector(state => state.admin.webinars.pagination)
  const userPagination = useSelector(state => state.app.webinars.pagination)
  const user = useSelector(state => state.app.user)
  const handlePageSizeChangedOwner = (pageSize) => {
    dispatch(getWebinars(props.roomsId, props.dropDownValue, ownerPagination.current_page, pageSize))
  }
  const handlePageSizeChangedUser = (pageSize) => {
    dispatch(getWebinarsVisited(userPagination.current_page, pageSize, props.dropDownValue))
  }

  const goToPageOwner = (currentPage) => dispatch(getWebinars(props.roomsId, props.dropDownValue, currentPage, ownerPagination.per_page))
  const goToPageUser = (currentPage) => dispatch(getWebinarsVisited(currentPage, ownerPagination.per_page, props.dropDownValue))

  const showUserPagination = () => (
    userPagination?.total ? <Pagination
      setPerPage={handlePageSizeChangedUser}
      goToPage={goToPageUser}
      perPage={userPagination.per_page}
      from={userPagination.from}
      currentPage={userPagination.current_page}
      total={userPagination.total}
      to={userPagination.to}
      dropDownList={[8, 16, 32]}
    /> : null
  )

  return (
    <>
      {user.owner ? (props.dropDownValue === 'viewed' ? (
        showUserPagination()
      ) : (
        ownerPagination?.total ? <Pagination
          setPerPage={handlePageSizeChangedOwner}
          goToPage={goToPageOwner}
          perPage={ownerPagination.per_page}
          from={ownerPagination.from}
          currentPage={ownerPagination.current_page}
          total={ownerPagination.total}
          to={ownerPagination.to}
          dropDownList={[8, 16, 32]}
        /> : null
      )
      ) : (
        showUserPagination()
      )}
    </>
  )
}

PaginationInRoomsList.propTypes = {
  dropDownValue: PropTypes.string.isRequired,
  roomsId: PropTypes.string
}

export default PaginationInRoomsList
