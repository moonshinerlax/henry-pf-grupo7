'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export default function Purchases() {
    const user = useUser()
    const id = user.user?.id
    const [products, setProducts] = useState([])

    useEffect(()=>{
        const fetchPurchases = async ()=>{
            try {
                const response = await fetch(`/api/review?id=${id}`);
                  if (response.ok) {
                    const products = await response.json();
                    setProducts(products.ratings)
                  }    
            } catch (error) {
                console.log('error: ', error)
            }
        }
        fetchPurchases()
    },[])
    
        return(
            <div>

            </div>
        )
}