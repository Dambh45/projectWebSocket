'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLogs, Log } from "../../../actions/log";

export default function LogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<Log[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getLogs();
        setLogs(res.data);
        setLoading(false);
      } catch {
        router.push("/");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-[30px] rounded-lg shadow-md w-3xl mx-auto my-auto">
      {!loading ? (
        <div>
          <h1 className="text-2xl font-bold mb-6">Historique des connexions</h1>
          <div className="space-y-4 overflow-scroll h-160">
            {logs.length === 0 ? (
              <p>Aucun log pour le moment.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="bg-white p-4 shadow rounded flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <strong style={{color: `#${log.user.color}`}}>{log.user.firstname} {log.user.lastname}</strong> — {log.event}
                  </div>
                  <div className="text-gray-500 text-sm mt-2 sm:mt-0">
                    {new Date(log.eventDate).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (<></>)}
    </div>
  );
}
