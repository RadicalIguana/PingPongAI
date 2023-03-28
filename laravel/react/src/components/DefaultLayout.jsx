import React, { useEffect } from 'react'
import { Outlet, Link, Navigate} from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'
import axiosClient from '../axios-client'
import { useState } from 'react'

export default function DefaultLayout() {
  const {user, token, setUser, setToken} = useStateContext()

  const [friend, setFriend] = useState(false)

  let userId 

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUser(data)
        userId = data.id
      })
    axiosClient.get('/check', {userId})
      .then((data) => {
        setFriend(false)
        if (data.data.length === 0) {
          setFriend(false)
          console.log("Заявок на дружбу нет");
        } else {
          setFriend(true)
          console.log("Заявки на дружбу есть");
        }
      })
  }, [])
  
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
              <div className="position-sticky pt-3 sidebar-sticky ">
                <ul className="nav d-grid gap-3 col-7 mx-auto">
                  <li className="nav-item">
                      <span data-feather="home" className="align-text-bottom"></span>
                      <Link className="btn btn-outline-dark nav-link" to='/play'>Play a game</Link>
                  </li>
                  <li className="nav-item">
                      <Link className="btn btn-outline-dark  nav-link" to='/user'>Profile</Link>
                  </li>
                  <li className="nav-item">
                      <span data-feather="file" className="align-text-bottom"></span>
                      <Link className="btn btn-outline-dark nav-link position-relative" to='/social'>
                        {
                          friend == true
                          ?
                              <div>
                                Social
                                <span className='position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle'>
                                  <span className='visually-hidden'>New alerts</span>
                                </span>    
                              </div>
                          :
                            <div>
                              Social
                            </div>
                        }
                      </Link>
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
