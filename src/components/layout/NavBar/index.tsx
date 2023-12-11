'use client'

import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import CreateProduct from "@/components/form/createProduct";
export default function Navbar() {
    const menu = ["All", "Phones", "Tablets", "laptops", "Desktops", "Softwares"]

    return (
      <nav className="relative flex items-center justify-between p-4 lg:px-6">
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <Image src="\img\codewave-central-high-resolution-logo-transparent.svg" alt="codewave logo" 
            width={300}
            height={300}
            className="h-16 w-60" />
            </Link>
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/home/category/${item}`}
                      className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <SearchBar/>
          </div>
          <div  className="hidden justify-center md:flex md:w-1/3"> 
          <CreateProduct/>
          </div>
          {/* <div className="flex justify-end md:w-1/3">
            <Suspense fallback={<OpenCart />}>
              <Cart />
            </Suspense>
          </div> */}
        </div>
      </nav>
    );
  }
  