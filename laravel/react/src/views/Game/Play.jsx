import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { Link } from 'react-router-dom'


export default function Play() {
  return (
    <div>
      <a href='/play/pvp' className='btn btn-danger'>Игра против игрока</a>
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;
      <Link to='/play/pve' className='btn btn-success'>Игра против нейронки</Link>
    </div>
  )
}