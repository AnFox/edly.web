import React, { useEffect, useState } from 'react'
import './Banner.scss'
import { deleteBanner, postBanner, updateBanner } from '../../../lib/admin/banner/actions'
import Toggle from '../../UI/Toggle'
import PropTypes from 'prop-types'
import { alertbarShow } from '../../../lib/app/alertbar/actions'
import { useDispatch, useSelector } from 'react-redux'
import SettingFooter from '../Footer'
import PopUp from '../../UI/PopUp'
import { Link, useParams } from 'react-router-dom'
import {
  Delete,
  Href,
  Reduce,
  Save,
  Setting,
  Plus,
} from '../../UI/Icons/Icons'
import Button from '../../UI/Button'
import ButtonBorder from '../../UI/ButtonBorder'
import Input from '../../UI/Input'
import CreateProductForm from '../../CreateProductForm'
import { getProducts } from '../../../lib/admin/products/actions'
import { roomUpdateBanner } from '../../../lib/admin/rooms/actions'
import PopUpAddBackground from './PopUpAddBackground'

const text = {
  unit: 'Руб.'
}

let flags = {
  timer: 0,
  alerts: []
}

const Banner = (props) => {
  const account = useSelector(state => state.app.user.account)
  const products = useSelector(state => state.admin.products.products)

  const [bannerList, setBannerList] = useState([])
  const [showPopUp, setShowPopUp] = useState('')
  const [isShowProducts, setIsShowProducts] = useState(true)
  const params = useParams()
  const room = useSelector(state => state.admin.rooms.currentRoom[params.roomId])
  const dispatch = useDispatch()
  const [selectedBannerIndex, setSelectedBannerIndex] = useState(0)

  useEffect(() => {
    setBannerList(room ? room.banners : [])
  }, [room])

  useEffect(() => {
    dispatch(getProducts(1, 9999))
  }, [dispatch])

  const autoSave = (banner) => {
    if (banner.id) {
      if (isDisabled(banner)) {
        if (flags.alerts.indexOf(banner.id) === -1) {
          dispatch(alertbarShow({
            type: 'error',
            messages: ['Заполните все поля в баннере'],
            duration: 1800
          }))
          flags.alerts.push(banner.id)
        }
      } else {
        const index = flags.alerts.indexOf(banner.id)
        if (index !== -1) {
          flags.alerts.splice(index, 1)
        }
        saveBanner(banner)
      }
    }
  }

  const selectBannerBackground = (index, bg) => {
    setBannerList((state) => state.map((banner, i) => {
      if (i === selectedBannerIndex) {
        let newBanner
        if (typeof bg === 'string') {
          newBanner = { ...banner, image: bg }
        } else {
          newBanner = { ...banner, image: bg.url }
        }
        autoSave(newBanner)
        return newBanner
      } else {
        return banner
      }
    }))
  }



  const addBanner = () => {
    const temp = {
      room_id: room.id,
      product: null,
      image: '',
      title: '',
      url: ''
    }
    setBannerList([...bannerList, temp])

    const bannersContainer = document.querySelector('.admin_header_setting_window_banner_list')
    const goToBanner = () => {
      showBanner(bannerList.length, true)
      setTimeout(() => bannersContainer.scrollTo({ top: bannersContainer.scrollHeight + 500, behavior: 'smooth' }), 100)

    }
    setTimeout(goToBanner, 300)
  }

  const deleteSelectedBanner = () => {
    dispatch(deleteBanner(room.id, bannerList[selectedBannerIndex].id)).then(() => {
      showBanner(selectedBannerIndex, false)
      closePopUp()
    })
  }

  const addProduct = (product) => {
    setBannerList((state) => state.map((banner, i) => {
      if (i === selectedBannerIndex) {
        const newBanner = {
          ...banner,
          product: product
        }
        autoSave(newBanner)
        return newBanner
      } else {
        return banner
      }
    }))
    closePopUp()
  }

  const createProductSuccess = (newProduct) => {
    addProduct(newProduct)
    closePopUp()
  }

  const showBanner = (i, show) => {
    const bannerSmall = document.getElementById(`single_banner_small_${i}`)
    const bannerBig = document.getElementById(`single_banner_big_${i}`)
    bannerSmall.style.display = show ? 'none' : ''
    bannerBig.style.visibility = show ? 'visible' : 'hidden'

    if (show) {
      bannerBig.style.display = 'block'
    } else {
      setTimeout(() => {
        bannerBig.style.display = 'none'
      }, 300)
    }

    const banner = document.querySelectorAll('.setting_webinar_banner_single_banner')[i]
    banner.querySelector('.single_banner_big_header').style.display = show ? 'flex' : 'none'
    banner.classList.toggle('setting_webinar_banner_single_banner_big')
  }

  const changeTypeBanner = (index) => {
    if (!account.payment) {
      dispatch(alertbarShow({
        type: 'error',
        messages: ['Пожалуйста, сперва настройте интеграцию с платежной системой в разделе "Касса"']
      }))
    } else {
      if (!bannerList[index].id) {
        setBannerList((state) => state.map((banner, i) => {
          if (i === index) {
            return { ...banner, product: banner.product ? null : {} }
          } else {
            return banner
          }
        }))
      }
    }
  }



  const bannerHandleInput = (index, property, value) => {
    let newBanner = {}
    setBannerList((state) => state.map((banner, i) => {
      if (i === index) {
        newBanner = { ...banner, [property]: value }
        return { ...banner, [property]: value }
      } else {
        return banner
      }
    }))
  }

  useEffect(() => {
    const bannerState = bannerList[selectedBannerIndex]
    const bannerStore = (room && room.banners) ? room.banners[selectedBannerIndex] : undefined
    if (
      bannerState &&
      bannerStore &&
      bannerState.id &&
      (bannerState.title !== bannerStore.title || bannerState.url !== bannerStore.url) &&
      (bannerState.id === bannerStore.id)
    ) {
      if (flags.timer) {
        clearTimeout(flags.timer)
        flags.timer = setTimeout(() => autoSave(bannerState), 1000)
      } else {
        flags.timer = setTimeout(() => autoSave(bannerState), 1000)
      }
    }
  }, [autoSave, bannerList, room, selectedBannerIndex])

  const saveBanner = (banner) => {
    if (banner.id) {
      const tempBanner = {
        ...banner,
        room_id: room.id,
        is_product: !!banner.product,
        product_id: banner?.product?.id,
        url: banner.url || ''
      }

      if (tempBanner.image) {
        delete tempBanner.image_url
      } else {
        tempBanner.image = tempBanner.image_url
        delete tempBanner.image_url
      }

      dispatch(updateBanner(banner.id, tempBanner)).then(res => {
        if (res.payload) {
          dispatch(roomUpdateBanner({ roomId: room.id, banner: res.payload }))
        }

      })
    } else {
      const newBanner = {
        ...banner,
        is_product: !!banner.product,
        product_id: banner?.product?.id,
        url: banner.url || '',
        title: banner.title
      }
      dispatch(postBanner(room.id, newBanner))
    }
  }

  const showProduct = (product, i, context) => {
    return (
      <div key={i} className={'setting_banner_product'} onClick={context === 'popup' ? () => addProduct(product) : null}>
        <div className={'setting_banner_product_main_info'}>
          {context === 'popup' ?
            <div className={'setting_banner_product_name'}>{product.name}</div> :
            <Link to={`/edit/product/${product.id}`}>{product.name}</Link>}
          <div>ID:{product.id}</div>
        </div>
        <div className={'setting_banner_product_cost'}>
          <span>{product.price.toLocaleString()}&nbsp;</span>
          <span>{text.unit}</span>
        </div>
      </div>
    )
  }

  const isDisabled = (banner) => {
    if (banner.image || banner.image_url) {
      if (banner.product) {
        return !banner.product.id || !banner.title
      } else {
        return !(banner.url && banner.title)
      }
    } else {
      return true
    }
  }

  const delBanner = (banner, i) => {
    if (banner.id) {
      setShowPopUp('POPUP_DELETE_BANNER')
    } else {
      setBannerList((state) => state.filter((data, index) => i !== index))
    }
  }

  const eachAddBanners = (banner, i) => {
    return (
      <div className={'setting_webinar_banner_single_banner'} id={`webinar_banner_${i}`} key={i} onClick={() => setSelectedBannerIndex(i)}>
        <div className={'single_banner_small'} id={`single_banner_small_${i}`}>
          <div className={'single_banner_small_title'}>{banner.title}</div>
          <div className={'single_banner_small_price_or_url'}>
            {banner.product ? <div>{banner.product.price?.toLocaleString()}&nbsp;руб.</div> : <div>{banner.url}</div>}
          </div>
          <Setting className={'single_banner_small_icon'} onClick={() => showBanner(i, true)} />
        </div>
        <div className={`single_banner_big ${banner.product ? 'single_banner_big_product' : ''}`} id={`single_banner_big_${i}`}>
          <div className={'single_banner_big_header'}>
            <Toggle id={`single_banner_toggle_${i}`} onSelect={() => changeTypeBanner(i)} label={'Товар'} selected={!!banner.product} />
            <div className={'single_banner_big_header_controls'}>
              {!banner.id && <Button size={'medium'} disabled={isDisabled(banner)} onClick={() => saveBanner(banner)}><Save/></Button>}
              <Delete onClick={() => delBanner(banner, i)} />
              <Reduce className={'single_banner_big_header_controls_reduce'} onClick={() => showBanner(i, false)} />
            </div>
          </div>
          <div className={`input_ui_main ${''}`}>
            <div className="input_ui_title">{'Баннер'}</div>
            <div className={'single_banner_big_btn_choice_background'} onClick={() => setShowPopUp('POPUP_BACKGROUND')}>
              <span>{'Щелкните чтобы выбрать фон'}</span>
              {(banner.image || banner.image_url) && <img src={banner.image || banner.image_url} alt={'Фон'} />}
            </div>
          </div>
          <Input title={true} titleText={'Текст'} value={banner.title || ''} onChange={(e) => bannerHandleInput(i, 'title' , e.target.value)} />
          {banner.product ?
            <>
              <div className={`input_ui_main ${''}`}>
                <div className="input_ui_title">{'Привязанный товар'}</div>
                <div className={'single_banner_big_attached_product'}>
                  {banner.product.id ? showProduct(banner.product): null}
                  <div className={'single_banner_big_btn_choice_product'} onClick={() => setShowPopUp('POPUP_CHOICE_PRODUCT')}>
                    <Href/>
                    <span>Выбрать</span>
                  </div>
                </div>
              </div>
            </> :
            <>
              <Input title={true} titleText={'Ссылка'} placeholder={'URL-адрес, куда ведет баннер'} value={banner.url || ''} onChange={(e) => bannerHandleInput(i, 'url' , e.target.value)} />
            </>}
        </div>

      </div>
    )
  }

  //
  // const addBannerClickHandler = () => {
  //   if (!account.payment) {
  //     dispatch(alertbarShow({
  //       type: 'error',
  //       messages: ['Пожалуйста, сперва настройте интеграцию с платежной системой в разделе "Касса"']
  //     }))
  //   } else {
  //     addBanner()
  //   }
  // }

  const closePopUp = () => {
    setShowPopUp('')
  }

  const showAddBanners = () => bannerList && bannerList.map(eachAddBanners)

  const eachProduct = (product, i) => {
    return showProduct(product, i, 'popup')
  }

  const showProducts = () => products.map(eachProduct)

  return (
    <>
      <PopUpAddBackground selectBannerBackground={selectBannerBackground} closePopUp={closePopUp} showPopUp={showPopUp} banner={bannerList[selectedBannerIndex]} selectedBannerIndex={selectedBannerIndex}/>
      <PopUp
        title={'Удаление баннера'}
        show={showPopUp === 'POPUP_DELETE_BANNER'}
        showButtonCancel={true}
        showButtonAccept={true}
        buttonAcceptColor={'red'}
        buttonAcceptLabel={'Удалить'}
        buttonCancelLabel={'Отмена'}
        onCancel={closePopUp}
        closePopUp={closePopUp}
        onAccept={deleteSelectedBanner}
        disableScroll={true}
        className={'setting_room_banner_popup_delete_banner'}
      >
        <div className={'setting_room_banner_popup_delete_banner__subtitle'}>
          Вы собираетесь удалить баннер - {bannerList[selectedBannerIndex]?.title}
        </div>
      </PopUp>
      <PopUp
        title={'Выбор товара'}
        show={showPopUp === 'POPUP_CHOICE_PRODUCT'}
        showButtonAccept={false}
        showButtonCancel={isShowProducts && !!(products && products.length)}
        buttonCancelLabel={'Отмена'}
        onCancel={closePopUp}
        closePopUp={closePopUp}
        disableScroll={true}
        className={'setting_room_banner_popup_choice_product'}
      >
        <div>
          {(products && products.length) ? (
            <>
              <Toggle
                classList={'setting_room_banner_popup_choice_product_toggle'}
                selected={!isShowProducts}
                onSelect={() => setIsShowProducts(state => !state)}
                label={'Создать товар'}
              />
              {isShowProducts ? (
                <div className={'setting_room_banner_popup_choice_product_list'}>
                  {showProducts()}
                </div>
              ) : <CreateProductForm onSuccessCallback={createProductSuccess} onCancel={closePopUp} className={'setting_room_banner_popup_choice_product_form'}/>}
            </>
          ) : (
            <>
              <div className={'setting_room_banner_popup_choice_product_subtitle'}>У вас нет товаров</div>
              <div  className={'setting_room_banner_popup_choice_product_description'}>Создайте, чтобы привязать к баннеру</div>
              <CreateProductForm onSuccessCallback={createProductSuccess} onCancel={closePopUp} className={'setting_room_banner_popup_choice_product_form'}/>
            </>

          )}
        </div>
      </PopUp>
      <div className={props.webinarLocation ? 'setting_webinar_banner' : 'setting_banner_padding'}>
        {bannerList && bannerList.length > 0 ? (
          <div className={'admin_header_setting_window_banner_list'}>
            {showAddBanners()}
          </div>
        ) : <></>}
        <div className="btn_add_banner" onClick={addBanner}>
          <ButtonBorder size={'medium'}><Plus/></ButtonBorder>
          Добавить баннер
        </div>
        <SettingFooter hideSaveButton={true} rollUp={props.rollUp} webinar={props.webinarLocation} text={props.text} />
      </div>
    </>
  )
}

Banner.propTypes = {
  rollUp: PropTypes.func.isRequired,
  text: PropTypes.shape({
    bannerDelete: PropTypes.string,
    bannerSave: PropTypes.string
  }).isRequired,
  webinarLocation: PropTypes.bool
}

export default Banner
