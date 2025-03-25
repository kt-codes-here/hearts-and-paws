'use client'

import UserProfile from '@/components/global/userProfile'
import { useUser } from '@clerk/nextjs'
import React from 'react'

type Props = {}

const ProfilePage = (props: Props) => {
    const {user} = useUser()
    console.log("USER",user)

    if (!user) return <p>"Unauthorized Access"</p>;

    
  return (
    <UserProfile/>
  )
}

export default ProfilePage