import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/contextProvider'
import axiosClient from '../axios-client'

export default function User() {

    const {user, setUser} = useStateContext()

    const [result, setResult] = useState([])

    // const [id, setId] = useState()

    const [empty, setEmpty] = useState(false)

    const [total, setTotal] = useState()
    const [winrate, setWinrate] = useState()

    let id

    useEffect(() => {
        
      async function fetchData () {
        await getData()
        await getResult()
        await getTotal()
        await getWinrate()
      
      }

      fetchData()
        
    }, [])


    const getData = async () => {
      await axiosClient.get('/user')
        .then(({data}) => {
          setUser(data)
          id = data.id
      })
    }
  
    const getResult = async () => {
      setEmpty(false)

      await axiosClient.post('/result', {id})
          .then(({data}) => {
              setResult(data.data)
              
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
                  <div className='col mt-2'><Link to={"/user/"+user.id} className='btn btn-primary'>Редактировать</Link></div>
                  <div className='col mt-2'><button onClick={ev => onDelete(user)} className='btn btn-danger'>Удалить</button></div>
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