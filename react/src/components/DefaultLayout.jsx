import React, { useEffect } from 'react'
import { Outlet, Link, Navigate} from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'
import axiosClient from '../axios-client'

export default function DefaultLayout() {
  const {user, token, setUser, setToken} = useStateContext()
  
  if (!token) {
    return <Navigate to='/login'/>
  }

  const onLogout = (ev) => {
    ev.preventDefault()

    axiosClient.post('/logout')
      .then(() => {
        setUser({})
        setToken(null)
      })
  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
      })
  }, [])

  return (
    <div>
        <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
          <Link className="link navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" to="/user">{user.name}</Link>
          <div className="navbar-nav"> 
            <div className="nav-item text-nowrap">
              <a className="nav-link px-3" href="#" onClick={onLogout}>Sign out</a>
            </div>
          </div>
        </header>


        <div style={{display: 'flex'}}>
          <div className='col-md-2'>
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
              <div className="position-sticky pt-3 sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                      <span data-feather="home" className="align-text-bottom"></span>
                      <Link className="nav-link active" to='/play'>Play a game</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="nav-link active" to='/user'>Profile</Link>
                  </li>
                  <li className="nav-item">
                      <span data-feather="file" className="align-text-bottom"></span>
                      <Link className="nav-link active" to='/social'>Social</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className='col-md-10'>
            <main className="main">
                <Outlet/>
            </main>
          </div>
        </div>


      </div>
  )
}
