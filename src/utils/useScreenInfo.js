import React, { useEffect, useState } from 'react'

const useScreenInfo = () => {
  const [screenInfo, setScreenInfo] = useState({})

  useEffect(() => {
    const setSize = () => {
      setScreenInfo({ height: window.innerHeight, width: window.innerWidth })
    }
    setScreenInfo({ height: window.innerHeight, width: window.innerWidth })
    window.addEventListener('resize', setSize)
    return () => window.removeEventListener('resize', setSize)
  }, [])

  return screenInfo
}

export default useScreenInfo
