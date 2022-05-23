import React from 'react'
import './Community.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const Community = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Сообщество'}
          description={'Создавайте брендированные сообщества с дополнительными возможностями и удобными инструментами для взаимодействия с участниками.'}
          href={'https://forms.gle/Vymamn7XQaZ6nh736'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Community
