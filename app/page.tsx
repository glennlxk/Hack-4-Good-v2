import PopularListing from "@/components/global/popularListing";
// To Do List -- Build Stripe Integrate, Test out component

export default function Home() {
  return (
    <div className="min-h-full w-full bg-primary-100 overflow-hidden ">
      {/* Hero section */}
      <div className="relative tracking-tight">
        <div className="w-[100vw] h-[32rem] bg-cover -z-10 bg-[url('/hero-background.jpg')] flex items-center justify-center">
          <div className="text-main-100 text-3xl font-bold tracking-normal">
            This is some random text
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-12 px-6 xl:px-1 tracking-tight">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-main-700 text-center">
            What is Popular
          </h1>
          <div className="mt-2 mb-4 text-main-400">
            Check out some of our top sellers
          </div>
        </div>
        <PopularListing />
      </div>
    </div>
  );
}
