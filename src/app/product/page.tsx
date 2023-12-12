import { sql } from '@vercel/postgres';
import { Products } from '../lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
export const fetchCache = 'force-no-store';


export default async function Product({ searchParams }: { searchParams: { model: string; category?:string } }) {
  
    async function fetchData() {
        let data;
        let query
        try {
            if (searchParams.model && searchParams.category) {
                query = sql<Products>`
                  SELECT * FROM products 
                  WHERE model ILIKE '%' || ${searchParams.model} || '%' 
                  AND category ILIKE '%' || ${searchParams.category} || '%'
                `;}
            else if(searchParams.model)
          {query = await sql<Products>`SELECT * FROM products WHERE model ILIKE '%' || ${searchParams.model} || '%'`}
          else if(searchParams.category)
          {query = await sql<Products>`SELECT * FROM products WHERE category ILIKE '%' || ${searchParams.category} || '%'`}
          else {query = sql<Products>`SELECT * FROM products`;}
            data = await query;
            return data.rows
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }

const data = await fetchData();

  return (
    <main>
        {searchParams.category ? 
        <div className='flex flex-nowrap'><h2>Categoria: {searchParams.category}</h2>
        <Link href='/product'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="red" className="w-5 h-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
        </Link></div>
        : null}
      <div className="flex flex-wrap justify-center my-8 w-3/4">
            {data?.length ? data.map((product) => (
                <Link 
                key={product.id}
                href={`/product/${product.id}`}>
                <div className="flex flex-col h-72 w-72 cursor-pointer items-center border-solid border-x border-y border-gray-300 rounded m-2 hover:border-blue-600 bg-white justify-center">
                    <Image className="hover:w-52 mt-5"
                        src={product.image}
                        width={200}
                        height={200}
                        alt={product.model}
                    />
                    <div className="flex bg-white text-center justify-center mb-4 border-solid border-2 border-gray rounded-2xl w-3/4 mx-5 my-2 p-2 text-xs font-bold items-center">
                        <p className='text-black'>{product.model}</p>
                        <p className="bg-blue-600 mx-2 p-1 rounded-2xl text-white">{product.price} USD</p>
                    </div>
                </div>
                </Link>
            ))
        : <Link href='/product'><h1>Prodcuto no Existente</h1>
            </Link>}
        </div>
    </main>
  );
}