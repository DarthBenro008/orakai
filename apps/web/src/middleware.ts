export { auth as middleware } from "@/auth"

export const config = {
    matcher: ["/dashboard/:path*", "/queries/:path*", "/my-queries/:path*"]
} 