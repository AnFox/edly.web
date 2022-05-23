import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

const TimeshiftInputsForm = (props) => {
  const checkInput = (rightInput, value, leftInput) => {
    const rInput = document.getElementsByName(rightInput)
    const lInput = document.getElementsByName(leftInput)
    if (value.toString().length >= 2 && rInput.length) {
      rInput[0].focus()
    } else {
      if (value === '' && lInput.length) {
        lInput[0].focus()
      }
    }
  }

  useEffect(() => {
    checkInput('minutes',props.formik.values.hours)
  }, [props.formik.values.hours])

  useEffect(() => {
    checkInput('seconds', props.formik.values.minutes, 'hours')
  }, [props.formik.values.minutes])

  useEffect(() => {
    checkInput('ms', props.formik.values.seconds, 'minutes')
  }, [props.formik.values.seconds])

  useEffect(() => {
    checkInput(undefined, props.formik.values.ms, 'seconds')
  }, [props.formik.values.ms])

  return (
    <div className="scenario_content_popup_timeshift_list">
      <input
        name="hours"
        placeholder="ЧЧ"
        value={props.formik.values.hours}
        maxLength={2}
        pattern="^\d*"
        onChange={props.formik.handleChange}
        className="input_ui_input"/>
      <input
        name="minutes"
        placeholder="ММ"
        pattern="^\d*"
        value={props.formik.values.minutes}
        maxLength={2}
        onChange={props.formik.handleChange}
        className="input_ui_input"/>
      <input
        name="seconds"
        placeholder="СС"
        pattern="^\d*"
        value={props.formik.values.seconds}
        maxLength={2}
        onChange={props.formik.handleChange}
        className="input_ui_input"/>
      <input
        name="ms"
        placeholder="МС"
        pattern="^\d*"
        value={props.formik.values.ms}
        maxLength={3}
        onChange={props.formik.handleChange}
        className="input_ui_input"/>
    </div>
  )
}

TimeshiftInputsForm.propTypes = {
  formik: PropTypes.shape({
    values: PropTypes.shape({
      hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      minutes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      seconds: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ms: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    handleChange: PropTypes.func.isRequired
  })
}

export default TimeshiftInputsForm
