'use client'
import React, { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useUser } from "@clerk/nextjs";
import Purchases from "@/components/purchases/Purchases";


export default function Test (){

    const paymentId = 'testing456'
    const { user_id, cartItems, itemsPrice } = useSelector((state: RootState) => state.cart);
  const user = useUser()
  const email = user.user?.primaryEmailAddress?.emailAddress
  const name = user.user?.firstName ?? ''
  const requestBody = {
    paymentId: '67of56',
    user_id: user_id,
    cartItems: {cartItems}
  };

  const handleButton = ()=>{
    fetch("/api/orders", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed to post data. Status: ${response.status}`);
        }
      })
      .then((data) => {
        console.log('Data posted successfully:', data);
      })
      .catch((error) => {
        console.error('Error posting data:', error);
      });
  }
    

      return(
        <div>
            <button onClick={()=>{handleButton()}}>
                TESTING
            </button>
            <Purchases/>
        </div>
      )
}