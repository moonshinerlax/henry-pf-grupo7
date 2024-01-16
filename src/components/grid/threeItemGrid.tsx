import { fetchProduct } from "@/app/lib/data";
import { GridTileImage } from "./tile";
import Link from "next/link";
import { Products } from "@/app/lib/definitions";

function ThreeItemGridItem({
    item,
    size,
    priority
  }: {
    item: Products;
    size: 'full' | 'half';
    priority?: boolean;
  }) {
    return (
        <div className={size === 'full' ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-1'}>
                <Link className="relative block aspect-square h-full w-full" href={`/product/${item.id}`}>
                <GridTileImage
                src={item.image}
                fill
                sizes={
                    size === 'full' ? '(min-width: 900px) 66vw, 100vw' : '(min-width: 900px) 33vw, 100vw'}
                priority={priority}
                alt={item.model}
                label={{
                    position: size === 'full' ? 'center' : 'bottom',
                    title: item.model as string,
                    amount: item.price.toString()
                  }}
                />
                </Link>
        </div>
    )
}

function shuffleArray(array: any) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function ThreeItemGrid() {
    // Collections that start with `hidden-*` are hidden from the search page.
    const homepageItems = await fetchProduct();
  
    if (homepageItems?.length === 0) return null;
    const shuffledItems = shuffleArray(homepageItems);
    const [firstProduct, secondProduct, thirdProduct] = shuffledItems.slice(0, 3);
  
    // const [firstProduct, secondProduct, thirdProduct] = homepageItems;
    if(homepageItems){
    // const firstProduct = homepageItems[8]
    // const secondProduct = homepageItems[1]
    // const thirdProduct = homepageItems[16]
    return (
      <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 w-">
        <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
        <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
        <ThreeItemGridItem size="half" item={thirdProduct} />
      </section>
    );}
  }