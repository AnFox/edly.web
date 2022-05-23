import React from 'react'
import './Constructor.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const Constructor = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Конструктор'}
          description={'Все, что нужно для презентации своего продукта, находится на платформе EDLY в этом разделе.\n' +
          'Создавайте сайт с нуля или перенесите сюда уже имеющийся, чтобы отслеживать аналитику по обучающему продукту и воспользоваться дополнительными возможностями раздела.'}
          href={'https://forms.gle/w4MiTCcBHLB4EYss9'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Constructor
