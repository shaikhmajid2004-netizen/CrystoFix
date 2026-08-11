import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <span className="text-orange-500 font-semibold">
            Indias Trusted Automotive Platform
          </span>

          <h1 className="text-6xl font-bold mt-6 leading-tight">
            Car Service Made
            <span className="text-orange-500"> Transparent</span>
          </h1>

          <p className="text-gray-400 mt-6 text-xl max-w-2xl">
            Book trusted garages, track repairs, get digital invoices,
            pickup & drop, and complete service history for your vehicle.
          </p>

          <div className="flex gap-4 mt-10">
            <Button size="lg">
              Book Service
            </Button>

            <Button variant="outline" size="lg">
              Explore Garages
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}