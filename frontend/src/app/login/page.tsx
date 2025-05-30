"use client";

import { useContext, useState } from "react";

import { authContext } from "../../../providers/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "../../../actions/auth";
import { getUserInfo } from "../../../actions/user";

export default function Login() {
  const { setUser } = useContext(authContext);
  const [ messageErreur, setMessageErreur ] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  
    const formData = new FormData(e.target);
  
    try {
      const response = await signIn(
        formData.get("email") as string,
        formData.get("password") as string
      );
  
      localStorage.setItem("token", response.data.access_token);
  
      const user = await getUserInfo();
      localStorage.setItem("user", JSON.stringify(user.data));
      setUser(user.data);
      router.push("/");
    } catch (error: any) {
      setMessageErreur("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="bg-white p-[30px] rounded-lg shadow-md w-md mx-auto my-auto">
      <div className="w-[400px]">
        <div>
          <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        </div>
        <div>
          {messageErreur && (
            <div className="text-red-600 mb-4">{messageErreur}</div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input id="email" name="email" type="text" className="w-full border p-2 rounded"/>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Mot de passe</label>
              <input id="password" name="password" type="password" className="w-full border p-2 rounded"/>
            </div>
            <div className="space-y-2">
              <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 font-semibold">Connexion</button>
            </div>
          </form>
        </div>
        <div className="mt-4">Pas de compte?{" "}
          <Link className="ml-1 text-blue-500 font-bold" href="/register">Inscrivez-vous !</Link>
        </div>
      </div>
    </div>
  );
}