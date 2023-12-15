'use client'

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ChangeEvent, useState, useEffect } from "react"

export default function OrderButtons () {
        const [inputValue, setInputValue] = useState('')
        const searchParams = useSearchParams()
        const { replace } = useRouter()
        const search = searchParams.get('category')

        useEffect(() => {
            setInputValue('');
        }, [search]);
        
        function handleOnClickMinMax() {
            const params = new URLSearchParams(searchParams)
            params.set('ordByPrice', 'min')
            replace(`/product?${params.toString()}`)
            }
        function handleOnClickMaxMin() {
            const params = new URLSearchParams(searchParams)
            params.set('ordByPrice', 'max')
            replace(`/product?${params.toString()}`)
            }   
        
        const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
                const selectedValue = event.target.value;
                setInputValue(selectedValue)
                if (selectedValue === 'lowToHigh') {
                    handleOnClickMinMax();
                } else if (selectedValue === 'highToLow') {
                    handleOnClickMaxMin();
                }
            };
        
            return (
                <div>
                    <select className="text-black text-sm" value={inputValue} onChange={handleSelectChange}>
                        <option value="" disabled>
                        Sort By: </option>
                        <option value="lowToHigh">Price: Low to High</option>
                        <option value="highToLow">Price: High to Low</option>
                    </select>
                </div>
            );
        }


