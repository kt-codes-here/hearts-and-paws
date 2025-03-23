'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const ProfilePage = (props: Props) => {
    const {user} = useUser()
    console.log("USER",user)

    if (!user) return <p>"Unauthorized Access"</p>;

    
  return (
    <div className='flex flex-col md:flex-row gap-6 p-4 max-w-6xl mx-auto'>
<h1>Profile</h1>
    </div>
  )
}

export default ProfilePage