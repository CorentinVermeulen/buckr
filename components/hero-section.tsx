import { Button } from "@/components/ui/button";
import {ExternalLink, Github, LineSquiggle} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
   return (
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
         <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
             <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl inline-flex items-center gap-2">
                 <LineSquiggle className="size-[1em]"/><span className="text-primary">Buckr</span>
             </h1>
         </div>
      </section>
   )
}
