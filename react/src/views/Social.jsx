import { useState, useEffect , useRef} from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client'

export default function Social() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState()
  const [friendId, setFriendId] = useState()
  const [username, setUsername] = useState()
  const [friends, setFriends] = useState([])

  const [existing, setExisting] = useState(false) 
  const [errors, setErrors] = useState(null)

  const [cancelButtonText, setCancelButtonText] = useState('Отменить заявку')
  const [addingButtonText, setAddingButtonText] = useState('Добавить в друзья')
  const [deniedButtonText, setDeniedButtonText] = useState('Отклонить заявку')
  const [acceptButtonText, setAcceptButtonText] = useState('Принять заявку')
  const [deleteButtonText, setDeleteButtonText] = useState('Удалить')

  const usernameRef = useRef()

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
        setUserId(data.id)
        setUsername(data.name)
      })
    getUsers()
  }, [])

  const getUsers = () => {
    axiosClient.get("/social")
      .then(({data}) => {
        setUsers(data.data)
      })
  }

  const onFind = () => {
    const payload = {
      username: usernameRef.current.value
    }
    axiosClient.post('/find', payload)
      .then(({data}) => {
          setExisting(true)
          setFriends(data.data)
        }
        )
      .catch(err => {
        setExisting(false)
        if(err.response && err.response.status === 422) {
          setErrors(err.response.data.errors.username[0])
        }
      })
    }
  
  const onFriend = (id) => {
    setAddingButtonText('Заявка отправлена')
    axiosClient.post('/add', {id})
      .then(({data}) => {
        console.log(data);
        getUsers()
      })
      .catch((err) => {
        console.log(err);
      })
    setAddingButtonText('Добавить в друзья')
  }

  const onDelete = (id) => {
    if (!window.confirm("Are you sure about that?")) {
      return
    }
    
    setDeleteButtonText('Удалено!')

    axiosClient.post('/delete', {id}) 
      .then(() => {
        getUsers()
      })
    setDeleteButtonText('Удалить')
  }

  const onCancel = (id) => {
    if (!window.confirm("Are you sure about cancel?")) {
      return
    }
    setCancelButtonText('Заявка отменена')

    axiosClient.post('/delete', {id})
      .then(() => {
        getUsers()
      })

    setCancelButtonText('Отменить заявку')
  }

  const onDenied = (id) => {

    if (!window.confirm("Are you sure about cancel?")) {
      return
    }
    setDeniedButtonText('Заявка отклонена')

    axiosClient.post('/denied', {id})
      .then(() => {
        getUsers()
      })

  }

  const onAccept = (id) => {

    setAcceptButtonText('Заявка принята')
     
    axiosClient.put('/accept', {id})
      .then(() => {
        getUsers()
      })
      .catch((err) => {
        console.log(err);
      })
    setAcceptButtonText('Принять заявку')
  }

  return (
    <div className='container'>
      <div className='w-100'>
        <h1>Список друзей</h1>

        <div className="input-group mb-3">
          <input ref={usernameRef} 
          type="text" 
          className="form-control" 
          placeholder="Username"
          />
          <button onClick={onFind} className="btn btn-outline-secondary" data-bs-toggle="collapse" data-bs-target="#collapseFriends">Найти</button>
        </div>

        <div className="collapse" id="collapseFriends">
          <div className="card card-body">
            <table className="table">
              <tbody>

                {
                  existing
                    ? friends.map((f) => (
                        <tr>
                          <td>{f.id}</td>
                          <td>{f.name}</td>
                          <td>{f.email}</td>
                          <div>
                            <Link className='btn btn-success' to={`/show/${f.id}`}>Профиль</Link>
                            &nbsp;
                            &nbsp;
                            {
                              username != f.name && 
                                <button onClick={ev => onFriend(f.id)} className='btn btn-primary'>{addingButtonText}</button> 
                            }
                          </div>
                        </tr>
                      ))
                    : <p>{errors}</p>
                }

              </tbody>
            </table>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr>
                  {
                    u.name != username && <td>{u.id}</td>
                  }
                  {
                    u.name != username && <td><Link className="nav-link active" to={`/show/${u.id}`}>{u.name}</Link></td>
                  }
                  {
                    u.name != username && <td>{u.email}</td>
                  }
                  {
                    u.friendship_status == 0 &&
                      u.name != username && 
                        <td>
                          {
                            userId == u.user_id ?
                              <div>
                                <button className='btn btn-danger' onClick={ev => onCancel(u.id)}>{cancelButtonText}</button>
                              </div>
                              : <div>
                                <button className='btn btn-success' onClick={ev => onAccept(u.id)}>{acceptButtonText}</button>
                                &nbsp;
                                &nbsp;
                                <button className='btn btn-danger' onClick={ev => onDenied(u.id)}>{deniedButtonText}</button>
                              </div>
                          }
                        </td>
                  }
                  {
                    u.friendship_status == 1 &&
                      u.name != username && 
                        <td>
                          {
                            <div>
                              <button className='btn btn-danger' onClick={ev => onDelete(u.id)}>{deleteButtonText}</button>
                            </div>
                          }
                        </td>
                  }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}