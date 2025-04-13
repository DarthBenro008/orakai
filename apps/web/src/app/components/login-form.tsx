import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { signIn, providerMap } from "@/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        Login with your Google or Github account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {Object.values(providerMap).map((provider) => (
                            <form
                                key={provider.id}
                                action={async () => {
                                    "use server"
                                    try {
                                        await signIn(provider.id, {
                                            redirectTo: "/dashboard",
                                        })
                                    } catch (error) {
                                        console.log(error)
                                        // Signin can fail for a number of reasons, such as the user
                                        // not existing, or the user not having the correct role.
                                        // In some cases, you may want to redirect to a custom error
                                        if (error instanceof AuthError) {
                                            return redirect(`/?error=${error.type}`)
                                        }

                                        // Otherwise if a redirects happens Next.js can handle it
                                        // so you can just re-thrown the error and let Next.js handle it.
                                        // Docs:
                                        // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                                        throw error
                                    }
                                }}
                            >
                                <Button variant="outline" className="w-full" type="submit">
                                    {provider.id === "github" ? <SiGithub className="mr-2 h-4 w-4" /> : <SiGoogle className="mr-2 h-4 w-4" />}
                                    <span>Sign in with {provider.name}</span>
                                </Button>
                            </form>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
