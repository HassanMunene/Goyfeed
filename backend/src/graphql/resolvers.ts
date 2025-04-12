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
        getAllUsers: async () => {
            try {
                return await prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true, // optional
                    }
                });
            } catch (error) {
                console.error('Error fetching users:', error);
                throw new Error('Failed to fetch users');
            }
        },
        getSuggestedUsers: async (_: unknown, __: unknown, { userId }: Context) => {
            if (!userId) throw new Error('Not authenticated');

            try {
                // Get random 5 users (excluding current user and already followed)
                const users = await prisma.user.findMany({
                    where: {
                        NOT: {
                            id: userId,
                            followers: {
                                some: {
                                    followerId: userId
                                }
                            }
                        }
                    },
                    take: 5,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                });

                // Check if current user follows each suggested user
                const usersWithFollowStatus = await Promise.all(
                    users.map(async (user) => {
                        const follow = await prisma.follow.findFirst({
                            where: {
                                followerId: userId,
                                followingId: user.id
                            }
                        });
                        return {
                            ...user,
                            isFollowed: !!follow
                        };
                    })
                );

                return usersWithFollowStatus;
            } catch (error) {
                console.error('Error fetching suggested users:', error);
                throw new Error('Failed to fetch suggested users');
            }
        },
        getUser: async (_: unknown, { username }: { username: string }) => {
            if (!username) throw new Error('Username is required');

            console.log('Fetching user with username:', username);

            try {
                const user = await prisma.user.findUnique({
                    where: { username },
                    include: {
                        followers: {
                            include: {
                                follower: {
                                    select: { id: true, username: true, name: true, avatar: true }
                                }
                            }
                        },
                        following: {
                            include: {
                                following: {
                                    select: { id: true, username: true, name: true, avatar: true }
                                }
                            }
                        },
                        posts: {
                            orderBy: { createdAt: 'desc' },
                            include: {
                                likes: true,
                                comments: true
                            }
                        },
                        _count: {
                            select: {
                                followers: true,
                                following: true
                            }
                        }
                    }
                });

                if (!user) throw new Error('User not found');

                return {
                    ...user,
                    followers: user.following.filter(follow => follow.followingId === user.id).map(follow => ({
                        id: follow.followerId,
                    })) || [],

                    // Extract following (users this user follows)
                    following: user.following.filter(follow => follow.followerId === user.id).map(follow => follow.following) || [],

                    // Calculate counts
                    followersCount: user.following.filter(f => f.followingId === user.id).length,
                    followingCount: user.following.filter(f => f.followerId === user.id).length,
                    posts: user.posts.map(post => ({
                        ...post,
                        likesCount: post.likes.length,
                        commentsCount: post.comments.length
                    }))
                };

            } catch (error) {
                console.error('Error fetching user:', error);
                throw new Error('Failed to fetch user');
            }
        },
        getPosts: async (_: unknown, __: unknown, { userId }: Context) => {
            try {
                const posts = await prisma.post.findMany({
                    orderBy: { createdAt: 'desc' },
                    include: {
                        author: {
                            select: { id: true, name: true, username: true }
                        },
                        likes: {
                            select: { userId: true }
                        },
                        _count: {
                            select: { likes: true, comments: true }
                        }
                    }
                });

                return posts.map(post => ({
                    ...post,
                    isLiked: post.likes.some(like => like.userId === userId),
                    likesCount: post._count.likes,
                    commentsCount: post._count.comments
                }));
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw new Error('Failed to fetch posts');
            }
        },
        getPopularPosts: async (_: any, { limit }: { limit: number }, context: Context) => {
            try {
                // Get posts ordered by like count (most popular first)
                const posts = await prisma.post.findMany({
                    take: limit || 5,
                    orderBy: {
                        likes: {
                            _count: 'desc'
                        }
                    },
                    include: {
                        likes: {
                            select: {
                                id: true
                            }
                        },
                        author: true
                    }
                });

                return posts.map(post => ({
                    ...post,
                    createdAt: post.createdAt.toISOString()
                }));

            } catch (error) {
                console.error('Error fetching popular posts:', error);
                throw new Error('Failed to fetch popular posts');
            }
        },
        getPostsByAuthor: async (_: unknown, { id }: { id: string }) => {
            console.log("fetching posts for author id", id);
            return prisma.post.findMany({
                where: { authorId: id },
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
        toggleLike: async (_: unknown, { postId }: LikePostArgs, { userId }: Context) => {
            try {
                // check if user is authrnticated
                if (!userId) throw new Error('Not authenticated');

                // verify that indeed the post exists and fetch the likes and include them in the result.
                const post = await prisma.post.findUnique({
                    where: { id: postId },
                    include: { likes: true }
                });
                if (!post) throw new Error('Post not found');

                // check if the post has been liked by the user
                const existingLike = await prisma.like.findFirst({
                    where: { postId, userId }
                });

                let isLiked: boolean;
                let like: any = null;

                if (existingLike) {
                    // unlike the post
                    await prisma.like.delete({
                        where: { id: existingLike?.id }
                    });
                    isLiked = false;

                } else {
                    like = await prisma.like.create({
                        data: {
                            postId,
                            userId
                        },
                        include: {
                            user: true,
                            post: true
                        }
                    });
                    isLiked = true;
                }
                // 4. Get updated post with likes count
                const updatedPost = await prisma.post.findUnique({
                    where: { id: postId },
                    include: {
                        likes: true,
                        author: true
                    }
                });

                return {
                    success: true,
                    message: isLiked ? 'Post liked successfully' : 'Post unliked successfully',
                    isLiked,
                    like,
                    post: updatedPost
                };
            } catch (error) {
                console.error('Error in toggleLike:', error);
                throw error;
            }
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
        },
        followUser: async (_: unknown, { userId }: { userId: string }, { userId: currentUserId }: Context) => {
            // log data to say received details to follow user
            console.log('Received the user the currently logged in user should follow:', userId);
            // log the name of the user whose userid is userId
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { name: true }
            });
            console.log('User to follow:', user);
            try {
                // 1. Authentication check
                if (!currentUserId) throw new Error('Not authenticated');

                // 2. Explicitly prevent self-following
                if (currentUserId === userId) {
                    throw new Error('Cannot follow yourself');
                }

                // 3. Check if user exists
                const userToFollow = await prisma.user.findUnique({
                    where: { id: userId }
                });
                if (!userToFollow) throw new Error('User not found');

                // 4. Check for existing follow
                const existingFollow = await prisma.follow.findFirst({
                    where: {
                        followerId: currentUserId,
                        followingId: userId
                    }
                });
                if (existingFollow) throw new Error('Already following this user');

                // 5. Create the follow and return the details so we can log and see the result
                const follow = await prisma.follow.create({
                    data: {
                        followerId: currentUserId,
                        followingId: userId
                    },
                    include: {
                        follower: {
                            select: {
                                id: true,
                                name: true,
                                username: true
                            }
                        },
                        following: {
                            select: {
                                id: true,
                                name: true,
                                username: true
                            }
                        }
                    }
                });
                console.log('Follow created:', follow);
                return { success: true };
            } catch (error) {
                console.error('Follow error:', error);
                throw new Error(error instanceof Error ? error.message : 'Failed to follow user');
            }
        },
        unfollowUser: async (_: any, { userId }: { userId: string }, { userId: currentUserId }: Context) => {
            try {
                if (!currentUserId) throw new Error('Not authenticated');

                await prisma.follow.deleteMany({
                    where: {
                        followerId: currentUserId,
                        followingId: userId
                    }
                });

                return { success: true, message: 'Unfollowed successfully' };
            } catch (error) {
                console.error('Error unfollowing user:', error);
                throw new Error('Failed to unfollow user');
            }
        }
    }
};