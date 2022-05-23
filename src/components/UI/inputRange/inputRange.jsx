import React from 'react'
import './inputRange.scss'
import './scss/index.scss'
import PropTypes from 'prop-types'
import InputRangeCustom from 'react-input-range'

/*
value = {value} = for 1 argument
value = {min, max} = for 2 argument
 */

const InputRange = (props) => {

  return (
    <div className={`input-range-ui ${props.className}`}>
      <InputRangeCustom
        formatLabel={(() => null)}
        maxValue={props.maxValue}
        minValue={props.minValue}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  )
}

InputRange.defaultProps = {
  className: ''
}

InputRange.propTypes = {
  maxValue: PropTypes.number.isRequired,
  minValue: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ min: PropTypes.number, max: PropTypes.number })
  ])
}

export default InputRange
