import React, { useEffect, useRef } from 'react'
import './Footer.scss'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ResizeObserver from 'resize-observer-polyfill'
import RouteWrapper from '../UI/RouteWrapper'

const Footer = (props) => {
  const footer = useRef({})

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return
        }
        for (const entry of entries) {
          const { height } = entry.contentRect
          if (footer.current) {
            if (height < window.innerHeight - (footer.current.offsetHeight / 2)) {
              footer.current.style.position = 'absolute'
              footer.current.style.width = '100%'
            } else {
              footer.current.style.position = ''
              footer.current.style.width = ''
            }
          }
        }
      })
    })

    ro.observe(document.getElementById('root'))

    return () => ro.unobserve(document.getElementById('root'))
  }, [])

  return (
    <footer ref={footer} className={`footer ${props.className}`}>
      <RouteWrapper className={'grid_content_footer'}>
        <div className="footer_grid_child_options" >
          <div className="footer_label footer_label_text_align" ><Link to="/sla" className="href_footer">Условия использования сервиса</Link></div>
        </div>
        <div className="footer_grid_child_options" >
          <div className="footer_label footer_label_text_align" ><Link to="/privacy" className="href_footer">Политика конфиденциальности</Link></div>
        </div>
        <div className="footer_grid_child_options" >
          <div className="footer_label footer_label_text_align_right" >(с) Все права защищены</div>
        </div>
      </RouteWrapper>
      {/*<div className={``}>*/}
      {/*  <div className="grid_content grid_content_footer">*/}

      {/*  </div>*/}
      {/*</div>*/}
    </footer>
  )
}

Footer.defaultProps = {
  className: ''
}

Footer.propTypes = {
  className: PropTypes.string
}

export default Footer
