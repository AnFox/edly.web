import React, { useEffect } from 'react'
import './LeftMenu.scss'
import {
  MenuArrow,
  Tab,
  Robot,
  Humans,
  SMS,
  Polling,
  TunnelsOfSales,
  Book,
  Constructor,
  MessageCircle,
  Analytics
} from '../../UI/Icons/Icons'
import PropTypes from 'prop-types'
import LinkCard from './LinkCard/LinkCard'

const text = {
  linkList: {
    rooms: 'Комнаты',
    mailings: 'Рассылки',
    polling: 'Опросы',
    training: 'Обучение',
    employeesAI: 'Сотрудники ИИ',
    tunnelsOfSales: 'Туннели продаж',
    constructor: 'Конструктор',
    analytics: 'Аналитика',
    community: 'Сообщество',
    teamForRent: 'Команда в аренду',
    support: 'Поддержка'
  }
}

const LeftMenu = (props) => {
  const { open, closeMenu } = props

  useEffect(() => {
    if (!window.replainSettings) {
      window.replainSettings = {
        id: '05af3891-05e9-4604-b415-158c18a7fe88',
        excludePages: ['/webinar/*'],
      };

      (function (u) {
        const s = document.createElement('script')
        s.type = 'text/javascript'; s.async = true; s.src = u
        const x = document.getElementsByTagName('script')[0]
        x.parentNode.insertBefore(s, x)
      })('https://widget.replain.cc/dist/client.js')
    } else {
      const elem = document.getElementById('__replain_widget')
      if (elem) {
        elem.style.display = 'block'
      }
    }

    return () => widgetOff()
  }, [])

  const widgetOff = () => {
    const elem = document.getElementById('__replain_widget')
    if (elem) {
      const x = document.getElementsByTagName('script')[0]
      if (x) {
        x.parentNode.removeChild(document.getElementsByTagName('script')[0])
        elem.style.display = 'none'
      }

    }
  }


  return (
    <div className={`header_main__nav_menu${open ? '--show' : '--hide'} nav_menu`}>
      <div className={'nav_menu__logo'}>
        <MenuArrow onClick={closeMenu} />
        <span>EDLY</span>
      </div>
      <div className={'nav_menu__list'}>
        <LinkCard icon={<Tab />} label={text.linkList.rooms} to={'/rooms'} paths={['/rooms', 'edit/room', '/edit/webinar', '/webinars', '/scenario']} />
        <LinkCard icon={<SMS />} label={text.linkList.mailings} to={'/mailings'} inProgress/>
        <LinkCard icon={<Polling />} label={text.linkList.polling} to={'/polling'} inProgress/>
        <LinkCard icon={<Book />} label={text.linkList.training} to={'/training'} inProgress />
        <LinkCard icon={<Robot />} label={text.linkList.employeesAI} to={'/employeesAI'} inProgress />
        <LinkCard icon={<TunnelsOfSales />} label={text.linkList.tunnelsOfSales} to={'/tunnelsOfSales'} inProgress />
        <LinkCard icon={<Constructor />} label={text.linkList.constructor} to={'/constructor'} inProgress />
        <LinkCard icon={<Analytics />} label={text.linkList.analytics} to={'/analytics'} inProgress />
        <LinkCard icon={<MessageCircle />} label={text.linkList.community} to={'/community'} inProgress />
      </div>
      <div className={'nav_menu__line'} />
      <div className={'nav_menu__footer'}>
        <LinkCard icon={<Humans />} label={text.linkList.teamForRent} to={'/teamForRent'} inProgress />
      </div>
    </div>
  )
}

LeftMenu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default LeftMenu
