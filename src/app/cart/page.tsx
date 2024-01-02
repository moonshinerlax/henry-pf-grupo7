'use client'
import { RootState } from "@/redux/store"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice"
import Link from "next/link"
import Image from "next/image"

interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    // Add other properties
  }

export default function CartPage(){
    const dispatch = useDispatch()
    const router = useRouter()
    const {loading, cartItems, itemsPrice} = useSelector((state: RootState) => state.cart)

    const removeFromCartHandler = (id: string) => {
        dispatch(removeFromCart(id))
    }
    const addToCartHandler = (product: Product, qty: number) => {
        dispatch(addToCart({...product, qty}))        
    }

    return(
        <div className="flex flex-col flex-wrap content-center">
            <h1 className="mb-4 text-xl">Shopping Cart</h1>
            {loading ? (
                <div>Loading...</div>
                ) : cartItems.length === 0 ? (
                    <div>
                        Cart is Empty. <Link className="underline" href="/">Go Shopping!</Link>
                    </div>
                    ) : (
                    <div className="w-1/2 grid md:grid-cols-4 md:gap-5">
                        <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full bg-slate-100 rounded-lg">
              <thead className="border-b text-gray-900">
                <tr>
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-right">Quantity</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b text-gray-900">
                    <td>
                      <Link
                        href={`/product/${item.id}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.id}
                          width={50}
                          height={50}
                          className="p-1"
                        ></Image>
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-5 text-right">
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          addToCartHandler(item, Number(e.target.value))
                        }
                      >
                        {[...Array(40).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                      <button
                        className="w-full bg-red-500 rounded-lg text-white"
                        onClick={() => removeFromCartHandler(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card p-5 bg-slate-100 rounded-lg text-gray-900">
              <ul>
                <li>
                  <div className="pb-3 text-xl">
                    Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}) : $
                    {itemsPrice}
                  </div>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/shipping')}
                    className="primary-button w-full bg-blue-500 text-white rounded-lg"
                  >
                    Proceed to checkout
                  </button>
                </li>
              </ul>
            </div>
          </div>
                    </div>
             )}
        </div>
    )
}