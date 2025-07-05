import React from 'react'

export default function Footer() {
   return (
       <footer className="border-t py-4 md:py-4 fixed bottom-0 w-full bg-background">
           <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
               <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                   &copy; {new Date().getFullYear()} Buckr. All rights reserved.
               </p>
           </div>
       </footer>
   )
}
