
import { ThreeItemGrid } from '@/components/grid/threeItemGrid';
import { Carousel } from '@/components/Carousel';
import { Suspense } from 'react';
import Purchases from '@/components/purchases/Purchases';
export const fetchCache = 'force-no-store';

export default async function Home() {

  return (
    <main className="flex flex-col items-center justify-between">
      <ThreeItemGrid/>
      <Suspense>
        <Carousel/>
      </Suspense>
    </main>
  )
}

