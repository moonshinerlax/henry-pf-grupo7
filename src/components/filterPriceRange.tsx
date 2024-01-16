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
          
     <div className= "grid grid-cols-3 grid-rows-2 gap-2 bg-transparent justify-end text-center rounded-md border-gray-400 border text-sm text-gray-400 ">
      <h3 className='col-start-1 col-end-4 row-start-1'>Range Price</h3>                 
                  <div className="col-start-1 row-start-2">
                    <input
                      name="Minimum"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                
                
                  <div className="col-start-2 row-start-2">
                    <input
                      name="Maximum"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                
                <div className="col-start-3 row-start-2">
                 <Link href={`/product?${params}`}>
                  <button
                    className="text-white bg-blue-500 w-1/2 rounded"
                       >
                    Apply
                  </button>
                  </Link> 
                </div>
                      
      </div>
  );
};

export default FilterbyPriceRange;
