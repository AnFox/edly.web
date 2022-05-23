import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  type: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string()
  }).required('Выберите тип команды'),
  userName: Yup.string().when(['type'], (type) => {
    if (type.value === 'postMessage') {
      return Yup.string().required()
    }
  }),
  content: Yup.string().when(['type'], (type) => {
    if (type.value === 'postMessage') {
      return Yup.string().required()
    }
  }),
  role: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string()
  }).when(['type'], (type) => {
    if (type.value === 'postMessage') {
      return Yup.object().shape({
        label: Yup.string().required('Выберите роль участника'),
        value: Yup.string().required('Выберите роль участника')
      })
    }
  }),
  bannerName: Yup.string().when(['type'], (type) => {
    if (type.value === 'banner') {
      return Yup.string().required()
    }
  }),
  urlImageBanner: Yup.string().when(['type'], (type) => {
    if (type.value === 'banner') {
      return Yup.string().required()
    }
  }),
  hrefBanner: Yup.string().when(['type'], (type) => {
    if (type.value === 'banner') {
      return Yup.string().required()
    }
  }),
  bannerId: Yup.string().when(['type'], (type) => {
    if (type.value === 'postBanner') {
      return Yup.string().required()
    }
  }),
  lockChat: Yup.string().when(['type'], (type) => {
    if (type.value === 'chatBlock' || type.value === 'chatUnblock') {
      return Yup.string().required()
    }
  }),
  presentationPage: Yup.number().when(['type'], (type) => {
    if (type.value === 'setCurrentSlide') {
      return Yup.number().required()
    }
  }),
  startStopWebinar: Yup.string().when(['type'], (type) => {
    if (type.value === 'startStream' || type.value === 'stopStream') {
      return Yup.string()
    }
  })
})

export default validationSchema
