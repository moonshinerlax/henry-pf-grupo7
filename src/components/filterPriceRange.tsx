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
     <>      
     <h3 className="bg-transparent justify-end text-center rounded-md border-gray-400 border text-sm text-gray-400 " onClick={() => setRangePriceClicked(!rangePriceClicked)}>Range Price
       {rangePriceClicked && (
        
          <ul  onClick={(e) => e.stopPropagation()}>
            <li>
              <a href="/product"> All </a>
            </li>
            <li>
              <div className="" >
                <div className="">
                  <div className="">
                    <input
                      name="Minimum"
                      placeholder="Mínimo"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="">
                  <div className="">
                    <input
                      name="Maximum"
                      placeholder="Máximo"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
                <div className="">
                 <Link href={`/product?${params}`}>
                  <button
                    className="text-white bg-blue-500 px-4 py-2 rounded"
                       >
                    Apply
                  </button>
                  </Link> 
                </div>
              </div>
            </li>
          </ul>
   
 
        )}
      </h3>
    </>
  );
};

export default FilterbyPriceRange;
