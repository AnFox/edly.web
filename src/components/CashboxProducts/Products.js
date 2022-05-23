import React, { useEffect, useState } from 'react'
import './Products.scss'
import Button from '../UI/Button'
import { useDispatch, useSelector } from 'react-redux'
import { Ellipsis, Href } from '../UI/Icons/Icons'
import { Link } from 'react-router-dom'
import Pagination from '../Pagination'
import PopUp from '../UI/PopUp'
import Input from '../UI/Input'
import '../UI/InputIcons/input.scss'
import ButtonBorder from '../UI/ButtonBorder'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { copyProduct, deleteProduct, getProducts } from '../../lib/admin/products/actions'
import CreateProductForm from '../CreateProductForm'

const text = {
  unit: 'руб.',
  href: 'Ссылка',
  id: 'ID',
  tooltip: {
    copy: 'Копировать товар',
    delete: 'Удалить товар'
  },
  popUpHref: {
    title: 'Ссылка для зрителей',
    url: 'Ссылка на домене сервиса',
    short: 'Шорткод для комнаты',
    btnClose: 'Закрыть'
  },
  popUpAddProduct: {
    title: 'Создание товара'
  },
  popUpCopyProduct: {
    title: 'Копировать товар',
    productName: 'Укажите название нового товара',
    placeholder: 'Название товара',
    btnCopy: 'Копировать',
    btnCancel: 'Отмена'
  },
  popUpDeleteProduct: {
    title: 'Подтвердите',
    description: 'Вы собираетесь удалить товар',
    btnDelete: 'Удалить',
    btnCancel: 'Отмена'
  }
}

const Products = () => {
  const products = useSelector(state => state.admin.products.products)
  const pagination = useSelector(state => state.admin.products.pagination)
  const dispatch = useDispatch()
  const [productState, setProductState] = useState({})
  const [showPopUp, setShowPopUp] = useState('')

  const mockupData = [
    { id: 1, name: 'Регистрация на курс', cost: 1200, url: 'asd', shortCode: 'short' },
    { id: 2, name: 'Регистрация на курс2', cost: 200, url: 'asd', shortCode: 'short' }
  ]

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  const duplicateProduct = (values) => {
    dispatch(copyProduct(productState.id,{ name: values.name }))
    closePopUp()
  }

  const delProduct = () => {
    dispatch(deleteProduct(productState.id))
    closePopUp()
  }

  const showPopUpHref = async () => {
    setShowPopUp('POPUP_HREF')
    let input = await document.querySelector('.popup_href_url')
    input.focus()
  }

  const formikCopyProduct = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required()
    }),
    onSubmit: (values, { resetForm }) => {
      duplicateProduct(values)
      resetForm()
    }
  })





  const closePopUp = () => {
    setShowPopUp('')
  }

  const showCopyAndDelete = (i) => {
    const doc = document.getElementById(`tooltip_${i}`)
    if (doc.style.display !== 'block') {
      doc.style.display = 'block'
      doc.focus()
    } else {
      doc.style.display = 'none'
    }
  }

  const showCopyAndDeleteBlur = (i) => {
    const doc = document.getElementById(`tooltip_${i}`)
    doc.style.display = 'none'
  }

  const changeCopyProduct = () => {
    setShowPopUp('POPUP_COPY_PRODUCT')
  }

  const changeDeleteProduct = () => {
    setShowPopUp('POPUP_DELETE_PRODUCT')
  }

  const eachProduct = (product, i) => {
    return (
      <div key={i} className="cashbox_product" onClick={() => setProductState(product)}>
        <div className="cashbox_product_name">
          <Link to={`/edit/product/${product.id}`}>{product.name}</Link>
          <div>{text.id}:{product.id}</div>
        </div>
        <div className="cashbox_product_cost">
          {product.price.toLocaleString()}
          <span>&nbsp;{text.unit}</span>
        </div>
        <div className="cashbox_product_href" onClick={showPopUpHref}>
          <Href/>
          <span>{text.href}</span>
        </div>
        <div className="cashbox_product_more" onClick={() => showCopyAndDelete(i)}>
          <Ellipsis/>
          <div onBlur={() => showCopyAndDeleteBlur(i)} className="cashbox_product_more_tooltip" id={`tooltip_${i}`} tabIndex={3 * i}>
            <div onClick={changeCopyProduct}>{text.tooltip.copy}</div>
            <div onClick={changeDeleteProduct}>{text.tooltip.delete}</div>
          </div>
        </div>
      </div>
    )
  }

  const showProducts = () => products && products.map(eachProduct)

  const goToPage = (currentPage) => dispatch(getProducts(currentPage, pagination.per_page))

  const handlePageSizeChanged = (pageSize) => {
    dispatch(getProducts(pagination.current_page, pageSize))
  }

  return(
    <div className="cashbox_products">
      <Button size="medium" type="button" onClick={() => setShowPopUp('POPUP_CREATE_PRODUCT')}>Создать товар</Button>
      {mockupData.length ? showProducts() : <span>Вы еще не создали ни одного товара.</span>}
      {pagination ? <Pagination
        setPerPage={handlePageSizeChanged}
        goToPage={goToPage}
        perPage={pagination.per_page}
        from={pagination.from}
        currentPage={pagination.current_page}
        total={pagination.total}
        to={pagination.to}
        dropDownList={[8, 16, 32]}
      /> : null}
      <PopUp
        showButtonCancel={false}
        showButtonAccept={false}
        title={text.popUpAddProduct.title}
        show={showPopUp === 'POPUP_CREATE_PRODUCT'}
        closePopUp={closePopUp}
        className={'cashbox_products_popup_create_product'}
      >
        <CreateProductForm onCancel={closePopUp} />
      </PopUp>
      <PopUp
        show={showPopUp === 'POPUP_HREF'}
        showButtonAccept={true}
        showButtonCancel={false}
        title={text.popUpHref.title}
        buttonAcceptLabel={text.popUpHref.btnClose}
        onAccept={closePopUp}
        closePopUp={closePopUp}
        className={'cashbox_products_popup_href'}
      >
        <Input
          classNameInput={'popup_href_url'}
          refBool={true}
          title={true}
          titleText={text.popUpCopyProduct.url}
          value={productState.url}
          onFocus={() => document.querySelector('.popup_href_url').select()}
        />
        <Input
          title={true}
          refBool={true}
          titleText={text.popUpHref.short}
          value={productState.shortCode}
          disabled={true}
        />
      </PopUp>
      <PopUp
        show={showPopUp === 'POPUP_COPY_PRODUCT'}
        showButtonAccept={false}
        showButtonCancel={false}
        title={text.popUpCopyProduct.title + '-' + productState.name}
        closePopUp={closePopUp}
        className={'cashbox_products_popup_copy_product'}
      >
        <form onSubmit={formikCopyProduct.handleSubmit}>
          <Input
            name={'name'}
            title={true}
            titleText={text.popUpCopyProduct.productName}
            placeholder={text.popUpCopyProduct.placeholder}
            value={formikCopyProduct.values.productName}
            onChange={formikCopyProduct.handleChange}
          />
          <div className="popup_ui_window_buttons_list">
            <Button
              type="submit"
              size="medium"
              color="blue"
              disabled={!!Object.keys(formikCopyProduct.errors).length || !formikCopyProduct.values.name}
              onClick={null}
            >
              {text.popUpCopyProduct.btnCopy}
            </Button>
            <ButtonBorder
              type="button"
              size="medium"
              color="blue"
              onClick={() => {
                formikCopyProduct.resetForm()
                setShowPopUp('')
              }}
            >
              {text.popUpCopyProduct.btnCancel}
            </ButtonBorder>
          </div>
        </form>
      </PopUp>
      <PopUp
        show={showPopUp === 'POPUP_DELETE_PRODUCT'}
        showButtonAccept={true}
        showButtonCancel={true}
        buttonAcceptColor={'red'}
        title={text.popUpDeleteProduct.title}
        buttonAcceptLabel={text.popUpDeleteProduct.btnDelete}
        buttonCancelLabel={text.popUpDeleteProduct.btnCancel}
        onAccept={delProduct}
        onCancel={closePopUp}
        closePopUp={closePopUp}
        className={'cashbox_products_popup_delete'}
      >
        <div className={'cashbox_products_popup_delete_description'}>{text.popUpDeleteProduct.description + ' - ' + productState.name}</div>
      </PopUp>
    </div>
  )
}

export default Products
