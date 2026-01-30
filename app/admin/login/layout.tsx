export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout bypasses the parent admin layout
  return <>{children}</>;
}