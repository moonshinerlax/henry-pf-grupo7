"use client";
import React, { useState } from 'react';
import { useSearchParams } from "next/navigation";
import  Link from 'next/link';


const FilterbyPriceRange: React.FC = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rangePriceClicked, setRangePriceClicked] = useState(false);


  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
 
  params.set("minPrice", `${minPrice}`)
  params.set("maxPrice", `${maxPrice}`)

  return (
          <div className= "flex flex-col items-center bg-transparent justify-center w-72 h-12 text-center rounded-md border-gray-400 border text-sm text-gray-400 ">
          <div><h3 className=''>Range Price</h3></div>                 
                  <div className="flex flex-row justify-around items-center">
                    <input
                      className='w-1/3'
                      name="Minimum"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      />
                
                
                  
                    <input
                      className='w-1/3'
                      name="Maximum"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                 
                
               
                 <Link href={`/product?${params}`}>
                  <button
                    className="text-white bg-blue-500 w-14 rounded"
                       >
                    Apply
                  </button>
                  </Link> 
                </div>
                      
      </div>
     
  );
};

export default FilterbyPriceRange;
