import React from 'react'
import './Polling.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const Polling = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Опросы'}
          description={'Узнайте больше о потребностях учеников обучающего продукта (онлай-школы, курса), об уровне усвоения ими информации, качестве выполнения домашних заданий благодаря внедренным инструментам раздела.'}
          href={'https://forms.gle/SpzuqBdDKMa4sSxV7'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Polling
