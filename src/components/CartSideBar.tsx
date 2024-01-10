import { useSelector } from "react-redux"
import { RootState, store } from "@/redux/store"
import Link from "next/link"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice"
import { usePathname } from 'next/navigation'
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs";

interface CartItem {
    cart_item_id: number;
    userid: string;
    id: string;
    image: string;
    price: number;
    qty: number;
  }
  
  interface Product {
    cart_item_id: number;
    userid: string;
    id: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    // Add other properties
  }
  
  interface CartSideBarProps {
    stock: number;
  }

export default function CartSideBar(){
    const stock = 20
    const {loading, cartItems, itemsPrice} = useSelector((state: RootState) => state.cart)
    const dispatch = useDispatch()
    const [qtyItem, setQtyItem] = useState(0)
    
    const addToCartHandler = (product: Product, cart_item_id: number, qty: number) => {
      const updateQtyDB = async () => {
        try {
          let res = await fetch("/api/cart", {
            method: "PUT",
            body: JSON.stringify({ cart_item_id, qty }),
          });
          return console.log('qty udpaded to', qty)    
        } catch (error) {
          console.log('error', error)
        }       
    }
    updateQtyDB()
    dispatch(addToCart({...product, qty})) 
  }

    const removeFromCartHandler = (id: string, cart_item_id: number) => {
      const removeFromCartDB = async () => {
        try {
          let res = await fetch("/api/cart", {
            method: "DELETE",
            body: JSON.stringify({ cart_item_id }),
          });
          return console.log('deleted', cart_item_id)    
        } catch (error) {
          console.log('error', error)
        }
      
    }  
      removeFromCartDB()
      dispatch(removeFromCart(id))
    }

    const pathname = usePathname()
    
    return(
    <div
    className={
        loading
          ? ''
          : cartItems.length > 0 && (pathname === '/' || pathname === '/payment' || pathname === '/shipping' || pathname.indexOf('/product' ) >= 0)
          ? 'fixed top-0 right-0 w-32 h-full shadow-lg border-l border-l-gray-700 overflow-scroll'
          : 'hidden'
      }
      >
            {loading ? 
                <div className="py-5 px-2 text-gray-300">Loading...</div> 
                : cartItems.length === 0 ?
                <div className="py-5 px-2 text-gray-300">Cart is Empty</div>
                :
                <>
                <div className="p-2 flex flex-col items-center border-b border-b-gray-600 text-gray-200">
                    <div>Subtotal</div>
                    <div className="font-bold text-white-700">${itemsPrice}</div>
                    <div>
                        <Link
                            href='/cart'
                            className="w-full text-center p-1 bg-blue-500 text-white rounded-md">
                        Go to Cart
                        </Link>
                    </div>
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.id}
                                className="p-2 flex flex-col items-center border-b border-b-gray-600">
                                    <Link href={`/product/${item.id}`}
                                    className="flex items-center">
                                        <Image 
                                        src={item.image} alt={item.id} 
                                        width={100}
                                        height={100}
                                        className="p-1 rounded-md"></Image>
                                    </Link>
                                    <select
                                    className="text-gray-300 bg-transparent border-gray-400 border rounded-md"
                                    value={item.qty}
                                    onChange={
                                      (e) => addToCartHandler(item, item.cart_item_id, Number(e.target.value))
                                    }>
                                        {[...Array(stock).keys()].map((x)=>(
                                            <option
                                            className="text-gray-300 bg-gray-900 border-gray-400 border rounded-md"
                                            key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="default-button mt-2 bg-red-500 text-white rounded-md w-full"
                                    onClick={()=> removeFromCartHandler(item.id ,item.cart_item_id)}>
                                        Delete
                                    </button>
                            </div>
                        ))}
                    </div>
                </div>
                </>
            }
        </div>
    )
}