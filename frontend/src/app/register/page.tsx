"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../../../actions/auth";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstname: z.string().min(1, "Le prénom est requis"),
  lastname: z.string().min(1, "Le nom est requis"),
});

export default function Register() {
  const router = useRouter();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await register(values);
    router.push("/login");
  }

  return (
    <div className="bg-white p-[30px] rounded-lg shadow-md w-md mx-auto my-auto">
      <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-bold mb-6">Inscription</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input type="text" {...registerField("firstname")} className="w-full border rounded px-3 py-2 mt-1"/>
            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input type="text" {...registerField("lastname")} className="w-full border rounded px-3 py-2 mt-1"/>
            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" {...registerField("email")} className="w-full border rounded px-3 py-2 mt-1"/>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input type="password" {...registerField("password")} className="w-full border rounded px-3 py-2 mt-1"/>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 font-semibold">{isSubmitting ? "Inscription..." : "S'inscrire"}</button>
        </form>

        <div className="text-center">
          Déjà un compte ?
          <Link className="ml-1 text-blue-500 font-bold" href="/login">Connectez-vous !</Link>
        </div>
      </div>
    </div>
  );
}
