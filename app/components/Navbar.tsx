import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-orange-500"
        >
          CrystoFix
        </Link>

        <div className="flex items-center gap-6 text-sm text-gray-300">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="#">Vehicles</Link>
          <Link href="#">Bookings</Link>
          <Link href="#">Profile</Link>
        </div>
      </div>
    </nav>
  );
}