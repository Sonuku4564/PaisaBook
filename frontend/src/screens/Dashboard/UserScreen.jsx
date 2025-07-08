import React from 'react'
import Header from "../../components/Header"
import UsersTable from '../../components/UsersTable'

const UserScreen = () => {
  return (
    <div>
      <Header title="Retailers Screen"/>
      <div className="mt-3"></div>
      <UsersTable/>
    </div>
    
  )
}

export default UserScreen