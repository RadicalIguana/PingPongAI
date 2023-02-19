import React from 'react'

export default function User() {
    return (

      <div class="card w-75">
        <div class="card-header">
          <h2>Профиль пользователя</h2>
        </div>
        <div class="card-body">
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <h5>Имя пользователя:</h5>
                <h5>Email:</h5>
                <h5>Количество игр:</h5>
                <h5>Процент побед:</h5>
                <div className='row'>
                  <div className='col mt-2'><button className='btn btn-primary'>Редактировать</button></div>
                  <div className='col mt-2'><button className='btn btn-danger'>Удалить</button></div>
                </div>
              </div>
              <div className='col'>
                <h5>username</h5>
                <h5>email</h5>
                <h5>total games</h5>
                <h5>winrate</h5>
              </div>
            </div>  
          </div>
        </div>
      </div>

      // <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
      //   <ul>
      //     <li>Профиль</li>
      //     <li>Имя пользователя</li>
      //     <li>Количество игр</li>
      //     <li>Процент побед</li>
      //     <li>История игр</li>
      //   </ul>
      // </div>
    )
}