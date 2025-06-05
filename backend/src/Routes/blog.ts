import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from "hono/jwt"
import bcrypt from 'bcryptjs'
import { blogSchema,updateBlogSchema } from '@akash56/common'

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
    },
    Variables: {
      decodedId: string
    }
}>()

blogRouter.use('/*', async (c, next) => {

    try {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const token = authHeader.split(' ')[1]
    const decoded = await verify(token, c.env.JWT_SECRET)
        if (!decoded) {
        //c.status(401)
      return c.json({ error: 'Unauthorized' }, 401)
        }
        c.set("decodedId", decoded.userId as string)
    await next()
  } catch (e) {
        console.error('Error during JWT authentication:', e)
        //c.status(500)
    return c.json({ error: 'Failed to authenticate user' }, 500)
    }
    
})

blogRouter.post('/', async (c) => {
  // Here you would handle blog creation logic
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
      
      const decodedId = c.get("decodedId") as string

    if (!decodedId) {
      c.status(401)
      return c.json({ error: 'Unauthorized' }, 401)
    }
      
      

    const body = await c.req.json()

    const validation = blogSchema.safeParse(body)

    if (!validation.success) {
      return c.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 })
    }

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: decodedId, // Assuming you have an authorId in the request
      },
    })

    return c.json({ message: 'Blog created successfully!', blog })
  } catch (e) {
    console.error('Error during blog creation:', e)
    //c.status(500)
    return c.json({ error: 'Failed to create blog' }, 500)
  }
 
})

blogRouter.put('/', async (c) => {
    // Here you would handle blog update logic
    try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
        
        const body = await c.req.json()

      const decodedId = c.get("decodedId") as string
      
    const validation = updateBlogSchema.safeParse(body)
    if (!validation.success) {
      return c.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 })
    }
      
    if (!decodedId) {
     // c.status(401)
      return c.json({ error: 'Unauthorized' }, 401)
    }
    if (!body.id || !body.title || !body.content) {
      //c.status(400)
      return c.json({ error: 'Missing required fields' }, 400)
    }
        
    const updatedBlog = await prisma.blog.update({
      where: {
        id: body.id, // Assuming you have an id in the request to identify the blog
      },
      data: {
        title: body.title,
        content: body.content,
        authorId: decodedId, // Assuming you have an authorId in the request
      },
    })
        
        //c.status(200)
    return c.json({ message: 'Blog updated successfully!', blog: updatedBlog })
        //return c.json({ message: 'Blog updated successfully!' })
    } catch (e) {
        console.error('Error during blog update:', e)
       // c.status(500)
    return c.json({ error: 'Failed to update blog' }, 500)
    }
})

blogRouter.get('/', async (c) => {
    // Here you would handle fetching all blogs
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const decodedId = c.get("decodedId") as string

        if (!decodedId) {
            //c.status(401)
            return c.json({ error: 'Unauthorized' }, 401)
        }

        const blogs = await prisma.blog.findMany({
            where: {
                authorId: decodedId, // Fetch all blogs for the authenticated user
            },
        })
        if (!blogs) {
            //c.status(404)
            return c.json({ error: 'Blog not found' }, 404)
        }
        //c.status(200)
        const simplifiedBlogs = blogs.map((blog) => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
        }))
        return c.json({ blogs: simplifiedBlogs })
    } catch (e) {
        console.error('Error during fetching blog:', e)
        //c.status(500)
        return c.json({ error: 'Failed to fetch blog' }, 500)
    }
  //return c.json({ message: 'Fetched all blogs successfully!' })
})

blogRouter.get('/bulk', async (c) => {

    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        console.log('Fetching all blogs...');
        

        const blogs = await prisma.blog.findMany()
        
       const simplifiedBlogs= blogs.map((blog) => {
            return {
                id: blog.id,
                title: blog.title,
            }
        })

        //c.status(200)
        return c.json({ simplifiedBlogs })
    } catch (e) {
        console.error('Error during fetching blog:', e)
        //c.status(500)
        return c.json({ error: 'Failed to fetch blog' }, 500)
    }

})

blogRouter.get('/:id', async (c) => {
    // Here you would handle fetching a single blog by ID
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const blogId = c.req.param('id')
        if (!blogId) {
            //c.status(400)
            return c.json({ error: 'Blog ID is required' }, 400)
        }

        const decodedId = c.get("decodedId") as string
        if (!decodedId) {
            //c.status(401)
            return c.json({ error: 'Unauthorized' }, 401)
        }
        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId,
                // Ensure the blog belongs to the authenticated user
            },
            include: {
                author: { select: { name: true } }, // Include author's name
            }
        })

        if (!blog) {
            //c.status(404)
            return c.json({ error: 'Blog not found' }, 404)
        }

        //c.status(200)

        return c.json({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            author: blog.author.name, // Include author's name
        })

    } catch (e) {
        console.error('Error during fetching blog:', e)
        //c.status(500)
        return c.json({ error: 'Failed to fetch blog' }, 500)
    }
})




export default blogRouter