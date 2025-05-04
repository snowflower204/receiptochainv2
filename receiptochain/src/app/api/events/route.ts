// app/api/events/route.ts

import { NextRequest, NextResponse } from 'next/server';

export let events: any[] = []; // Shared mock DB in memory

// GET: Fetch all events
export async function GET(req: NextRequest) {
  return NextResponse.json(events);
}

// POST: Create a new event
export async function POST(req: NextRequest) {
  const body = await req.json();
  const newEvent = {
    id: Date.now(), // Simple unique ID
    ...body,
  };
  events.push(newEvent);
  return NextResponse.json(newEvent, { status: 201 });
}
