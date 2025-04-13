/* eslint-disable */
// @ts-nocheck
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { D1Adapter } from "@auth/d1-adapter"
import { getCloudflareContext } from "@opennextjs/cloudflare";


const providers = [GitHub, Google]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")

const authResult = async (): Promise<NextAuthResult> => {
  return NextAuth({
    basePath: "/api/auth",
    providers,
    adapter: D1Adapter((await getCloudflareContext({ async: true })).env.DB),
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async session({ session, token }) {
        session.user.id = token.sub
        return session
      },
    },
  })
}

export const { handlers, signIn, signOut, auth } = await authResult();