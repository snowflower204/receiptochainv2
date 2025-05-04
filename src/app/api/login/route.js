import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Test Commit

const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database_name',
};

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

    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id, email, password FROM user WHERE email = ?',
      [email]
    );

    await connection.end();

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
    return new Response(JSON.stringify({ message: 'Internal server error' + error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
