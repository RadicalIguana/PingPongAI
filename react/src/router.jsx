import { createBrowserRouter } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'
import GuestLayout from './components/GuestLayout'
import Login from './views/Login'
import NotFound from './views/NotFound'
import Signup from './views/Signup'
import User from './views/User'
import Play from './views/Game/Play'
import Social from './views/Social'

import { Navigate } from 'react-router-dom'
import UserEditForm from './views/UserEditForm'
import Pvp from './views/Game/Pvp'
import Pve from './views/Game/Pve'

const router = createBrowserRouter([

    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {   
                path: '/',
                element: <Navigate to='/user'/>
            },
            {
                path: '/user',
                element: <User />
            },
            {
                path: '/user/:id',
                element: <UserEditForm />
            },
            {
                path: '/play',
                element: <Play />
            },
            {
                path: '/play/pvp',
                element: <Pvp />
            },
            {
                path: '/play/pve',
                element: <Pve />
            },
            {
                path: '/social',
                element: <Social/>
            },
        ]
    },
    {   
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
        ]
    },

    {
        path: '*',
        element: <NotFound />
    },
])

export default router