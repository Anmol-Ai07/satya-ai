export const metadata = {
  title: "Satya AI",
  description: "Truth Detector by Anmol Singh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}