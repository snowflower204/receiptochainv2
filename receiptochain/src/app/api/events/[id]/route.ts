import { NextRequest, NextResponse } from 'next/server';
import { events } from '../route';

export async function GET(req: NextRequest) {
  const idParam = req.url.split('/').pop();
  const id = Number(idParam);

  const event = events.find((e) => e.id === id);
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest) {
  const idParam = req.url.split('/').pop();
  const id = Number(idParam);
  const body = await req.json();

  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  events[index] = { ...events[index], ...body };
  return NextResponse.json(events[index]);
}

export async function DELETE(req: NextRequest) {
  const idParam = req.url.split('/').pop();
  const id = Number(idParam);

  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  events.splice(index, 1);
  return NextResponse.json({ message: 'Event deleted' });
}
