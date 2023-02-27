import { useState, useEffect , useRef} from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client'

export default function Social() {
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])

  const [existing, setExisting] = useState(false)
  const [errors, setErrors] = useState(null)
  const [added, setAdded] = useState(false)

  const usernameRef = useRef()

  useEffect(() => {
    getUsers()
  }, [])

  const getUsers = () => {
    axiosClient.get("/social")
      .then(({data}) => {
        console.log(data);
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
    axiosClient.post('/add', {id})
      .then(({data}) => {
        console.log(data);
        getUsers()
      })
  }

  const onDelete = (id) => {
    if (!window.confirm("Are you sure about that?")) {
      return
    }

    axiosClient.post('/delete', {id}) 
      .then(() => {
        getUsers()
      })
  }

  return (
    <div className='container'>
      <div className='w-100'>
        <h1>Список друзей</h1>

        <div className="input-group mb-3">
          <input ref={usernameRef} type="text" className="form-control" placeholder="Username"/>
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
                            <Link className='btn btn-success' to='/user'>Профиль</Link>
                            &nbsp;
                            &nbsp;
                            <button onClick={ev => onFriend(f.id)} className='btn btn-primary'>Добавить</button>
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
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <div>
                      <Link className='btn btn-success' to='/user'>Профиль</Link>
                      &nbsp;
                      &nbsp;
                      <button className='btn btn-danger' onClick={ev => onDelete(u.id)}>Удалить</button>
                    </div>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}