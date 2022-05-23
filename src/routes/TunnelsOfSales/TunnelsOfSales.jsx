import React from 'react'
import './TunnelsOfSales.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const TunnelsOfSales = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Туннели продаж'}
          description={'Автоматизируйте путь клиента от первого клика до совершения покупки. Все необходимое для этих целей здесь уже имеется.'}
          href={'https://forms.gle/ZHEXT6hu6aJuQrk28'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default TunnelsOfSales
