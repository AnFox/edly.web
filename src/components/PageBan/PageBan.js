import React from 'react'
import './PageBan.scss'
import '../CommonStyles/CommonStylesForm.scss'
import RejectIcon from '../../assets/svg/RejectIcon.svg'


const PageBan = () => {
  return (
    <form className="ban_form" >
      <div className="title_auth ban_title_margin">Доступ в комнату закрыт</div>
      <img className="ban_img_margin_height" src={RejectIcon} alt="ban"/>
      <div className="label label_center"><strong>Вы получили бан и сейчас не можете войти в эту веб-комнату.</strong></div>
    </form>
  )
}

export default PageBan
