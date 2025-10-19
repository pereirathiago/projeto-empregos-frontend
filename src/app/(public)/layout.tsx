import { IpPortAPI } from "@/components/IpPortAPI";

export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="fixed bottom-15 right-4">
        <IpPortAPI />
      </div>

      {children}
    </>
  );
}
