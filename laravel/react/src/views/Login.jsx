import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'
import axiosClient from '../axios-client'

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [errors, setErrors] = useState(null)
  const {setUser, setToken} = useStateContext()
  
  const onSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    console.log(payload)
    // request to the server
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
      
        setToken(data.token)
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors) 
          } else {
            setErrors({
              email: [response.data.message]
            })
          }
        }
      })
  } 

  return (
    <div className="text-center">
      <main className="form-signin w-100">
        <form onSubmit={onSubmit}>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          {errors && 
              <div className='alert alert-danger alert-dismissible' role='alert'>
                {Object.keys(errors).map(key => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            }

          <div className="form-floating">
            <input ref={emailRef} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input ref={passwordRef} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button className="sul-btn w-100 btn btn-lg btn-primary">Sign in</button>
          <p className="message">Not registered? <Link to="/signup">Create an account</Link></p>
        </form>
      </main>
    </div>
  )
}
