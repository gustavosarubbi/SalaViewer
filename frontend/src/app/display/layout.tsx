export default function DisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative bg-white">
      {/* Background fixo branco */}
      <div className="fixed inset-0 z-0 bg-white"></div>

      {/* Main Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
