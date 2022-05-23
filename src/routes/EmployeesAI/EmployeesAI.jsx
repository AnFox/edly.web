import React from 'react'
import './EmployeesAI.scss'
import RouteWrapper from '../../components/UI/RouteWrapper'
import Header from '../../components/RoomsHeader'
import Footer from '../../components/Footer'
import InProgressPage from '../../components/InProgressPage'

const EmployeesAI = () => {
  return (
    <>
      <Header/>
      <RouteWrapper>
        <InProgressPage
          title={'Сотрудники ИИ'}
          description={'Создавайте сотрудников искусственного интеллекта и управляйте ими в целях автоматизации важнейших действий во время обучения.'}
          href={'https://forms.gle/tzhe1ec1SFALAcHD8'}
        />
      </RouteWrapper>
      <Footer/>
    </>
  )
}

export default EmployeesAI
