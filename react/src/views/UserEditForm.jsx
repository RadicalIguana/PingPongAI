import {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../axios-client'


export default function UserEditForm() {

    const navigate = useNavigate()

    let {id} = useParams()
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: ''
    })

    useEffect(() => {
        axiosClient.get(`/user/${id}`)
            .then(({data}) => {
                setUser(data)
            })
    }, []) 

    const onSubmit = (ev) => {
        ev.preventDefault()
        axiosClient.put(`/user/${id}`, user)
            .then(() => {
                // TODO show user edit notification
              navigate('/user')
            })
    }

    return (
        <div className='card w-75'>
            <form className='card-body' onSubmit={onSubmit}>
              <div>
                {user.id && <h1>Редактировать профиль</h1>}
              </div>
              <div className='form-floating mb-3'>
                <input className='form-control' value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Имя пользователя" />
                <label className='form-label'>Имя пользователя</label>
              </div>
              <div className='form-floating mb-3'>
                <input className='form-control' value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email" />
                <label className='form-label'>Email</label>
              </div>
              <button className='btn btn-primary'>Сохранить</button>
            </form>
        </div>
      )
}
