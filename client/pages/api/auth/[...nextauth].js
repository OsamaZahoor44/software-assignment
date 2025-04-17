import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configure NextAuth.js
export default NextAuth({
  providers: [
    // Credentials provider for username and password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your own login logic, such as querying your database
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          // You should return an object here with user info if login is successful
          return { id: 1, name: 'Admin' };
        }
        // Return null if authentication fails
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Using JWT for session management
  },
});
