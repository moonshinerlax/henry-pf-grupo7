"use client";
import { InputInterface } from "@/app/lib/definitions";
import React, { useEffect } from "react";

export default function FormInput({
    type,
    name,
    handler,
    value = "",
    autoComplete,
    errors,
}: InputInterface): React.ReactNode {

    useEffect(() => {
    }, [value, errors]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handler(event);
    };
    return (
        <div className="relative mb-10 w-full justify-self-center">
            <input
                type={type}
                id={name}
                className={`relative w-full px-4 py-2 border-2 rounded pt-2 top-6 text-black
        `}
                value={value}
                onChange={handleInputChange}
                autoComplete={autoComplete}
                required
                name={name}
            />
            <label
                htmlFor={name}
                className={`absolute transition-all duration-200 ease-in-out ${value
                    ? "top-1 left-5 text-xs text-black"
                    : "top-[44px] left-7 -translate-y-1/2 text-gray-400"
                    } `}
            >
                {name}
            </label>
            {errors && <p className="absolute text-red-500 top-16">{errors}</p>}
        </div>
    );
}
