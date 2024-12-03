import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import FileUploader from './FileUploader'
import Search from './Search'

const Header = () => {
  return (
    <header className='header'>
        <Search />
        <div className='header-wrapper'>
            <FileUploader />
            <form>
                <Button className='sign-out-button' type="submit">
                    <Image src="/assets/icons/logout.svg" alt="logo" width={24} height={24} className='w-6' />
                </Button>
            </form>
        </div>
    </header>
  )
}

export default Header