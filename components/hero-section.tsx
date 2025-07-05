import {LineSquiggle} from "lucide-react";

export default function HeroSection() {
    return (
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-8 text-center">
                <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl inline-flex items-center gap-2">
                    <LineSquiggle className="size-[1em]"/><span className="text-primary">Buckr</span>
                </h1>
                <p className="text-xl text-muted-foreground sm:text-2xl">
                    Set your monthly budget and let <strong>Buckr</strong> show you when you can buy everything on your list.
                </p>
            </div>
        </section>
    )
}
