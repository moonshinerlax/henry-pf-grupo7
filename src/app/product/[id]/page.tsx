import { fetchDetailProduct } from "../../lib/data";
import Image from "next/image";
import { AddToCart } from "@/components/AddToCart";

export default async function Detail({params}:{params: {id: any}}) {
  const product = await fetchDetailProduct(params.id);
  const productDetail = product[0] 

  if (!productDetail) {
    return <div>Product not found!</div>;
  }

  return (
    <main className="flex justify-center py-20 " >
      <section className="w-4/5 flex justify-center  p-16 bg-white text-gray-900 bg-opacity-70 rounded-2xl">
        <section className=" p-16">
          <div 
          className="w-80 h-80 relative p-10">
            <Image
              src={productDetail.image}
              alt={productDetail.model}
              width={900}
                height={900}
              className="rounded-lg"
            />
            <div className="flex flex-row m-2 gap-2">
            {productDetail.carrusel ? 
              Object.entries(productDetail.carrusel).map(([key, value]) =>( 
              <div key={key} >
              <Image
                className=" rounded-md"
                src={value}
                width={100}
                height={100}
                alt={key}/>
              </div>
            )
            ) : null}
          </div>
          </div>
        </section>
        <section className="flex-col p-16">
          <section className="flex-col ">
            <h1 className="text-2xl font-bold">{productDetail.model}</h1>
            <h2>{productDetail.category}</h2>
            <section className=" my-20 ">
              <p className="flex justify-center text-xl text-white bg-blue-500 p-2 rounded-2xl">${productDetail.price} USD</p>
            </section>
            <section className="flex flex-col justify-center text-xl p-2 rounded-2xl">  
              <AddToCart 
                    stock={40}
                    productId={productDetail.id}
                    showQty={false}
                    product={productDetail}
                    increasePerClick={true}
                    redirect={false} />
            </section>
          </section>
          <section>
            {productDetail.website ? <a href={productDetail.website}>Website: {productDetail.website}</a> : null}
            <h1 className="text-2xl font-bold">Specs:</h1>
            {productDetail.specs ? Object.entries(productDetail.specs).map(([key, value]) =>( 
              <div key={key}>
              <h1 className="font-bold">{key}:</h1>
              <h1>{value}:</h1>
              </div>
            )
            ) : null}
          </section>
        </section>
      </section>
    </main>
  );
}

// id: '77ffa6b0-9b1b-49bc-8643-43df0b20cc34',
// model: 'Sketch',
// category: 'software',
// specs: {
//   platform: 'macOS',
//   description: 'Digital design tool for UI/UX designers to create user interfaces and prototypes.'
// },
// image: '/img/Sketch.jpg',
// colors: null,
// price: '$99/year',
// carrusel: null,
// video: null,
// website: 'https://www.sketch.com/'
