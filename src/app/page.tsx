import Image from 'next/image'
import { fetchProduct } from './lib/data'
import { ThreeItemGrid } from '@/components/grid/threeItemGrid';
import { Carousel } from '@/components/Carousel';
import { Suspense } from 'react';
export const fetchCache = 'force-no-store';

export default async function Home() {
  const products = await fetchProduct()
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ThreeItemGrid/>
      <Suspense>
        <Carousel/>
      </Suspense>
    </main>
  )
}
