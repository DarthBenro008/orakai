/* eslint-disable */
// @ts-nocheck
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { D1Adapter } from "@auth/d1-adapter"
import { getCloudflareContext } from "@opennextjs/cloudflare";

const authResult = async (): Promise<NextAuthResult> => { 
  return NextAuth({
    providers: [Google],
    adapter: D1Adapter((await getCloudflareContext({async: true})).env.DB),
    session: {
      strategy: "jwt",
    },
  })
}

export const { handlers, signIn, signOut, auth } = await authResult();