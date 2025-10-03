export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Main Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
