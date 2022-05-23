import React from 'react'
import './TeamForRent.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const TeamForRent = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Команда в аренду'}
          description={'Оформляйте любые презентационные материалы в данном разделе. Здесь также возможно администрирование вебинаров, курирование обучающих продуктов и их полноценное продюсирование.'}
          href={'https://forms.gle/n4SoJHdVX8fWXsCw7'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default TeamForRent
