'use client'
import { useState } from "react"
import { InputInterface, LoginInterface } from "../lib/definitions";
import FormInput from "@/components/form/FormInput";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<LoginInterface | undefined>();

    const listFormInputs: InputInterface[] = [
        {
            name: 'Email',
            type: 'email',
            autoComplete: 'email',
            value: email,
            handler: (e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
            },
            errors: errors?.email,
        },
        {
            name: 'Password',
            type: 'password',
            autoComplete: 'password',
            value: password,
            handler: (e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
            },
            errors: errors?.password,
        },
    ];

    const handlerSubmit = () => {

    }

    return (
        <div className="w-full h-screen">
            <div className="flex flex-wrap justify-center items-center gap-32 ">
                <picture className=" w-2/5 flex justify-center">
                    <img src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone15pro-digitalmat-gallery-1-202309_GEO_US?wid=364&hei=333&fmt=png-alpha&.v=1693346851451" alt="" />
                </picture>

                <section className="flex flex-col w-2/5 items-start gap-6">

                    <div className="flex-col justify-start items-start gap-6 flex">
                        <div className="CreateAnAccount text-black text-4xl font-medium font-['Inter'] leading-loose tracking-wider">Iniciar</div>

                    </div>
                    <form className="flex-col justify-start items-center gap-5 flex">
                        {listFormInputs.map((input) => (
                            <div key={input.name} className="relative mb-10 w-full justify-self-end">
                                <FormInput
                                    type={input.type}
                                    name={input.name}
                                    value={input.value}
                                    handler={input.handler}
                                    autoComplete={input.autoComplete}
                                    errors={input.errors}
                                />

                            </div>
                        ))
                        }
                        <button onClick={handlerSubmit} className="px-32 py-4 bg-blue-600 rounded justify-center items-center gap-2.5 inline-flex">
                            <p className="text-white bg-transparent text-base font-medium font-['Poppins'] leading-normal">Sign up</p>
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}