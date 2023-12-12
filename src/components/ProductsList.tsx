import { fetchProduct } from '../app/lib/data'
import Image from 'next/image'



export default async function ProductsList () {
    const products = await fetchProduct()

    return (
        <div className="flex flex-wrap justify-center my-8 w-3/4">
            {products?.map((product) => (
                <div className="flex flex-col h-72 w-72 cursor-pointer items-center border-solid border-x border-y border-gray-300 rounded m-2 hover:border-blue-600 bg-white justify-center"
                    key={product.id}>
                    <Image className="hover:w-52 mt-5"
                        src={product.image}
                        width={200}
                        height={200}
                        alt={product.model}
                    />
                    <div className="flex bg-white text-center justify-center mb-4 border-solid border-2 border-gray rounded-2xl w-3/4 mx-5 my-2 p-2 text-xs font-bold items-center">
                        <p>{product.model}</p>
                        <p className="bg-blue-600 mx-2 p-1 rounded-2xl text-white">{product.price} USD</p>
                    </div>
                </div>
            ))}
        </div>
    )
}