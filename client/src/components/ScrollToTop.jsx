import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
function ScrollToTop() {
    const path=useLocation().pathname;
    useEffect(()=>{
        window.scrollTo(0,0)
    },[path])
  return null;
}

export default ScrollToTop
