import DriverHeader from "@/components/driver/DriverHeader";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DriverHeader />
      {children}
    </>
  );
}