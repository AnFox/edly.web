import React from 'react'
import './ProductSetting.scss'
import Footer from '../../components/Footer'
import Header from '../../components/RoomsHeader'
import Setting from '../../components/ProductSetting'
import TitleForRouteScreen from '../../components/UI/TitleForRouteScreen'
import { useParams } from 'react-router-dom'
import RouteWrapper from '../../components/UI/RouteWrapper'

const ProductSetting = () => {
  const params = useParams()

  return (
    <>
      <Header />
      <RouteWrapper>
        <TitleForRouteScreen>
            Настройки товара {params.roomId}
        </TitleForRouteScreen>
        <Setting />
      </RouteWrapper>
      <Footer />
    </>
  )
}

export default ProductSetting
