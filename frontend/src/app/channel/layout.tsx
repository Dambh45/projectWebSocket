'use client';

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { authContext } from "../../../providers/AuthProvider";
import { Channel, createChannel, getAllChannels } from "../../../actions/channel";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useContext(authContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [channelName, setChannelName] = useState("");

  const fetchChannels = async () => {
    try {
      const res = await getAllChannels();
      setChannels(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchChannels();
  });

  const handleCreateChannel = async () => {
    if (!channelName.trim()) return;

    try {
      await createChannel(channelName);
      setChannelName('');
      setShowModal(false);
      fetchChannels();
    } catch {}
  };

  return (
    <div className="bg-white p-[30px] rounded-lg shadow-md mx-16 pt-0 my-auto">
      <div className="mt-4">
        <div className="pt-3 border-b border-gray-300 overflow-hidden">
          {channels.map((channel) => (
            <Link key={channel.id} className="font-bold p-3 border border-black rounded-lg text-black hover:text-2xl" href={`/channel/${channel.id}`}>
              {channel.name}
            </Link>
          ))}

          {user?.role === "ADMIN" && (
            <button onClick={() => setShowModal(true)} className="ml-3 font-semibold text-xl w-7 h-7 bg-blue-600 text-white border border-blue-600 rounded-full cursor-pointer" title="Ajouter un channel">+</button>
          )}
        </div>
        <div>{children}</div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: "#d3d3d3a1"}}>
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 space-y-4">
            <h2 className="text-lg font-bold">Créer un nouveau channel</h2>
            <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Nom du channel" className="w-full border p-2 rounded"/>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold text-white">Annuler</button>
              <button onClick={handleCreateChannel} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
