import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'
import axiosClient from '../axios-client'

// TODO Добавить историю игр

export default function User() {

    const navigate = useNavigate()
    const {user, setUser} = useStateContext()

    useEffect(() => {
      axiosClient.get('/user')
        .then(({data}) => {
          setUser(data)
        })
    }, [])

    const onDelete = (user) => {
      if (!window.confirm('Удалить пользователя?')) {
        return
      }

      axiosClient.delete(`user/${user.id}`)
        .then(() => {
          // TODO: перенаправление на страницу регистрации после удаления аккаунта
        })
    }

    return (
      <div className="card w-75">
        <div className="card-header">
          <h2>Профиль пользователя</h2>
        </div>
        <div className="card-body">
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <h5>ID:</h5>
                <h5>Имя пользователя:</h5>
                <h5>Email:</h5>
                <h5>Количество игр:</h5>
                <h5>Процент побед:</h5>
                <div className='row'>
                  <div className='col mt-2'><Link to={"/user/"+user.id} className='btn btn-primary'>Редактировать</Link></div>
                  <div className='col mt-2'><button onClick={ev => onDelete(user)} className='btn btn-danger'>Удалить</button></div>
                </div>
              </div>
              <div className='col'>
                <h5>{user.id}</h5>
                <h5>{user.name}</h5>
                <h5>{user.email}</h5>
                <h5>total</h5>
                <h5>winrate</h5>
              </div>
            </div>  
          </div>
        </div>
      </div>
    )
}