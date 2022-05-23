import React from 'react'
import './Training.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const Training = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Обучение'}
          description={'Управляйте оформлением (визуал, описание) всех уроков обучающего продукта (онлайн-школы, курса) в данном разделе.'}
          href={'https://forms.gle/nn9jc8XwyRyyeabLA'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Training
