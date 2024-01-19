import { sql } from '@vercel/postgres';
import { Products } from '../lib/definitions';
import Image from 'next/image';
import Link from 'next/link';
import OrderButtons from '@/components/orderButtons';
import {AddToCart} from '@/components/AddToCart';
export const fetchCache = 'force-no-store';
import FilterbyPriceRange from '@/components/filterPriceRange';
import { parse } from 'path';
import AverageRatingStars from '@/components/RatingReview/AverageRating';
import { Suspense } from 'react';




export default async function Product({ searchParams }: 
  { searchParams: 
    { model: string; 
      category?:string; 
      ordByPrice:string;  
      minPrice:string; 
      maxPrice:string;} 
    }) {
  parseInt(searchParams.minPrice)
  parseInt(searchParams.maxPrice)
    async function fetchData() {
        let data;
        let list = []
        try {
          let query = 'SELECT * FROM products WHERE disable = false';
          if(searchParams.model){
            list.push(searchParams.model)
            query += ` AND model ILIKE '%' || $${list.length} || '%'`
          };
          if(searchParams.category){
            list.push(searchParams.category)
            query += ` AND category ILIKE '%' || $${list.length} || '%'`
          }

          if(searchParams.minPrice){
            list.push(searchParams.minPrice)
            query += ` AND CAST(Price AS DECIMAL) >= $${list.length}`
          }  

          if(searchParams.maxPrice){
            list.push(searchParams.maxPrice)
            query += ` AND CAST(Price AS DECIMAL) <= $${list.length}`
          }
          if(searchParams.ordByPrice){
            query += ` ORDER BY CAST(Price AS DECIMAL) ${searchParams.ordByPrice === 'max' ? 'DESC' : 'ASC'}`
          }
         
          query = query.replace(/ AND$/, "")
          query = query.replace(/ WHERE$/, "")
          data = await sql.query(query, list)
            return data.rows
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }

const data = await fetchData();


  return (
    <main className="flex flex-wrap flex-col content-center items-start mx-5">
      <Suspense fallback={<div>Loading...</div>}>
      <div className='w-full inline-flex justify-between'>
        {searchParams.category ? 
        <div className='gap-2 flex flex-row h-12 items-center border-gray-400 border bg-transparent rounded-md'><h2 className=' text-gray-400'>Category: {searchParams.category}</h2>
        
        <Link href='/product'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="red" className="w-5 h-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
        </Link>
        </div>
        : <div></div>}
        <FilterbyPriceRange />
        <OrderButtons/>
        </div> 
      <div className="flex flex-wrap justify-center my-8">
            {data?.length ? data.map((product) => (
                <div key={product.id} 
                className="flex flex-col h-96 w-72 cursor-pointer items-center border-solid border-x border-y border-gray-300 rounded m-2 hover:border-blue-600 bg-white justify-center">
                <Link href={`/product/${product.id}`}>
                  <div className="flex justify-center mt-2 self-start"> {/* Agregado self-start aquí */}
                    <AverageRatingStars productId={product.id}/>
                  </div>
                  <div className="w-52 h-56 flex justify-center items-center">
                    <Image 
                      className="hover:w-52 mt-5"
                      src={product.image}
                      width={200}
                      height={200}
                      // layout="responsive"
                      alt={product.model}
                    />
                  </div>
                  <div className="flex bg-white text-center justify-center mb-4 border-solid border-2 border-gray rounded-2xl w-11/12 mx-5 my-2 p-2 text-xs font-bold items-center">
                    <p className='text-black'>{product.model}</p>
                    <p className="bg-blue-600 mx-2 p-1 rounded-2xl text-white">${product.price} USD</p>
                  </div> 
                </Link>               
                <AddToCart 
                  buttonStyle="p-2 text-sm w-36"
                  stock={0}
                  productId={product.id}
                  showQty={false}
                  product={product}
                  increasePerClick={true}
                  redirect={false} 
                />
              </div>
              
            ))
        : <Link href='/product'><h1>Product not found!</h1>
            </Link>}
        </div>
        </Suspense>
    </main>
  );
}