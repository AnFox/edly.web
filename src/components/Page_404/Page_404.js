import React from 'react'
import './Page_404.scss'
import '../CommonStyles/CommonStylesForm.scss'
import Icon404 from '../../assets/svg/404.svg'


const Page_404 = () => {
  return (
    <form className="not_found_form" >
      <div className="title_auth not_found_title_margin">Комната не найдена</div>
      <img className="not_found_img_margin_height" src={Icon404} alt="404"/>
      <div className="label not_found_label_center margin_bottom"><strong>Комната по этому адресу не существует или была удалена.</strong></div>
      <div className="label not_found_label_center not_found_label_width">Обратитесь к организаторам вебинара для получения правильной ссылки.</div>
    </form>
  )
}

export default Page_404
