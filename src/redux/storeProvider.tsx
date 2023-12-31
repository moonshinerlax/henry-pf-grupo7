'use client'
import React, { ReactNode } from "react";
import { store } from "./store";
import { Provider } from "react-redux";

interface StoreProviderProps {
    children: ReactNode;
  }
  
  export function StoreProvider({ children }: StoreProviderProps) {
    return (<Provider store={store}>{children}</Provider>)
  }