import Navbar from "@/components/layout/navbar";
import ProductsPage from "./products/page";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ProductsPage />
      </main>
    </>
  );
}
