export default function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <header>
        <h1>Private Section</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
