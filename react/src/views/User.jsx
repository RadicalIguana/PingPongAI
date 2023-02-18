import React from 'react'

export default function User() {
    return (
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <ul>
          <li>Профиль</li>
          <li>Имя пользователя</li>
          <li>Количество игр</li>
          <li>Процент побед</li>
          <li>История игр</li>
        </ul>
      </div>
    )
}