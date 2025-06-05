import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from "hono/jwt"
import { signupSchema, signinSchema } from '@akash56/common'
import bcrypt from 'bcryptjs'



const userRouter = new Hono<{
    Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
    }
}>();

userRouter.post('/signup', async (c) => {
  // Here you would handle user signup logic
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const validation = signupSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (existingUser) {
      
        return c.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10) // Hash the password before storing it

    if (!hashedPassword) {
      return c.json({ error: 'Failed to hash password' }, { status: 500 })
    }
  
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword, // In a real application, ensure to hash the password
      },
    })
    
    const token = await sign({
      userId: user.id,
      email: user.email,
    }, c.env.JWT_SECRET)

    
    
    
    return c.json({ message: 'User signed up successfully! ', token },{status: 201})
  }
  catch (e) {
    console.error('Error during signup:', e)
    return c.json({ error: 'Failed to sign up user' }, {status: 500})
  }
})

userRouter.post('/signin', async (c) => {
  // Here you would handle user login logic

  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const validation = signinSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ error: 'Invalid input', details: validation.error.errors }, 400)
    }


    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        // In a real application, ensure to hash the password
      },
    })

    if (!user) {
      //c.status(403)
      return c.json({ error: 'User not found' }, 404)
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password) // In a real application, use bcrypt to compare hashed passwords

    if (!isPasswordValid) {
      //c.status(403)
      return c.json({ error: 'Invalid password' }, 403)
    }

    const token = await sign({
      userId: user.id,
      email: user.email,
    }, c.env.JWT_SECRET)
    
    //c.status(200)
    return c.json({ message: 'User signed in successfully!', token })

  } catch (e) {
    console.error('Error during signin:', e)
    return c.json({ error: 'Failed to sign in user' }, 500)
  }
})

export default userRouter;