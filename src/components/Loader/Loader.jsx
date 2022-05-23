import React, { memo } from 'react'
import cx from 'classnames'
import CircularProgress from '@material-ui/core/CircularProgress'
import './Loader.scss'
import { useSelector } from 'react-redux'

const Loader = () => {
  const loader = useSelector(state => state.app.loader)

  const isActive = (loader && loader.counter > 0)

  return (
    <div className={cx('b-loader-container', {
      'b-loader_state_hidden': !isActive,
      'b-loader_state_visible': isActive,
    })}
    >
      <div className={cx('b-loader')}>
        <CircularProgress/>
      </div>
    </div>
  )
}

export default memo(Loader)
