import type { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Props {
  children: ReactNode;
  
}

export default function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />

      <main style={{ padding: "20px", minHeight: "80vh" }}>
        {children}
      </main>

      <Footer />
    </div>
  );
}