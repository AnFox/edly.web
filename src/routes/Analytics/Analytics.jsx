import React from 'react'
import './Analytics.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const Analytics = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Аналитика'}
          description={'Собирайте информацию о запуске и продаже обучающего продукта в этом разделе. Проводите удобный анализ всех видов конверсий, выявляйте недочеты в деятельности, оперативно их исправляйте и масштабируйте свой бизнес.'}
          href={'https://forms.gle/uXf1DdojcxHcWuZaA'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default Analytics
