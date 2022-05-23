import ApiRooms from './ApiResources/ApiRooms'
import ApiBanners from './ApiResources/ApiBanners'
import ApiAuth from './ApiResources/ApiAuth'
import ApiWebinars from './ApiResources/ApiWebinars'
import ApiAccount from './ApiResources/ApiAccount'
import ApiChat from './ApiResources/ApiChat'
import ApiOrder from './ApiResources/ApiOrder'
import ApiUser from './ApiResources/ApiUser'
import ApiProducts from './ApiResources/ApiProducts'
import ApiBackgrounds from './ApiResources/ApiBackgrounds'

class ApiResources {
  getProductPublicInfo (data) {
    return this.api.post('/public/product', data)
  }

  unblockWebinarUser (webinarId, userId) {
    return this.api.delete(`/admin/block/webinar/${webinarId}/user/${userId}`)
  }
}

function join (MainApi, SubApi) {
  Object.assign(MainApi.prototype, SubApi)
}

join(ApiResources, ApiRooms)

join(ApiResources, ApiBanners)

join(ApiResources, ApiAuth)

join(ApiResources, ApiWebinars)

join(ApiResources, ApiAccount)

join(ApiResources, ApiChat)

join(ApiResources, ApiOrder)

join(ApiResources, ApiUser)

join(ApiResources, ApiProducts)

join(ApiResources, ApiBackgrounds)

export default ApiResources
