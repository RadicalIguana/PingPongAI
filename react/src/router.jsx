import { createBrowserRouter } from 'react-router-dom'
import DefaultLayout from './components/DefaultLayout'
import GuestLayout from './components/GuestLayout'
import Login from './views/Login'
import NotFound from './views/NotFound'
import Signup from './views/Signup'
import User from './views/User'
import UserProfile from './views/UserProfile'
import Play from './views/Game/Play'
import Social from './views/Social'

import { Navigate } from 'react-router-dom'
import UserEditForm from './views/UserEditForm'

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
                path: '/user',
                element: <User />
            },
            {
                path: '/show/:id',
                element: <UserProfile />
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