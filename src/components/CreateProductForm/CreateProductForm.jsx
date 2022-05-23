import React, { useEffect, useRef } from 'react'
import './CreateProductForm.scss'
import PropTypes from 'prop-types'
import InputIcons from '../UI/InputIcons'
import { CloseIcon } from '../UI/Icons/Icons'
import Input from '../UI/Input'
import Button from '../UI/Button'
import ButtonBorder from '../UI/ButtonBorder'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createProduct, updateProduct } from '../../lib/admin/products/actions'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'

const text = {
  name: 'Название товара',
  // id: 'Идентификатор',
  idDescription: 'Только латинские буквы, цифры, знаки подчеркивания и тире.',
  idFirstWarn: 'При смене идентификатора изменятся все ссылки на покупку этого товара',
  idSecondWarn: 'Старые ссылки перестанут работать!',
  description: 'Описание',
  price: 'Цена',
  btnCreate: 'Создать',
  btnSave: 'Сохранить',
  btnCancel: 'Отмена'
}

const CreateProductForm = (props) => {
  const dispatch = useDispatch()
  const location = useLocation()

  const isEdit = () => location.pathname.includes('edit/product')

  const newProduct = (values) => {
    if (isEdit()) {
      dispatch(updateProduct(values.id, { ...values }))
    } else {
      dispatch(createProduct({ ...values })).then(newProduct => {
        if (props.onSuccessCallback) {
          props.onSuccessCallback(newProduct)
        }
      })
      formik.resetForm()
      closePopUp()
    }

  }

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      // id: Yup.string().required().test('id', text.idDescription, val => val && val.match(/^[\w\-]+$/g)),
      description: Yup.string().nullable(),
      price: Yup.number().positive().required()
    }),
    validateOnMount: true,
    onSubmit: (values) => {
      newProduct(values)
    }
  })

  const prevProduct = useRef({})

  useEffect(() => {
    if (props.product && JSON.stringify(props.product) !== JSON.stringify(prevProduct.current)) {
      prevProduct.current = props.product
      formik.setValues(props.product)
    }
  }, [props.product, formik])

  const clearInput = (name) => {
    formik.setFieldValue(name, '')
  }

  const closePopUp = () => {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  const clearForm = () => {
    formik.resetForm()
    closePopUp()
  }

  return (
    <form onSubmit={formik.handleSubmit} className={`create_product_form ${props.className}`}>
      <InputIcons
        name={'name'}
        title={true}
        titleText={text.name}
        icon={CloseIcon}
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        onClickIcon={() => clearInput('name')}
      />
      {/*<div className={`input_ui_main`}>*/}
      {/*  <div className="input_ui_title">{text.id}</div>*/}
      {/*  <div className={`input_ui_box`}>*/}
      {/*    <input*/}
      {/*      name={'id'}*/}
      {/*      type={'text'}*/}
      {/*      value={formik.values.id}*/}
      {/*      onChange={formik.handleChange}*/}
      {/*      onBlur={formik.handleBlur}*/}
      {/*      className={`input_ui_input input_ui_input_icon`}*/}
      {/*    />*/}
      {/*    <div*/}
      {/*      className="input_ui_icon"*/}
      {/*      onTouchStart={() => clearInput('id')}*/}
      {/*      onClick={() => clearInput('id')}*/}
      {/*    >*/}
      {/*      <CloseIcon />*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className={`input_ui_message input_ui_message_blue`}>{text.idDescription}</div>*/}
      {/*  <div className={`input_ui_message input_ui_message_red`}>{text.idFirstWarn}</div>*/}
      {/*  <div className={`input_ui_message input_ui_message_red`}>{text.idSecondWarn}</div>*/}
      {/*</div>*/}
      <div className={`input_ui_main`}>
        <div className="input_ui_title">{text.description}</div>
        <div className={'create_product_form_description'}>
          <textarea
            name={'description'}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input_ui_input`}
          />
          <CloseIcon onClick={() => clearInput('description')} />
        </div>
      </div>
      <Input
        name={'price'}
        className={'create_product_form_cost'}
        value={formik.values.price}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={'00.00 ₽'}
      />
      <div className="popup_ui_window_buttons_list">
        <Button
          type="submit"
          size="medium"
          color="blue"
          disabled={!!Object.keys(formik.errors).length}
          onClick={null}
        >
          {isEdit() ? text.btnSave : text.btnCreate}
        </Button>
        <ButtonBorder
          type="button"
          size="medium"
          color="blue"
          onClick={clearForm}
        >
          {text.btnCancel}
        </ButtonBorder>
      </div>
    </form>
  )
}

CreateProductForm.defaultProps = {
  className: ''
}

CreateProductForm.propTypes = {
  onCancel: PropTypes.func,
  className: PropTypes.string,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string
  }),
  onSuccessCallback: PropTypes.func
}

export default CreateProductForm
