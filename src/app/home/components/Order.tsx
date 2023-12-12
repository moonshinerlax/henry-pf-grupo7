export default function Order () {
    return (
        <div className="m-4 my-9 hover:cursor-pointer leading-7">
            <h1 className="text-gray-500 text-xs font-bold">Sort By</h1>
            <div className="text-sm font-medium">
             <h1 className="hover:underline">Price: Low to high</h1>
             <h1 className="hover:underline">Price: High to low </h1>
            </div>
        </div>
    )
}