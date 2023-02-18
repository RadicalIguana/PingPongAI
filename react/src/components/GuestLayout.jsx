import React, { useDebugValue } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'

export default function GuestLayout() {
  const { token } = useStateContext()

  if (token) {
    return <Navigate to='/user'/>
  }

  return (
    <div id='guestLayout'>
        <Outlet/>
    </div>
  )
}
