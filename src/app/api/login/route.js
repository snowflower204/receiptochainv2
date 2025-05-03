import db from '../../lib/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input
    try {
      loginSchema.parse(body);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid email or password format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email, password } = body;

    const [rows, fields] = await db.query(
      'SELECT id, email, password FROM user WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { password: hashedPassword, ...userWithoutPassword } = user;

    return new Response(
      JSON.stringify({ message: 'Login successful', user: userWithoutPassword }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Login Error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
