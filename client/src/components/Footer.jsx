import React from 'react'
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { Footer } from 'flowbite-react'
import { BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs';
function FooterCom() {
  return (
    <Footer container className=' border-t-2 '>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Logo />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Company" />
              <Footer.LinkGroup col>
                <Link  to='/about' ><Footer.Link href="#" as='div' >About us</Footer.Link></Link>
                <Link to="#"><Footer.Link href="#" as='div'>Pricing</Footer.Link></Link>
                <Link to="#"><Footer.Link href="#" as='div'>Contact us</Footer.Link></Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/hrikdipta">Github</Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright className=' font-samarkan' by="Hrikdipta Kundu" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="https://www.facebook.com/profile.php?id=100072202299973" target='_balnk' icon={BsFacebook} />
            <Footer.Icon href="https://www.instagram.com/hrikdiptakundu/" target='_balnk' icon={BsInstagram} />
            <Footer.Icon href="#" target='_balnk' icon={BsTwitter} />
            <Footer.Icon href="https://github.com/hrikdipta" target='_balnk' icon={BsGithub} />
            
          </div>
        </div>
      </div>
    </Footer>
  )
}

export default FooterCom
