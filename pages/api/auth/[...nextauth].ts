// // pages/api/auth/[...nextauth].ts
// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';

// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID, // Remplacez par votre client ID Google
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Remplacez par votre secret client Google
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       // Ajoutez des propriétés personnalisées au token si nécessaire
//       session.user.role = token.role; // Exemple si vous voulez ajouter un rôle
//       return session;
//     },
//     async jwt({ token, user }) {
//       // Ajouter des données supplémentaires au token JWT
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     },
//   },
// };

// export default NextAuth(authOptions);
