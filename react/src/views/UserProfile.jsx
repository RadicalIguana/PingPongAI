import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../axios-client'

export default function UserProfile() {

    let {id} = useParams()
    
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: ''
    })

    const [deleteButtonText, setDeleteButtonText] = useState('Удалить из друзей')

    useEffect(() => {
        axiosClient.get(`/user/${id}`)
            .then(({data}) => {
                setUser(data)
            })
        getWinners()
        getLosers()
        getScores()
    }, []) 

    // TODO проверить работу функции
    const onDelete = (id) => {
        if (!window.confirm("Are you sure about that?")) {
          return
        }
        
        setDeleteButtonText('Удален!')
    
        axiosClient.post('/delete', {id}) 

        setDeleteButtonText('Удалить из друзей')
      }

    const getWinners = () => {
        axiosClient.post('/winners', {id})
            .then(({data}) => {
                console.log(data);
                debugger
            })
    }

    const getLosers = () => {
        axiosClient.post('/losers', {id})
            .then(({data}) => {
                console.log(data);
                debugger
            })
    }
    const getScores = () => {
        axiosClient.post('/scores', {id})
            .then(({data}) => {
                console.log(data);
                debugger
            })
    }
    return (
        <div className='container'>
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
                  <div className='col mt-2'><button onClick={ev => onDelete(id)} className='btn btn-danger'>{deleteButtonText}</button></div>
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

        <div>
        <h1>История игр </h1>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Winner</th>
                    <th scope="col">Loser</th>
                    <th scope="col">Score</th>
                </tr>
            </thead>
            <tbody>
                {}
            </tbody>
            </table>
        </div>

        </div>
        
    )
}
