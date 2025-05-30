'use client';

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authContext } from "../../../providers/AuthProvider";

const LogoutPage = () => {
  const {setUser} = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(undefined);
    router.push("/login");
  }, [router]);

  return <p>Déconnexion en cours...</p>;
};

export default LogoutPage;
