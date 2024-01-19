import { compileWelcomeEmail } from "../../components/siteEmails/WelcomeEmail"

export default async function sendEMail(userName: string, email: string) {
    const myaccount = typeof window !== 'undefined' ? `${window.location.origin}/` : '';
  const products = typeof window !== 'undefined' ? `${window.location.origin}/products` : '';
    const emailmessage = compileWelcomeEmail(userName, myaccount, products)
    const emailData = {
            subject: `Welcome ${userName} to CodeWave Central Shop!`,
            emailTo: email,
            message: emailmessage,
          }

          fetch("/api/mailcarrier", {
            method: "POST",
            body: JSON.stringify(emailData)
          })  
}