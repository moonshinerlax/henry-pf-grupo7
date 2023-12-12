import Filtered from "./components/Filtered"
import Order from "./components/Order"

export default function RootLayout({children} : {children: React.ReactNode}) {
    return (
        <div className="flex justify-between w-full bg-slate-50">
            <Filtered></Filtered>
            {children}
            <Order></Order>
        </div>
    )
}