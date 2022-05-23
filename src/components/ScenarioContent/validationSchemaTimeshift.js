import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  hours: Yup.number().when(['minutes', 'seconds', 'ms'], {
    is: (minutes, seconds, ms) => minutes || seconds || ms,
    then: Yup.number(),
    otherwise: Yup.number().required()
  }),
  minutes: Yup.number().when(['hours', 'seconds', 'ms'], {
    is: (hours, seconds, ms) => hours || seconds || ms,
    then: Yup.number(),
    otherwise: Yup.number().required()
  }),
  seconds: Yup.number().when(['minutes', 'hours', 'ms'], {
    is: (minutes, hours, ms) => minutes || hours || ms,
    then: Yup.number(),
    otherwise: Yup.number().required()
  }),
  ms: Yup.number().when(['minutes', 'hours', 'seconds'], {
    is: (minutes, hours, seconds) => minutes || hours || seconds,
    then: Yup.number(),
    otherwise: Yup.number().required()
  }),
}, [
  ['ms', 'seconds', 'minutes'],
  ['ms', 'seconds', 'hours'],
  ['ms', 'minutes', 'seconds'],
  ['ms', 'minutes', 'hours'],
  ['ms', 'hours', 'minutes'],
  ['ms', 'hours', 'seconds'],

  ['seconds', 'ms', 'minutes'],
  ['seconds', 'ms', 'hours'],
  ['seconds', 'seconds', 'ms'],
  ['seconds', 'seconds', 'hours'],
  ['seconds', 'hours', 'ms'],
  ['seconds', 'hours', 'minutes'],

  ['minutes', 'seconds', 'hours'],
  ['minutes', 'seconds', 'ms'],
  ['minutes', 'ms', 'seconds'],
  ['minutes', 'ms', 'hours'],
  ['minutes', 'hours', 'ms'],
  ['minutes', 'hours', 'seconds'],

  ['hours', 'ms', 'seconds'],
  ['hours', 'ms', 'minutes'],
  ['hours', 'seconds', 'ms'],
  ['hours', 'seconds', 'minutes'],
  ['hours', 'minutes', 'ms'],
  ['hours', 'minutes', 'seconds']
])

export default validationSchema
