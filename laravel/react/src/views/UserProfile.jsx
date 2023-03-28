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
              
              console.log(id);
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


    const onDelete = (id) => {
        
        setDeleteButtonText('Удален!')
    
        axiosClient.post('/delete', {id}) 
          .then((response) => {
            console.log(response);
          })
          .then((err) => {
            console.log(err);
          })

        setDeleteButtonText('Удалить из друзей')
      }

    const myModal = document.getElementById('exampleModal')
    const myInput = document.getElementById('myInput')

    if (myModal) {
      myModal.addEventListener('show.bs.modal', () => {
        myInput.focus()
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
                  <div className='col mt-2'>
                    <button type='button'  className='btn btn-danger' 
                      data-bs-toggle='modal' data-bs-target='#exampleModal'>
                        {deleteButtonText}
                    </button>
                  </div>

                  {/* Modal window */}
                  <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Удаление из друзей</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body" style={{whiteSpace: 'pre-wrap'}}>
                            Вы уверены, что хотите удалить пользователя {user.name} из списка ваших друзей?
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                            <button type="button" className="btn btn-danger" onClick={ev => onDelete(id)}>Удалить</button>
                          </div>
                        </div>
                      </div>
                    </div>

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
