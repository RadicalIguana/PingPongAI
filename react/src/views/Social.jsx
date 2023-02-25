import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../axios-client'

export default function Social() {

  return (
    <div className='container'>
      <div className='w-100'>
        <h1>Список друзей в начальном состоянии</h1>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>35</td>
              <td>Mark</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}