import { Navbar } from "@/components/navbar";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />
      <main className="container p-6">{children}</main>
    </div>
  );
}
