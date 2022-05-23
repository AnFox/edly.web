import React from 'react'
import './InProgressPage.scss'
import PropTypes from 'prop-types'
import Button from '../UI/Button'

const InProgressPage = (props) => {
  return (
    <div>
      <div className={'in_progress_page__header'}>
        <div>{props.title}</div>
        <span>ДАННЫЙ РАЗДЕЛ НАХОДИТСЯ В РАЗРАБОТКЕ И СКОРО БУДЕТ ДОСТУПЕН</span>
      </div>
      <div className={'in_progress_page'}>
        <div className={'in_progress_page__title'}>Мы делаем платформу лучше для вас. Спасибо за понимание!</div>
        <div className={'in_progress_page__content'}>{props.description}</div>
        <div className={'in_progress_page__subtitle'}>Пожалуйста, заполните форму по кнопке ниже, чтобы помочь нам усовершенствовать этот блок. Спасибо!</div>
        <Button size={'medium'} onClick={() => window.open(props.href, '_blank')}>Внести предложения</Button>
      </div>
    </div>
  )
}

InProgressPage.propTypes = {
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  title: PropTypes.string
}

export default InProgressPage
