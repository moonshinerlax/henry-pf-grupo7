/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { useSession } from "@clerk/nextjs";
import { checkUserRole } from "@/app/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

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
    disable: boolean;
}

export default function admindashboard() {
    const { session } = useSession()
    const userRole = checkUserRole(session)
    const [productList, setProductList] = useState([])
    const [users, setUsers] = useState([])
    const [status, setStatus] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
            const fetchProducts = async () => {
                try {
                  const response = await fetch('/api/form');
                  if (response.ok) {
                    const products = await response.json();
                    setProductList(products.products);
                    setUsers(products.users);
                    console.log(products)
                    setLoading(true)
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
    }
    
    const toggleCheckboxUser = (id: string, disable: boolean) => {
      const updateDisableStatus = async () => {
        try {
          let res = await fetch("/api/signup", {
            method: "PUT",
            body: JSON.stringify({ id, disable }),
          });
          setStatus(status + 1) 
          return console.log('User toogle')  
           
        } catch (error) {
          console.log('error', error)
        }       
    }
    updateDisableStatus()
  }
useEffect(() => {
  Aos.init({ duration: 1000 });
})
  

  return (
    !loading ? <h1 data-aos="fade-out">Loading...</h1> : 
  <div>
        {userRole === 'org:admin' ? 
         <div className=" md:flex md:flex-row w-full place-content-evenly">

        <div data-aos="fade-up"  data-aos-duration="1000" className="rounded-lg h-auto md:h-28 md:mt-64 bg-slate-100 bg-opacity-70 shadow-[0_0px_10px_5px_rgba(100,100,100,.8)] m-1 px-2">
          <Link href={'/form'}>
          <button className="bg-blue-500 mx-24 my-10 rounded-full p-4 self-center md:m-7 hover:bg-blue-800 ">
            Add New Product
          </button>
          </Link>
        </div>


          <div  data-aos="fade-up"  className=" rounded-3xl shadow-[0_0px_10px_5px_rgba(100,100,100,.5)] m-1">
          <div className="min-w-full h-screen grid grid-cols-3 gap-5">
          <div className="ovewrflow-y-scroll overflow-x-hidden  text-xs w-96 h-auto mr-1 md:col-span-3 md:w-auto">
            <table className="min-w-full bg-slate-100 bg-opacity-80 rounded-lg">
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
                    <td className="p-5 text-left">{item.category}</td>
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
        </div>
                
           <div  data-aos="fade-up"  className="rounded-lg shadow-[0_0px_10px_5px_rgba(100,100,100,.5)] m-1"> 
                             <div className="min-w-full h-screen grid md:grid-cols-3 md:gap-5">
                    <div className="ovewrflow-y-scroll overflow-x-hidden h-full mr-1 md:col-span-3 w-96 md:w-auto">
            <table className=" h-full bg-slate-100 bg-opacity-80 rounded-lg">
              <thead className="border-b text-gray-900 text-8px w-96">
                <tr>
                  <th className="p-1 text-xs text-right">Email</th>
                  <th className="p-1">Enable / Disable</th>
                  <th className="p-1 text-6px text-left">User ID</th>
                  
                </tr>
              </thead>
              <tbody>
                {users.map((user: Users) => (
                  <tr key={user.id} className="border-b text-gray-900 text-xs">
                   
                    <td className="p-1 text-left">{user.email}</td>
                    <td className="p-1 text-center">
                    <input type="checkbox" className="toggle toggle-error" checked={user.disable} onChange={() => toggleCheckboxUser(user.id, !user.disable)}/>
                    </td>
                    <td>
                    {user.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div> 
        </div> 
         : 
         <h1>Access Not Granted!</h1>}
      </div>);
}