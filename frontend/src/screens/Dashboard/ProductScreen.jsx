import React from 'react'
import Header from '../../components/Header'
import ProductsTable from "../../components/ProductsTable"
const ProductScreen = () => {
  return (
    <div>
      <Header title="Product Screen" />
      <div className="mt-3"></div>
      <ProductsTable/>
    </div>
  )
}

export default ProductScreen