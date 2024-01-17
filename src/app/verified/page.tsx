'use client'
import { useUser } from "@clerk/nextjs"
import { compileWelcomeEmail } from "@/components/siteEmails/WelcomeEmail"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Verified (){
    const user = useUser()
    const email = user.user?.primaryEmailAddress?.emailAddress
    const userName = user.user?.firstName ?? ''
    const url = typeof window !== 'undefined' ? `${window.location.origin}/` : '';
  const products = typeof window !== 'undefined' ? `${window.location.origin}/products` : '';
    const emailmessage = compileWelcomeEmail(userName, url, products)
    const router = useRouter()

    const emailData = {
        subject: 'CodeWave Central Welcome!',
        emailTo: email,
        message: emailmessage,
      }
    
    useEffect(()=>{
        fetch("/api/mailcarrier", {
            method: "POST",
            body: JSON.stringify(emailData)
          })
          setTimeout(()=>router.push('/'),2000)    
    })
    
    
      return(
        <div className="flex justify-center items-center h-screen">
            <progress className="progress w-56"></progress>
        </div>
    )
}