import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { UserProvider } from "@/context/UserContext"
import ProfileHandler from "@/components/profile-handler";
import Logo from "@/components/logo";


export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode
}) {
   const session = await auth.api.getSession({
      headers: await headers()
   })

   if (!session) {
      return redirect("/sign-in")
   }

   const user = session?.user;
   return (
         <UserProvider user={user}>
            <div className="flex min-h-screen w-full">
               <div className="w-full flex flex-1 flex-col">
                  <div className="flex items-center justify-between h-16 px-3 sm:px-6 border-b bg-background">
                     <Logo />
                     <ProfileHandler user={user}/>
                  </div>
                  <main className="flex-1 p-3 sm:p-6">{children}</main>
               </div>
            </div>
         </UserProvider>
   )
}
