'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Cart from "@/components/Cart";
import { useDispatch } from "react-redux";
import { addToCart, hideLoading } from "@/redux/slices/cartSlice";

interface Item {
  cart_item_id: number;
  user_id: string;
  product_id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export default function Navbar() {
    const menu = ["All", "Phones", "Tablets", "laptops", "Desktops", "Software"]
    const [data, setData] = useState({
      userId: '',
      userEmail: ''
    })
    const searchParams = useSearchParams()
    const params = searchParams.get('category')
    const  user =  useUser().user?.primaryEmailAddress?.emailAddress
    const id = useUser().user?.id
    const dispatch = useDispatch()
    const email = useUser().user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!email) {
          return; // Don't fetch if email is not available
        }

        const response = await fetch(`/api/cart?email=${email}`);

        if (response.ok) {
          const cartData = await response.json();
          // cartData.cartItems.map((item)=> console.log(item))
         cartData.cartItems.map((item: Item)=>{
          dispatch(
            addToCart({
              cart_item_id: item.cart_item_id as number,
              userid: item.user_id as string,
              id: item.product_id as string, 
              name: item.name as string,
              image: item.image as string,
              price: item.price as number,
              qty: item.qty as number,
            })
          );
         })
          
        } else {
          throw new Error("Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [email]);

    useEffect(() => {
      if (id && user) {
        setData({
          userId: id,
          userEmail: user
        });
      }
    }, [id, user]);
  
    useEffect(() => {
      if (data.userId && data.userEmail) {
        reg();
      }
    }, [data]);

    useEffect(()=>{
      dispatch(hideLoading())
    },[dispatch])
    
    const reg = async () => {
      try {
        let res = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify({data}),
        });
        console.log("success")
      } catch (error) {
        console.log('Error adding user:', error);
      }
    };

    return (
      <header>
      <nav className="relative flex items-center justify-between p-4 lg:px-6">
        <div className="w-full flex justify-around">
          <div className="flex ">
            <Link href="/" className="mr-2 flex items-center justify-center">
            <Image src="\img\codewave-central-high-resolution-logo-transparent.svg" alt="codewave logo" 
            className="w-52"
            width={100}
            height={100}
             />
            </Link>
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item) => (
                  <li key={item}
                  className={params === item ? "text-red underline" : "null"}>
                    <Link
                      href={item === 'All' ? `/product` : `/product?category=${item}`}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <SearchBar/>
          </div>
          <div>
            {data.userId ? <UserButton/>  
            : <SignInButton/>}
          </div>
          <Cart/>
        </div>
      </nav>
      </header>
    );
  }
  