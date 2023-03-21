import { useEffect } from 'react'

import axiosClient from '../axios-client'

export default function ChangePassword() {

  const [password, setPassword] = useState({
    old_password: '',
    new_password: '', 
    
  })

  useEffect(() => {
    axiosClient.get('/password')
      .then(({data}) => {
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  const onSubmit = () => {
    
  }

  return (
    <div>
        <div className='card w-75'>
            <form className='card-body' onSubmit={onSubmit}>
              <div>
                <h1>Изменение пароля</h1>
              </div>

              <div className='form-floating mb-3'>
                <input className='form-control' placeholder='Старый пароль'/>
                <label className='form-label'>Старый пароль</label>
              </div>

              <div className='form-floating mb-3'>
                <input className='form-control' placeholder='Новый пароль'/>
                <label className='form-label'>Новый пароль</label>
              </div>

              <div className='form-floating mb-3'>
                <input className='form-control' placeholder='Подтвердите пароль'/>
                <label className='form-label'>Подтвердите пароль</label>
              </div>

              <div>
                <button className='btn btn-success'>Сохранить</button>
                &nbsp;
                &nbsp;
                <button className='btn btn-danger'>Отмена</button>
              </div>


              {/* <div className='form-floating mb-3'>
                <input className='form-control' value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Имя пользователя" />
                <label className='form-label'>Имя пользователя</label>
              </div>
              <div className='form-floating mb-3'>
                <input className='form-control' value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email" />
                <label className='form-label'>Email</label>
              </div>
              <button className='btn btn-success'>Сохранить</button>
              &nbsp;
              &nbsp;
              <Link to='/change' className='btn btn-primary'>Изменить пароль</Link> */}
            </form>
        </div>
    </div>
  )
}
