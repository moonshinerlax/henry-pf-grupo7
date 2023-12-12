import { fetchProduct } from "../../lib/data";
import Image from "next/image";

type DetailProps = {
  params: {
    id: string;
    // Agrega cualquier otra propiedad que esperes recibir en params
  };
};

export default async function Detail({ params }: DetailProps) {
  type params = {
    id: string;
  };
  const { id } = params;
  const products = await fetchProduct();
  const productDetail = products.find((product) => product.id === id);

  if (!productDetail) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <main className="flex justify-center py-20 " >
      <section className=" flex justify-center  p-16 bg-white text-gray-900 bg-opacity-70 rounded-2xl">
        <section className=" p-16">
          <div className="w-80 h-80 relative p-10">
            <Image
              src={productDetail.image}
              alt={productDetail.model}
              layout="fill"
              className="rounded-lg"
            />
          </div>
        </section>
        <section className="flex-col p-16">
          <section className="flex-col ">
            <h1 className="text-2xl">{productDetail.model}</h1>
            <h2>{productDetail.category}</h2>
            <section className=" my-24 ">
              <p className="flex justify-center text-xl text-white bg-blue-500 w-min p-2 rounded-2xl">{productDetail.price}</p>
            </section>
          </section>
          <section>
            <a href={productDetail.website}>Website</a>
            {productDetail.specs && <h3>{productDetail.specs.platform}</h3>}
            {productDetail.specs && <p>{productDetail.specs.description}</p>}
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
