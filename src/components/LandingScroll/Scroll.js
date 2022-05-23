import React, { useEffect } from 'react';
import './Scroll.scss';

const Scroll = () => {
    useEffect(() => {
        document.addEventListener('scroll', slider)
        return () => document.removeEventListener('scroll', slider);
    }, [])
      const slider = () => {
        let section = document.getElementsByClassName('section');
        let slider = document.getElementsByClassName('landing_scroll');
        let windowPosition = {
          top: window.pageYOffset,
          left: window.pageXOffset,
          right: window.pageXOffset + document.documentElement.clientWidth,
          bottom: window.pageYOffset + document.documentElement.clientHeight
        };
        let targetPosition = {};
        targetPosition = getPosition(section[0]);
        if (targetPosition.bottom > windowPosition.top && (targetPosition.top+(document.documentElement.clientHeight / 2)) < windowPosition.bottom && targetPosition.right > windowPosition.left && targetPosition.left < windowPosition.right) {

          slider[0].style.opacity = '0';
        } else {

          // eslint-disable-next-line no-return-assign
          setTimeout(() => slider[0].style.opacity = '1', 100);
        }
        for(let i = 1; i < section.length; i++){
        targetPosition = getPosition(section[i]);
        if (targetPosition.bottom > windowPosition.top && (targetPosition.top+(document.documentElement.clientHeight / 2)) < windowPosition.bottom && targetPosition.right > windowPosition.left && targetPosition.left < windowPosition.right) {
          setSelected(i-1);
          }
        }

      }
      const setSelected = (index) => {
        let scroll = document.getElementsByClassName('landing_scroll_option');
        for(let i = 0; i < scroll.length; i++){
          if (index === i){
            scroll[i].classList.add('selected')
          } else{
            scroll[i].classList.remove('selected')
          }
        }
      }
      const getPosition = (target) => {
        return({
          top: window.pageYOffset + target.getBoundingClientRect().top,
          left: window.pageXOffset + target.getBoundingClientRect().left,
          right: window.pageXOffset + target.getBoundingClientRect().right,
          bottom: window.pageYOffset + target.getBoundingClientRect().bottom
        })
      }
    return(
        <div className="landing_scroll">
            <div className="landing_scroll_option" />
            <div className="landing_scroll_option" />
            <div className="landing_scroll_option" />
            <div className="landing_scroll_option" />
        </div>
    )
}
export default Scroll
