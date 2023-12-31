'use client'

import { Suspense, useEffect } from "react"
import CartSideBar from "./CartSideBar"
import Navbar from "./layout/NavBar"
import { useDispatch } from "react-redux"
import { hideLoading } from "@/redux/slices/cartSlice"

export default function App({children,
}: {
  children: React.ReactNode}) {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(hideLoading())
    },[dispatch])
    return(
        <div>
            <div className="mr-32">
                <Navbar/>
                <Suspense>
                <main className="p-4">{children}</main>
                </Suspense>
            </div>
            <CartSideBar/>
        </div>
    )
}