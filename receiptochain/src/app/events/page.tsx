'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/sidebar';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

export default function EventPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Partial<Event>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/events/${form.id}` : '/api/events';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({});
      setIsEditing(false);
      fetchEvents();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchEvents();
  };

  const handleEdit = (event: Event) => {
    setForm(event);
    setIsEditing(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
     
     {/*Main content*/}
    
      <div className="flex-1 ml-0 md:ml-64 p-8 space-y-8 transition-all duration-300flex-1 p-8">
        <h1 className="text-4xl font-bold text-black mb-6">Manage Events</h1>

        <div className="flex flex-row justify-end gap-8">
          {/* Left box - Calendar + Event List */}
          <div className="w-1/2 bg-white/80 backdrop-blur-md shadow-md rounded-lg p-6 border border-gray-200">
            <div className="mb-6">
              {/* Responsive Calendar Placeholder */}
              <div className="w-full bg-green-100 text-green-800 p-4 rounded-md text-center font-semibold">
                📅 Calendar Placeholder - Today is {new Date().toDateString()}
              </div>
            </div>

            <ul className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="border p-4 rounded-lg shadow-sm bg-yellow-50"
                >
                  <h2 className="font-bold text-xl">{event.title}</h2>
                  <p className="text-sm text-gray-700">{event.date}</p>
                  <p className="mb-2">{event.description}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-green-700 hover:underline font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right box - Event Form */}
          <div className="w-1/2 bg-white/90 backdrop-blur-md shadow-lg rounded-lg p-6 border border-gray-300">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Event Title"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <input
                type="date"
                value={form.date || ''}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <textarea
                placeholder="Event Description"
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-md font-semibold hover:bg-yellow-500 transition duration-300"
              >
                {isEditing ? 'Update Event' : 'Add Event'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
