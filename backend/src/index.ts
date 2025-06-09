import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from "hono/jwt"
import bcrypt from 'bcryptjs'
import userRouter from './Routes/user'
import blogRouter from './Routes/blog'
import { cors } from 'hono/cors'


const app = new Hono<{
	Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
	}
}>();

app.use('*', cors({
  origin: 'http://localhost:5173', // Or your frontend domain like "http://localhost:5173"
  allowHeaders: ['Authorization', 'Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app