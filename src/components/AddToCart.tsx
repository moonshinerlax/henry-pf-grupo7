"use client";
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";



interface AddToCartProps {
  stock: number;
  productId: string;
  product: Record<string, unknown>; // Assuming product is an object
  showQty?: boolean;
  redirect?: boolean;
  increasePerClick?: boolean;
  buttonStyle?: string;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  stock,
  productId,
  product,
  showQty = true,
  redirect = false,
  increasePerClick = false,
  buttonStyle = ""
}) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const stock1 = 40;
  const [qty, setQty] = useState<number>(1);
  const email = useUser().user?.primaryEmailAddress?.emailAddress;

    const addToCartHandler = () => {
      let newQty = qty;
      if (increasePerClick) {
        const existItem = cartItems.find((x) => x.id === productId);
        if (existItem) {
          if (existItem.qty + 1 <= (stock1)) {
            newQty = existItem.qty + qty;
          } else {
            return alert("No more product exists");
          }
        }
      }
  
      const addToCartDB = async () => {
        const{model, image, price} = product
      let res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId, model, image, price, qty, email }),
      });
    }
      addToCartDB()

      dispatch(
        addToCart({
          cart_item_id: product.cart_item_id as number,
          userid: product.user_id as string,
          id: productId, 
          name: product.model as string,
          image: product.image as string,
          price: product.price as number,
          qty: newQty as number,
        })
      );
  if (redirect) router.push("/cart");
    }
 
  return (
    <>
      {stock > 0 ? (
        <div className="my-6 flex justify-between ">
          <div>Qty</div>
          <div className="w-1/3 flex justify-between items-center">
            <button className="w-1/3 text-xs h-fit border border-white rounded-sm" onClick={() => setQty(qty - 1)} disabled={qty === 1}>
              -
            </button>
            <span>{qty}</span>
            <button className="w-1/3 text-xs h-fit border border-white rounded-sm" onClick={() => setQty(qty + 1)} disabled={qty === stock}>
              +
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
      <div>
        <button
          className={`relative flex w-full items-center justify-center rounded-full bg-blue-600  tracking-wide text-white ${buttonStyle}`}
          onClick={addToCartHandler}
        >
          {/* <div className="absolute left-0 ml-3 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              ></path>
            </svg>
          </div> */}
          Add to cart
        </button>
      </div>
    </>
  );
};
