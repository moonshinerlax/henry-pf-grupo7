'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import sendEMail from "@/components/siteEmails/sendWelcomeEmail"


export default function Verified (){  
    
    const user = useUser()
    const email = user.user?.primaryEmailAddress?.emailAddress
    const id = user.user?.id
    const userName = user.user?.firstName ?? ''
    const router = useRouter()

   
    
      

      useEffect(() => {
        const reg = async () => {
          try {
            let res = await fetch("/api/signup", {
              method: "POST",
              body: JSON.stringify({id, email}),
            });
            console.log("success")
          } catch (error) {
            console.log('Error adding user:', error);
          }
        };
        if (id && email) {
          reg();
          sendEMail(userName, String(email))
        }
        setTimeout(()=>{router.push('/')}, 2000)
      }, [id, email]);

      
    
      return(
        <div className="flex flex-col justify-center items-center h-screen">
            <div><h1>verifying user...</h1></div>
            <div>
            <progress className="progress w-56"></progress>
            </div>
        </div>
    )
}