import React, { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import './MenuSlides.scss'
import { ArrowLeft, ArrowRight } from '../UI/Icons/Icons'
import { getWebinarSlide } from '../../lib/app/webinar/actions'
import { roomGetSlides, roomSlidesSetPagination } from '../../lib/admin/slides/actions'
import { useParams } from 'react-router-dom'
import Button from '../UI/Button'

const MenuSlides = (props) => {
  const dispatch = useDispatch()
  const params = useParams()
  const currentSlide = useSelector(state => state.app.webinar[props.webinarId]?.presentation?.slide)
  const webinar = useSelector(state => state.app.webinar[props.webinarId] || {})
  const slides = useSelector(state => state.admin.slides[params.roomId]?.slides || [])
  const pagination = useSelector(state => state.admin.slides[params.roomId]?.pagination || {})
  const pageSize = useMemo(() => window.innerWidth > 415 ? window.innerWidth > 900 ? 5 : 4 : 3, [])

  const slide = useMemo(() => pagination.currentSlide || currentSlide, [currentSlide, pagination.currentSlide])

  const currentPage = useMemo(() => {
    if (slide) {
      return slide ? +slide.name > pageSize ? Math.ceil(+slide.name / pageSize) : 1 : 1
    } else {
      return 1
    }

  }, [pageSize, slide])

  const currentSlides = useMemo(() => {
    const currentPageResult = pagination.currentPage || currentPage

    return slides && slides.length && [...slides.slice(((currentPageResult * pageSize) - pageSize), currentPageResult * pageSize)]
  }, [currentPage, pageSize, pagination.currentPage, slides])

  useEffect(() => {
    if (!slides.length && webinar.room_id) {
      dispatch(roomGetSlides(webinar.room_id, 1, 9999))
    }
  }, [dispatch, slides.length, webinar.room_id])

  useEffect(() => {
    const lastPage = slides?.length ? Math.ceil(slides.length / pageSize) : 1
    const paginationObject = {
      currentPage: currentPage,
      pageSize: pageSize,
      lastPage: lastPage,
      currentSlide: pagination.currentSlide || currentSlide
    }
    dispatch(roomSlidesSetPagination({ roomId: params.roomId, pagination: paginationObject }))

  }, [currentPage, currentSlide, dispatch, pageSize, pagination.currentSlide, params.roomId, slides.length])

  const setSlide = (slide) => {
    const paginationObject = {
      ...pagination,
      currentSlide: slide
    }
    dispatch(roomSlidesSetPagination({ roomId: params.roomId, pagination: paginationObject }))
    getWebinarSlide(webinar.id, slide.id)
  }

  const goLeftPagination = useCallback(() => {
    dispatch(roomSlidesSetPagination({ roomId: params.roomId, pagination: { ...pagination, currentPage: pagination.currentPage - 1 } }))
  }, [dispatch, pagination, params.roomId])

  const goRightPagination = useCallback(() => {
    dispatch(roomSlidesSetPagination({ roomId: params.roomId, pagination: { ...pagination, currentPage: pagination.currentPage + 1 } }))
  }, [dispatch, pagination, params.roomId])

  const getSlide = useCallback((side) => {
    if (slide) {
      const index = currentSlides.findIndex(slideCurrent => slideCurrent.id === slide.id)
      if (!index) {
        if (side === 'right') {
          goRightPagination()
        } else {
          goLeftPagination()
        }

      }

      const slideIndex = slides.findIndex(slideCurrent => slideCurrent.id === slide.id)
      let nextSlideIndex = slideIndex
      if (side === 'right') {
        if (slideIndex < slides.length - 1) {
          nextSlideIndex = slideIndex + 1
        }
      } else {
        if (slideIndex > 0) {
          nextSlideIndex = slideIndex - 1
        }
      }
      getWebinarSlide(webinar.id, slides[nextSlideIndex].id)
      dispatch(roomSlidesSetPagination({ roomId: params.roomId, pagination: { ...pagination, currentSlide: slides[nextSlideIndex] } }))
    } else {
      getWebinarSlide(webinar.id, slides[0].id)
    }
  }, [currentSlides, dispatch, goLeftPagination, goRightPagination, pagination, params.roomId, slide, slides, webinar.id])

  const eachSlide = (eachSlide, i) => {
    return (
      <div key={i} onClick={() => setSlide(eachSlide)} className={`slide${slide?.id === eachSlide.id ? ' active' : ''}`} style={{ backgroundImage: `url(${eachSlide.url})` }} />
    )
  }

  const showSlides = () => {
    if (slides && slides.length) {
      return currentSlides.map(eachSlide)
    }
    return false
  }

  const disabledPaginationLeft = () => pagination?.currentPage === 1
  const disabledPaginationRight = () => pagination?.currentPage === pagination?.lastPage

  const disabledLeft = useCallback(() => +currentSlide?.name < 2, [currentSlide])
  const disabledRight = useCallback(() => {
    if (slides && slides.length && currentSlide) {
      return slides.length === slides.findIndex(slide => slide.id === currentSlide.id) + 1
    }
    return false
  }, [currentSlide, slides])

  const buttons = useCallback((e) => {
    if (e.keyCode === 37 && !disabledLeft()) {
      getSlide('left')
    }

    if (e.keyCode === 39 && !disabledRight()) {
      getSlide('right')
    }
  }, [disabledLeft, disabledRight, getSlide])



  useEffect(() => {
    window.addEventListener('keydown', buttons)
    return () => window.removeEventListener('keydown', buttons)
  }, [buttons])

  return (
    <div className="room_main_slider_menu">
      <div className="room_main_slider_menu_list">
        <Button className="room_main_slider_menu_list_button_left" disabled={disabledPaginationLeft()} size="small" onClick={goLeftPagination} >
          <ArrowLeft className="room_main_slider_menu_button_icon" />
        </Button>
        {showSlides()}
        <Button className="room_main_slider_menu_list_button_right" disabled={disabledPaginationRight()} size="small" onClick={goRightPagination} >
          <ArrowRight className="room_main_slider_menu_button_icon" />
        </Button>
      </div>
      <div className="room_main_slider_menu_navigation">
        <Button className="room_main_slider_menu_button" disabled={disabledLeft()} size="small" onClick={() => getSlide('left')} >
          <ArrowLeft className="room_main_slider_menu_button_icon" />
        </Button>
        <div className="room_main_slider_menu_navigation_middle">{slide?.name}</div>
        <Button className="room_main_slider_menu_button" disabled={disabledRight()} size="small" onClick={() => getSlide('right')} >
          <ArrowRight className="room_main_slider_menu_button_icon" />
        </Button>
      </div>
    </div>
  )
}

MenuSlides.propTypes = {
  webinarId: PropTypes.number.isRequired
}

export default MenuSlides
