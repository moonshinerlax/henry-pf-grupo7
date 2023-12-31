import { useSelector } from "react-redux"
import { RootState, store } from "@/redux/store"
import Link from "next/link"
import Image from "next/image"
import { useDispatch } from "react-redux"
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice"

interface CartItem {
    id: string;
    image: string;
    price: number;
    qty: number;
  }
  
  interface Product {
    id: string;
    image: string;
    // Add other properties
  }
  
  interface CartSideBarProps {
    stock: number;
  }

export default function CartSideBar(){
    const stock = 20
    const {loading, cartItems, itemsPrice} = useSelector((state: RootState) => state.cart)
    const dispatch = useDispatch()
    const addToCartHandler = (product: Product, qty: number) => {
        dispatch(addToCart({...product, qty}))        
    }
    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id))
    }
    
    return(
        <div className="fixed top-0 right-0 w-32 h-full shadow-lg border-l border-l-gray-700 overflow-scroll">
            {loading ? 
                <div className="py-5 px-2">Loading...</div> 
                : cartItems.length === 0 ?
                <div className="py-5 px-2">Cart is Empty</div>
                :
                <>
                <div className="p-2 flex flex-col items-center border-b border-b-gray-600">
                    <div>Subtotal</div>
                    <div className="font-bold text-white-700">${itemsPrice}</div>
                    <div>
                        <Link
                            href='/cart'
                            className="w-full text-center p-1 underline">
                        Go to Cart
                        </Link>
                    </div>
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.id}
                                className="p-2 flex flex-col items-center border-b border-b-gray-600">
                                    <Link href={`/product/${item.id}`}
                                    className="flex items-center">
                                        <Image src={item.image} alt={item.id} 
                                        width={100}
                                        height={100}
                                        className="p-1"></Image>
                                    </Link>
                                    <select
                                    className="text-black"
                                    value={item.qty}
                                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}>
                                        {[...Array(stock).keys()].map((x)=>(
                                            <option
                                            key={x + 1} value={x + 1}>
                                                {x + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="default-button mt-2"
                                    onClick={()=> removeFromCartHandler(item.id)}>
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