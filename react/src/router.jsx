import { createBrowserRouter } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'
import GuestLayout from './components/GuestLayout'
import Login from './views/Login'
import NotFound from './views/NotFound'
import Signup from './views/Signup'
import User from './views/User'
import Play from './views/Play'

import { Navigate } from 'react-router-dom'

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
                path: '/play',
                element: <Play />
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