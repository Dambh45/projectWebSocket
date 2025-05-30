"use client";

import { useContext } from "react";
import { authContext } from "../providers/AuthProvider";
import Link from "next/link";


export default function Header() {
  const { user } = useContext(authContext);
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 shadow-md bg-white fixed w-full top-[0px]">
      <div className="flex items-center space-x-4 text-xl text-black font-semibold">
        <Link href="/"  className="px-[20px] flex">Acceuil</Link>
          { user ? (<Link href="/channel" className="px-[20px] flex">Channels</Link>) : (<></>) }
          { user && user.role == "ADMIN" ? (<Link href="/logs" className="px-[20px] flex">Logs</Link>) : (<></>)}
      </div>
      <div className="flex items-center space-x-4 text-xl text-black font-semibold">
        { user ? (<Link href="/profile" className="px-[20px] flex" style={{color: `#${user.color}`}}>{user.firstname + " - " + user.lastname}</Link>) : (<></>)}
        <Link className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex flex-nowrap" href={user ? "/logout" : "/login"}>
          {user ? ("Logout") : ("Login")}
        </Link>
      </div>
    </div>
  );
}