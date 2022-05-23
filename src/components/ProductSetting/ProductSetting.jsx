import React, { useEffect, useState } from 'react'
import './ProductSetting.scss'
import CreateProductForm from '../CreateProductForm'
import { useParams, useHistory } from 'react-router-dom'
import { getProduct } from '../../lib/admin/products/actions'
import { useDispatch, useSelector } from 'react-redux'
import TabBar from '../UI/TabBar'

const ProductSetting = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const product = useSelector(state => state.admin.products.product?.[params.productId])
  const [menuOption, setMenuOption] = useState('Common')

  useEffect(() => {
    dispatch(getProduct(params.productId))
  }, [dispatch, params.productId])

  return (
    <div className={'product_setting'}>
      <TabBar
        setMenuOption={setMenuOption}
        menuOption={menuOption}
        className={''}
        values={['Common']}
        closeIcon={false}
      >
        {'Общие'}
      </TabBar>
      {menuOption === 'Common' &&
      <div className={'product_setting__common'}>
        <CreateProductForm product={product} onCancel={() => history.goBack()} />
      </div>}
    </div>
  )
}

export default ProductSetting
