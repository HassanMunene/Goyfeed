import { gql } from "apollo-server-express";

// This is a contract between the backend and frontend, it describes the structure of the data
// what queries and mutations are available and relationship between the types.
// defines the shape of our data
// the queries are the read operations. 
// me: Returns the currently authenticated user

// getUser: Fetches a user by username

// getPosts: Returns all posts (maybe ordered by date)

// getPost: Fetches a specific post by ID

// getFeed: Usually posts from people the user follows

// Mutations are write operations
export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        name: String
        avatar: String
        bio: String
        posts: [Post!]!
        followers: [Follow!]!
        following: [Follow!]!
        createdAt: String!
        updatedAt: String!
    }
    
    type Post {
        id: ID!
        content: String!
        image: String
        author: User!
        likes: [Like!]!
        comments: [Comment!]!
        createdAt: String!
        updatedAt: String!
    }
    
    type Comment {
        id: ID!
        content: String!
        post: Post!
        author: User!
        createdAt: String!
    }
    
    type Like {
        id: ID!
        post: Post!
        user: User!
        createdAt: String!
    }
    
    type Follow {
        id: ID!
        follower: User!
        following: User!
        createdAt: String!
    }
    
    type AuthPayload {
        token: String!
        user: User!
    }
    
    type Query {
        me: User
        getAllUsers: [User!]!
        getUser(username: String!): User
        getPosts: [Post!]!
        getPostsByAuthor(id: String!): [Post!]!
        getFeed: [Post!]!
    }
    
    type Mutation {
        signup(username: String!, email: String!, password: String!, name: String): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createPost(content: String!, image: String): Post!
        createComment(postId: ID!, content: String!): Comment!
        likePost(postId: ID!): Like!
        unlikePost(postId: ID!): Boolean!
        follow(userId: ID!): Follow!
        unfollow(userId: ID!): Boolean!
    }
`;

