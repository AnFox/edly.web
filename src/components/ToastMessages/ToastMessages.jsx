import React, { useEffect, useRef } from 'react'
import './ToastMessages.scss'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { clearMessage } from '../../lib/app/alertbar/actions'
import { useDispatch } from 'react-redux'

const ToastMessages = (props) => {
  const toastId = useRef([])
  const dispatch = useDispatch()


  useEffect(() => {
    const onClose = (text) => {
      dispatch(clearMessage(text))
      toastId.current = toastId.current.filter(toast => toast !== text)
    }

    for (let text of props.alertBarMessages) {
      if (!toastId.current.find(message => message === text)) {
        toastId.current.push(toast[props.alertBarType](text, { onClose: () => onClose(text), autoClose: props.alertBarDuration, toastId: text }))
      }
    }
  }, [dispatch, props])



  return <ToastContainer />
}

ToastMessages.defaultProps = {
  alertBarDuration: 10000
}

ToastMessages.propTypes = {
  alertBarType: PropTypes.oneOf(['error', 'info', 'done', '']).isRequired,
  alertBarDuration: PropTypes.number,
  alertBarMessages: PropTypes.array
}

ToastMessages.displayName = 'ToastMessages'

export default ToastMessages
