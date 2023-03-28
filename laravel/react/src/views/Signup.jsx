import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client'
import { useStateContext } from '../contexts/contextProvider'
 

export default function Signup() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmationRef = useRef()

  const [errors, setErrors] = useState(null)
  const {setUser, setToken} = useStateContext()

  const onSubmit = (ev) => {
    ev.preventDefault()
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value
    }    
    console.log(payload)
    axiosClient.post('/signup', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(err => {
        const response = err.response
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  return (
    <div className="text-center">
      <main className="form-signin w-100">
        <form onSubmit={onSubmit} >
          <h1 className="h3 mb-3 fw-normal">Please sign up</h1>
          {errors && 
              <div className='alert alert-danger alert-dismissible' role='alert'>
                {Object.keys(errors).map(key => (
                  <p key={key}>{errors[key][0]}</p>
                ))}
              </div>
            }
          <div className="form-floating">
            <input ref={nameRef} className="form-control" id="floatingInput" placeholder="Username" />
            <label htmlFor="floatingPassword">Username</label>
          </div>
          <div className="form-floating">
            <input ref={emailRef} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input ref={passwordRef} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <div className="form-floating">
            <input ref={passwordConfirmationRef} type="password" className="form-control" id="floatingPassword" placeholder="Password Confirmation" />
            <label htmlFor="floatingPassword">Password Confirmation</label>
          </div>
          <button className="sul-btn w-100 btn btn-lg btn-primary">Sign up</button>
          <p className="message">Already registered? <Link to="/login">Sign In</Link></p>
        </form>
      </main>
    </div>
  )
}
