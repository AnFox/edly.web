import React, { useEffect } from 'react'
import Header from '../../components/LandingHeader'
import FirstScreen from '../../components/LandingFirstScreen'
import SecondScreen from '../../components/LandingSecondScreen'
import ThirdScreen from '../../components/LandingThirdScreen'
import FourthScreen from '../../components/LandingFourthScreen'
import FifthScreen from '../../components/LandingFifthScreen'
import Footer from '../../components/LandingFooter'
import Scroll from '../../components/LandingScroll'
import './Landing.scss'

const Landing = () => {

  useEffect(() => {
    if (!window.replainSettings) {
      window.replainSettings = {
        id: '05af3891-05e9-4604-b415-158c18a7fe88',
        excludePages: ['/webinar/*'],
      };

      (function (u) {
        const s = document.createElement('script')
        s.type = 'text/javascript'; s.async = true; s.src = u
        const x = document.getElementsByTagName('script')[0]
        x.parentNode.insertBefore(s, x)
      })('https://widget.replain.cc/dist/client.js')
    } else {
      const elem = document.getElementById('__replain_widget')
      if (elem) {
        elem.style.display = 'block'
      }
    }
    return () => widgetOff()
  }, [])

  const widgetOff = () => {
    const elem = document.getElementById('__replain_widget')
    if (elem) {
      const x = document.getElementsByTagName('script')[0]
      if (x) {
        x.parentNode.removeChild(document.getElementsByTagName('script')[0])
        elem.style.display = 'none'
      }
    }
  }

  return (
    <>
      <Scroll />
      <Header />
      <div className="landing_main">
        <div className="landing_content">
          <section className="section section_first" name="section_first" id="section_first">
            <FirstScreen />
          </section>
          <section className="section section_second" name="section_second" id="section_second">
            <SecondScreen />
          </section>
          <section className="section section_third" name="section_third" id="section_third">
            <ThirdScreen />
          </section>
          <section className="section section_fourth" name="section_fourth" id="section_fourth">
            <FourthScreen />
          </section>
          <section className="section section_fifth" name="section_fifth" id="section_fifth">
            <FifthScreen />
          </section>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Landing
