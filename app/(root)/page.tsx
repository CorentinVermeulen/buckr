import HeroSection from "@/components/hero-section";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />

      {/* Features Section */}
      <section className="container py-8 md:py-12 pb-16 md:pb-20">
        <div className="max-w-[64rem] mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center mb-8">Powerful Features to Manage Your Purchases</h2>

          <ul className="space-y-4 text-lg">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Smart Wishlist Management</strong> - Easily create and organize wishlist items with prices and quick links for future reference.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Strategic Purchase Planning</strong> - Prioritize your purchases in a buy queue that aligns with your monthly budget constraints.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Customizable Budget Allocation</strong> - Define and adjust your monthly spending limits to maintain financial discipline.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Progress Tracking</strong> - Visualize how close you are to affording your next desired item with intuitive progress indicators.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Gamified Saving Experience</strong> - Transform saving into an engaging journey with achievement-based rewards.</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              <span><strong>Idea Backlog</strong> - Keep track of potential future purchases without commitment, ensuring no great idea gets forgotten.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Illustration Section */}
      <section className="container flex flex-col justify-center items-center py-8 md:py-12">
        <h2 className="text-3xl font-bold text-center mb-8">App Illustration</h2>
        <div className="max-w-[64rem]">
          <Image 
            src="/illustration.png" 
            alt="Buckr application example" 
            width={1000} 
            height={600} 
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

    </main>
  );
}
