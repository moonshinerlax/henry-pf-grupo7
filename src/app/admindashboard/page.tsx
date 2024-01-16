/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useSession } from "@clerk/nextjs";
import { checkUserRole } from "@/app/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
 
interface Products{
    id: string;
    model: string;
    category:string;
    price: string;
    image: string;
    disable: boolean;
}
interface Users{
    id: string;
    email: string;
}

export default function admindashboard() {
    const { session } = useSession()
    const userRole = checkUserRole(session)
    const [productList, setProductList] = useState([])
    const [users, setUsers] = useState([])
    const [status, setStatus] = useState(0);

    useEffect(() => {
            const fetchProducts = async () => {
                try {
                  const response = await fetch('/api/form');
                  if (response.ok) {
                    const products = await response.json();
                    setProductList(products.products);
                    setUsers(products.users);
                    console.log(products)
                  } else {
                    console.error('Failed to fetch products:', response.statusText);
                  }
                } catch (error) {
                  console.error('Error fetching products:', error);
                }
              };
        fetchProducts();
       
    }, [status]);

    const toggleCheckbox = (id: string, disable: boolean) => {
        const updateDisableStatus = async () => {
          try {
            let res = await fetch("/api/form", {
              method: "PUT",
              body: JSON.stringify({ id, disable }),
            });
            setStatus(status + 1) 
            return console.log('Product toogle')  
             
          } catch (error) {
            console.log('error', error)
          }       
      }
      updateDisableStatus() 
      
     console.log(disable)
    }
    
    
  return (
    <div>
        {userRole === 'org:admin' ? 
         <div className="flex flex-col flex-wrap content-center">
            <h1 className="mb-4 text-xl">Products</h1>
            
                    <div className="w-4/5 h-80 grid grid-cols-4 gap-5">
                        <div className="overflow-y-scroll h-auto md:col-span-3">
            <table className="min-w-full bg-slate-100 rounded-lg">
              <thead className="border-b text-gray-900">
                <tr>
                  <th className="p-5 text-left">Product</th>
                  <th className="p-5 text-left">Category</th>
                  <th className="p-5 text-right">Price</th>
                  <th className="p-5">Enable / Disable</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((item: Products) => (
                  <tr key={item.id} className="border-b text-gray-900">
                    <td>
                      <Link
                        href={`/product/${item.id}`}
                        className="flex items-center"
                      >
                        <Image
                          src={item.image}
                          alt={item.id}
                          width={50}
                          height={50}
                          className="p-1"
                        ></Image>
                        {item.model}
                      </Link>
                    </td>
                    <td className="p-5 text-right">{item.category}</td>
                    <td className="p-5 text-right">${item.price}</td>
                    <td className="p-5 text-center">
                    <input type="checkbox" className="toggle toggle-error" checked={item.disable} onChange={() => toggleCheckbox(item.id, !item.disable)}/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      

            <h1 className="mb-4 text-xl">Users</h1>
            
                    <div className="w-4/5 h-80 grid md:grid-cols-3 md:gap-5">
                        <div className="overflow-y-scroll h-auto md:col-span-3">
            <table className="min-w-full bg-slate-100 rounded-lg">
              <thead className="border-b text-gray-900">
                <tr>
                  <th className="p-5 text-left">User ID</th>
                  <th className="p-5 text-right">Email</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: Users) => (
                  <tr key={user.id} className="border-b text-gray-900">
                    <td>
                    {user.id}
                    </td>
                    <td className="p-5 text-right">{user.email}</td>
                    <td className="p-5 text-center">
                        Disable / Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div> 
         : 
         <h1>Access Not Granted!</h1>}
      </div> 
  );
}