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

    const [total, setTotal] = useState()
    const [winrate, setWinrate] = useState()

    const [result, setResult] = useState([])
    const [empty, setEmpty] = useState(false)

    const [deleteButtonText, setDeleteButtonText] = useState('Удалить из друзей')

    useEffect(() => {
        axiosClient.get(`/user/${id}`)
            .then(({data}) => {
              debugger
                setUser(data)
            })
        getResult()
        getTotal()
        getWinrate()
    }, []) 

    const getResult = async () => {
      setEmpty(false)
      await axiosClient.post('/result', {id})
          .then(({data}) => {
              debugger
              console.log(id);
              setResult(data.data)
              debugger
              if (data.data.length == 0) setEmpty(true)
          })
    }

    const getTotal = async () => {
      await axiosClient.post('/total', {id})
        .then(({data}) => {
          setTotal(data.data)
        })
    }

    const getWinrate = async () => {
      await axiosClient.post('/winrate', {id})
        .then(({data}) => {
          setWinrate(data.data)
        })
    }


    // TODO проверить работу функции
    const onDelete = (id) => {
        if (!window.confirm("Are you sure about that?")) {
          return
        }
        
        setDeleteButtonText('Удален!')
    
        axiosClient.post('/delete', {id}) 

        setDeleteButtonText('Удалить из друзей')
      }

    return (
        <div className='container'>
            <div className="card w-75 mx-auto">
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
                <h5>{total}</h5>
                <h5>{winrate}%</h5>
                </div>
              </div>
            </div>  
          </div>
        </div>

        <div className='container'>
          <h1 className='text-center'>История игр</h1>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Winner</th>
                <th scope="col">Loser</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {
                result.map((r) => (
                  <tr>
                    <td>{r.winner_name}</td>
                    <td>{r.loser_name}</td>
                    <td>{r.game_result}</td>
                  </tr>
                ))
              } 
            </tbody>
          </table>
          {
            empty &&
              <h1 className='text-center'>История игр пуста</h1>
          }
        </div>

        </div>
        
    )
}
