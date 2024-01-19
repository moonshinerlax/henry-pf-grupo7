import Link from 'next/link';
import { GridTileImage } from './grid/tile';
import { fetchProduct } from '@/app/lib/data';
import { shuffleArray } from '@/app/lib/utils';
import style from '../components/layout/NavBar/navBar.module.css'

export async function Carousel() {

    const products = await fetchProduct();
   
  if (!products?.length) return null;

  // const carouselProducts = [...products, ...products, ...products]

  const shuffleProduct = shuffleArray(products)
  const carouselProducts = [...shuffleProduct];

  return (
      <div className=" w-full overflow-x-auto pb-6 pt-1">
        <ul className={style.carousel}>
          {carouselProducts.map((product, i) => {
          const index = i % carouselProducts.length; // Use modulo to loop back to the beginning
          return (
            <li
              key={`${product.id}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link href={`/product/${product.id}`} className="relative h-full w-full">
                <GridTileImage
                  alt={product.model}
                  label={{
                    title: product.model,
                    amount: product.price.toString(),
                  }}
                  src={product.carrusel ? (product.carrusel as { img1: string }).img1 : product.image}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          )})}
        </ul>
      </div>
  );
}