import React from 'react'
import Header from '../../components/Header'
import Cards from "../../components/Cards"
import { useState, useEffect } from 'react'
import axios from 'axios'

const OverViewScreen = () => {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalSalesAmount: 0,
    totalOrders: 0,
    totalDues: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/analytics/summary", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setSummary(res.data);
      } catch (error) {
        console.log("Error Fetching Retailers", error.message);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <Header title="OverView Screen"/>
      <div className='flex-1 mt-5'>
        <Cards cardonename="Total Sales Revenue" cardtwoname="Total Revenue" 
          data1={summary.totalSalesAmount} data2={summary.totalRevenue}
        />
      </div>
      <div className='flex-1 mt-5'>
        <Cards cardonename="Total Orders" cardtwoname="Total Dues" data1={summary.totalOrders} data2={summary.totalDues}/>
      </div>

    </div>
  )
}

export default OverViewScreen