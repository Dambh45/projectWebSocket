'use client';

import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { authContext } from '../../../providers/AuthProvider';
import { updateUserInfo, User } from '../../../actions/user';

const ColorPicker = dynamic(() => import('../../../components/ColorPickr'), {
  ssr: false,
});

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<User>();
  const {user, setUser} = useContext(authContext);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUserProfile(user);
      setLoading(false);
    } else {
      router.push("/login");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setUserProfile((prev) => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const returnUser = await updateUserInfo(userProfile);
      setUser(returnUser.data);
      localStorage.setItem("user", JSON.stringify(returnUser.data));
    } catch {}
  };

  if (loading) return <></>;
 
  return (
    <div className="bg-white p-[30px] rounded-lg shadow-md w-md mx-auto my-auto">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Prénom</label>
          <input name="firstname" value={userProfile.firstname} onChange={handleChange} className="w-full border p-2 rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input name="lastname" value={userProfile.lastname} onChange={handleChange} className="w-full border p-2 rounded"/>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" value={userProfile.email} onChange={handleChange} className="w-full border p-2 rounded" type="email"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Couleur</label>
          <ColorPicker defaultColor={userProfile.color} onChange={handleColorChange}/>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 font-semibold">Enregistrer</button>
      </form>
    </div>
  );
}
