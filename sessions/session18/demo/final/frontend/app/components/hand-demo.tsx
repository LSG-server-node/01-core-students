'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

type RaisedHand = {
  userId: string;
  name: string;
  raised: boolean;
  updatedAt: string;
};

const SOCKET_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? 'http://127.0.0.1:4000';

const updateHands = (currentHands: RaisedHand[], updatedHand: RaisedHand) => {
  const nextHands = currentHands.filter(
    (hand) => hand.userId !== updatedHand.userId
  );

  if (updatedHand.raised) {
    nextHands.unshift(updatedHand);
  }

  return nextHands;
};

export function HandDemo() {
  const socketRef = useRef<Socket | null>(null);
  const [userId, setUserId] = useState('student-01');
  const [name, setName] = useState('Oriol');
  const [hands, setHands] = useState<RaisedHand[]>([]);
  const [status, setStatus] = useState('connecting');
  const [error, setError] = useState('');

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
      setError('');
    });

    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('connect_error', () => {
      setStatus('error');
      setError('No s ha pogut connectar');
    });
    socket.on('hand.snapshot', (payload: RaisedHand[]) => setHands(payload));
    socket.on('hand.updated', (payload: RaisedHand) => {
      setHands((currentHands) => updateHands(currentHands, payload));
    });
    socket.on('error', (payload: { message: string }) => {
      setError(payload.message);
    });

    return () => socket.disconnect();
  }, []);

  const raiseHand = () => {
    if (!socketRef.current?.connected) {
      setError('Socket.IO no connectat');
      return;
    }

    socketRef.current.emit('hand.raise', { userId, name });
  };

  const lowerHand = () => {
    if (!socketRef.current?.connected) {
      setError('Socket.IO no connectat');
      return;
    }

    socketRef.current.emit('hand.lower', { userId });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    raiseHand();
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Raise hand</h1>
        <p className="mt-1 text-sm text-slate-700">Status: {status}</p>

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-600"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="User id"
          />
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-600"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
          />
          <div className="flex gap-2">
            <button
              className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
              type="submit"
            >
              Raise
            </button>
            <button
              className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-900"
              type="button"
              onClick={lowerHand}
            >
              Lower
            </button>
          </div>
        </form>

        {error ? (
          <p className="mt-3 text-sm text-rose-600">{error}</p>
        ) : null}

        <ul className="mt-6 space-y-2">
          {hands.map((hand) => (
            <li
              key={hand.userId}
              className="rounded border border-slate-200 px-3 py-2"
            >
              <p className="font-medium">{hand.name}</p>
              <p className="text-sm text-slate-700">{hand.userId}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
