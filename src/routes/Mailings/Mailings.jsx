import React from 'react'
import './Mailings.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const Mailings = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Рассылки'}
          description={'Взаимодействуйте с холодной и теплой аудиторией, учениками обучающего продукта (онлай-школы, курса) любым привычным для вас способом.'}
          href={'https://forms.gle/z83598nrkNShksTx5'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Mailings
