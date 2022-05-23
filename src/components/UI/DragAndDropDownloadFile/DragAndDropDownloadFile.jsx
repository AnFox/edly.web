import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import './DragAndDropDownloadFile.scss'
import { File } from '../Icons/Icons'
import { useDispatch } from 'react-redux'
import { alertbarShow } from '../../../lib/app/alertbar/actions'
import LinearProgress from '@material-ui/core/LinearProgress'

/*
  id = string, required
  maxSize = number, mB
  label, labelLeave = message for user, string
  accept = for assigned file type in input, string
  onLoadEnd = func
  progress = number
 */

const DragAndDropDownloadFile = (props) => {
  const [text, setText] = useState('')
  const [fileInfo, setFileInfo] = useState({ name: '', size: 0 })
  const [loader, setLoader] = useState(false)
  const [progress, setProgress] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    setLoader(props.loader)
    setProgress(props.progress)
  }, [props])

  const loadFile = (e) => {
    e.preventDefault()
    const dropZone = document.querySelector('.drag_and_drop_ui_box')
    dropZone.classList.toggle('drag_and_drop_ui_box_active')
    const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0]

    if (!file) {
      return false
    }
    if (file.size > 1024 * 1024 * props.maxSize) {
      dispatch(alertbarShow({ type: 'error', messages: [`Размер загружемого файла не более ${props.maxSize} Мб`] }))
      setText(props.label)
    } else if (props.accept.includes(file.type)) {
      setFileInfo({ name: file.name, size: +(file.size / 1024).toFixed(1) })
      props.onLoadEnd(file)
      document.getElementById(props.id).value = ''
    } else {
      dispatch(alertbarShow({ type: 'error', messages: ['Неверный формат файла'] }))
      setText(props.label)
    }
  }

  useEffect(() => setText(props.label), [props.label])

  const AddDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    loadFile(e)
  }

  const AddDragEnter = (event) => {
    if (!props.disabled) {
      const dropZone = document.querySelector('.drag_and_drop_ui_box')
      dropZone.classList.toggle('drag_and_drop_ui_box_active')
      event.preventDefault()
      event.stopPropagation()
      setText(props.labelLeave)
    }
  }

  const AddDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const AddDragLeave = (event) => {
    if (!props.disabled) {
      const dropZone = document.querySelector('.drag_and_drop_ui_box')
      dropZone.classList.toggle('drag_and_drop_ui_box_active')
      event.preventDefault()
      event.stopPropagation()
      setText(props.label)
    }
  }

  return (
    <div className="drag_and_drop_ui" onClick={() => document.getElementById(`${props.id}`).click()}>
      <input disabled={props.disabled} style={{ display: 'none' } } id={props.id} type="file" accept={props.accept} onChange={(e) => loadFile(e)} />
      <div
        onDragEnter={(e) => AddDragEnter(e)}
        onDragLeave={(e) => AddDragLeave(e)}
        onDragOver={(e) => AddDragOver(e)}
        onDrop={(e) => AddDrop(e)}
        className="drag_and_drop_ui_box"
      >
        {loader ? (
          <div className="drag_and_drop_ui_box_loader">
            <File className="drag_and_drop_ui_box_loader_header_icon" />
            <div className="drag_and_drop_ui_box_loader_header">
              <div className="drag_and_drop_ui_box_loader_header_text_name">{fileInfo.name}</div>
              <div className="drag_and_drop_ui_box_loader_header_text_size">{fileInfo.size} Кб</div>
            </div>
            <div className="drag_and_drop_ui_box_loader_footer">
              <LinearProgress variant="determinate" value={progress} />
            </div>
          </div>
        ) : text}
      </div>
    </div>
  )
}

DragAndDropDownloadFile.defaultProps = {
  maxSize: 5,
  fileType: []
}

DragAndDropDownloadFile.propTypes = {
  id: PropTypes.string.isRequired,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  label: PropTypes.string,
  labelLeave: PropTypes.string,
  onLoadEnd: PropTypes.func,
  loader: PropTypes.bool,
  progress: PropTypes.number,
  disabled: PropTypes.bool
}

export default DragAndDropDownloadFile
