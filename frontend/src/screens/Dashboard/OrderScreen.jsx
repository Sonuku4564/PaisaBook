import React from 'react'
import Header from '../../components/Header'
import OrderTable from '../../components/OrderTable'


const OrderScreen = () => {
  return (
    <div>
      <Header title="Order Screen"/>
      <div className="mt-5">
        <OrderTable/>
      </div>

    </div>

  )
}

export default OrderScreen