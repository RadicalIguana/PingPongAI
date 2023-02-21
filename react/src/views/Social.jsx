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
              <th scope="col">#</th>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>35</td>
              <td>Mark</td>
              <td>Mark@example.com</td>
              <td>View profile - Delete</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>28</td>
              <td>NotMark</td>
              <td>NotMark@example.com</td>
              <td>View profile - Delete</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>122</td>
              <td>AndMark</td>
              <td>AndMark@example.com</td>
              <td>View profile - Delete</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}