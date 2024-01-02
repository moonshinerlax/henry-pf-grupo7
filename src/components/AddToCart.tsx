"use client"
import { useUser } from "@clerk/nextjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToCart } from "@/redux/slices/cartSlice";

interface AddToCartProps {
  stock: number;
  productId: string;
  product: Record<string, unknown>; // Assuming product is an object
  showQty?: boolean;
  redirect?: boolean;
  increasePerClick?: boolean;
}

export const AddToCart: React.FC<AddToCartProps> = ({
  stock,
  productId,
  product,
  showQty = true,
  redirect = false,
  increasePerClick = false,
}) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const stock1 = 40
  const [qty, setQty] = useState<number>(1);
  const email = useUser().user?.primaryEmailAddress?.emailAddress;

  const addToCartHandler = () => {
    let newQty = qty;
    if (increasePerClick) {
      const existItem = cartItems.find((x) => x.id === productId);
      if (existItem) {
        if (existItem.qty + 1 <= (stock1)) {
          newQty = existItem.qty + 1;
        } else {
          return alert("No more product exists");
        }
      }
    }

    dispatch(
      addToCart({
        id: productId, 
        name: product.model as string,
        image: product.image as string,
        price: product.price as number,
        qty: newQty as number,
      })
    );

  if (redirect) router.push("/cart");
    }
  // const addToCartDB = async () => {
  //   let res = await fetch("/api/cart", {
  //     method: "POST",
  //     body: JSON.stringify({ productId, email }),
  //   });
  // };

  return (
    <>
    {stock > 0  ? (
      <div className="mb-2 flex justify-between text-black">
        <div>Qty</div>
        <div>
          <select
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {[...Array(stock).keys()].map((x) => (
              <option key={x + 1} value={x + 1}>
                {x + 1}
              </option>
            ))}
          </select>{' '}
        </div>
      </div>
    ) : ''}
    <div>
        <button className="bg-blue-500 p-1 rounded-2xl text-white" onClick={addToCartHandler}>
          Add to cart
        </button>
    </div>
  </>
)
}