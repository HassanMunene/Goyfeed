import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

// This is now the heart of our GraphQl server logic.
// this functions tells us how to fetch and modify data when a query or
// a mutation is called.

const prisma = new PrismaClient();

interface Context {
    userId: string;
}

interface SignupArgs {
    username: string;
    email: string;
    password: string;
    name: string;
}

interface LoginArgs {
    email: string;
    password: string;
}

interface CreatePostArgs {
    content: string;
    image?: string;
}

interface CreateCommentArgs {
    postId: string;
    content: string;
}

interface LikePostArgs {
    postId: string;
}

interface FollowArgs {
    userId: string;
}

export const resolvers = {
    Query: {
        me: async (_: unknown, __: unknown, { userId }: Context) => {
            if (!userId) throw new Error('Not authenticated');
            return prisma.user.findUnique({ where: { id: userId } });
        },
        getUser: async (_: unknown, { username }: { username: string }) => {
            return prisma.user.findUnique({ where: { username } });
        },
        getPosts: async () => {
            return prisma.post.findMany({
                orderBy: { createdAt: 'desc' },
                include: { author: true }
            });
        },
        getPost: async (_: unknown, { id }: { id: string }) => {
            return prisma.post.findUnique({
                where: { id },
                include: { author: true }
            });
        },
        getFeed: async (_: unknown, __: unknown, { userId }: Context) => {
            if (!userId) throw new Error('Not authenticated');
            return prisma.post.findMany({
                where: {
                    author: {
                        followers: { some: { followerId: userId } }
                    }
                },
                orderBy: { createdAt: 'desc' },
                include: { author: true }
            });
        }
    },
    Mutation: {
        signup: async (_: unknown, { username, email, password, name }: SignupArgs) => {
            const hashedPassword = await hash(password, 10);
            const user = await prisma.user.create({
                data: { username, email, password: hashedPassword, name }
            });
            //token is generated to identify user in future requests
            //this jwt contains userId encoded and signed by our secret key
            const token = sign({ userId: user.id }, process.env.APP_SECRET!);
            return { token, user };
        },
        login: async (_: unknown, { email, password }: LoginArgs) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) throw new Error('User not found');

            const valid = await compare(password, user.password);
            if (!valid) throw new Error('Invalid password');

            const token = sign({ userId: user.id }, process.env.APP_SECRET!);
            return { token, user };
        },
        createPost: async (_: unknown, { content, image }: CreatePostArgs, { userId }: Context) => {
            if (!userId) {
                throw new Error('Not authenticated');
            }
            
            try {
                const newPost = await prisma.post.create({
                    data: {
                        content,
                        image: image || null, // Explicitly handle null case
                        authorId: userId,
                    },
                    select: {  // Explicitly select fields to return
                        id: true,
                        content: true,
                        image: true,
                        createdAt: true,
                        author: {  // Include author info if needed
                            select: {
                                id: true,
                                name: true,
                                username: true
                            }
                        }
                    }
                });
        
                return {
                    ...newPost,
                    message: 'Post created successfully!'
                };
            } catch (error) {
                console.error('Error creating post:', error);
                throw new Error('Failed to create post');
            }
        },
        createComment: async (_: unknown, { postId, content }: CreateCommentArgs, { userId }: Context) => {
            if (!userId) throw new Error('Not authenticated');
            return prisma.comment.create({
                data: { content, postId, authorId: userId }
            });
        },
        likePost: async (_: unknown, { postId }: LikePostArgs, { userId }: Context) => {
            if (!userId) throw new Error('Not authenticated');
            return prisma.like.create({
                data: { postId, userId }
            });
        },
        unlikePost: async (_: unknown, { postId }: LikePostArgs, { userId }: Context) => {
            if (!userId) throw new Error('Not authenticated');
            await prisma.like.deleteMany({
                where: { postId, userId }
            });
            return true;
        },
        follow: async (_: unknown, { userId: followingId }: FollowArgs, { userId: followerId }: Context) => {
            if (!followerId) throw new Error('Not authenticated');
            return prisma.follow.create({
                data: { followerId, followingId }
            });
        },
        unfollow: async (_: unknown, { userId: followingId }: FollowArgs, { userId: followerId }: Context) => {
            if (!followerId) throw new Error('Not authenticated');
            await prisma.follow.deleteMany({
                where: { followerId, followingId }
            });
            return true;
        }
    }
};