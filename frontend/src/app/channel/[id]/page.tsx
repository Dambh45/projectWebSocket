'use client';

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import { getAllUsers, User } from "../../../../actions/user";
import { changeChannelUserAccess, Channel, deleteChannel, getChannel } from "../../../../actions/channel";
import { getAllMessagesFromChannel, Message } from "../../../../actions/message";

export default function ChannelPage() {
  const { id: channelId } = useParams();
  const [channel, setChannel] = useState<Channel>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  const userId = user?.id;

  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chan = await getChannel(channelId ? channelId.toString() : '');
        setChannel(chan.data);
        const res = await getAllMessagesFromChannel(channelId ? channelId.toString() : '');
        setMessages(res.data);        
      } catch {
        setChannel(undefined);
        router.push("/");
      }
    };

    fetchMessages();
  }, [channelId]);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      query: {
        userId,
        channelId,
      },
    });

    socketRef.current = socket;

    socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [channelId, userId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (socketRef.current && newMessage.trim() !== "") {
      socketRef.current.emit("sendMessage", {
        content: newMessage,
        userId,
        channelId: Number(channelId),
      });
      setNewMessage('');
    }
  };

  const openUserAccessModal = async () => {
    try {
      const res = await getAllUsers();
      setAllUsers(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Erreur chargement utilisateurs", err);
    }
  };

  const toggleUserAccess = async (targetUserId: number) => {
    try {
      await changeChannelUserAccess(channelId ? channelId.toString() : '', targetUserId.toString());
      const updated = await getChannel(channelId ? channelId.toString() : '');
      setChannel(updated.data);
    } catch {}
  };

  const isUserAuthorized = (userIdToCheck: number) => {
    return channel?.usersAuthaurized?.some((u) => u.id === userIdToCheck);
  };

  return channel ? (
    <div className="mx-auto py-8 px-4 w-full">
      <h1 className="text-2xl font-bold mb-6">{channel.name}</h1>

      {user?.role === "ADMIN" && (
        <button onClick={openUserAccessModal} className="mb-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 cursor-pointer font-semibold">
          Modifier accès utilisateur
        </button>
      )}

      {user?.role === "ADMIN" && (
        <button onClick={async () => {
            const confirmed = confirm("Êtes-vous sûr de vouloir supprimer ce channel ?");
            if (!confirmed) return;
            try {
              await deleteChannel(channelId ? channelId.toString() : '');
              router.push("/channel");
            } catch {}
          }} className="mb-4 ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer font-semibold">
          Supprimer le channel
        </button>
      )}

      <div className="border rounded-lg p-4 h-[400px] overflow-y-auto space-y-3 bg-gray-50 w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-white p-2 rounded-md px-4 shadow text-sm w-fit ${user.firstname == msg.user.firstname ? "ml-auto" : "mr-auto"}`}>
            <div style={{ color: `#${msg.user.color}` }}>
              <strong>{msg.user.firstname} {msg.user.lastname}</strong>
            </div>
            <div>{msg.content}</div>
            <div className="text-gray-400 text-xs">{new Date(msg.SentDate).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-4 flex space-x-2 w-full">
        <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-grow border p-2 rounded" placeholder="Écrire un message..."/>
        <button type="submit" className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 font-semibold">Envoyer</button>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backgroundColor: "#d3d3d3a1"}}>
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Gérer les accès utilisateurs</h2>
            <div className="max-h-64 overflow-y-auto space-y-2 overflow-scroll h-96">
              {allUsers.map((u) => (
                <label key={u.id} className="flex items-center justify-between border-b py-1">
                  <span>{u.firstname} {u.lastname}</span>
                  <input type="checkbox" checked={isUserAuthorized(u.id)} onChange={() => toggleUserAccess(u.id)} className="form-checkbox h-4 w-4 text-blue-600"/>
                </label>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button onClick={() => setShowModal(false)} className="text-sm text-gray-700 hover:underline font-semibold">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : <div></div>;
}
