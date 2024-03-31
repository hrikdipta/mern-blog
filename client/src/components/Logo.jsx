import React from 'react'
import { Link } from 'react-router-dom'

function Logo() {
    return (
        <div>
            <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-10" alt="Logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BlogSphere</span>
            </Link>
        </div>
    )
}

export default Logo
