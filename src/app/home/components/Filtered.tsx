import Link from "next/link"

export default function Filtered () {
    return (
        <div className="m-4 my-9 hover:cursor-pointer leading-7">
            <h1 className="text-gray-500 text-xs font-bold">Collections</h1>
            <div className="text-base font-medium">
            <Link className="hover:underline" href='/home'><h1>All</h1></Link>
            <Link className="hover:underline" href='/home/mac'><h1>Mac</h1></Link>
            <Link className="hover:underline" href='/home/imac'><h1>iMac</h1></Link>
            <Link className="hover:underline" href='/home/iphone'><h1>iPhone</h1></Link>
            <Link className="hover:underline" href='/home/ipad'><h1>iPad</h1></Link>
            </div>
            
        </div>
    )
}