'use client'
import { RedirectToSignIn, SignOutButton, SignedOut, useUser} from "@clerk/nextjs"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Banned () {

    const id = useUser().user?.id
    const pathnames = usePathname();
    const router = useRouter()

    const checkUserStatus = (user: any) => {
      if (!user.disable) {
        router.push('/');
      }
    };

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          if (!id) {
            return; 
          }
          const response = await fetch(`/api/signup?id=${id}`);
          if (response.ok) {
            const user = await response.json();
            checkUserStatus(user.users[0]);
          } else {
            throw new Error("Failed to fetch cart data");
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };
      fetchUserData()
    }, [id]);


    
    return(
        <div className="flex flex-col flex-no-wrap items-center justify-center content-center h-screen">
            <h1>{`You've been banned :(`}</h1>
            <h1>{`Please `} <a className="text-red-700 font-bold"> <SignOutButton/></a></h1>
        </div>
    )
}