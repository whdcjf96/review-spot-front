import BannerComponent from "@/components/main/bannerComponent";
import ProductList from "@/components/products/productListComponent";

export default function Page() {
  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-20">
        <BannerComponent />
        <ProductList />
      </section>
    </main>
  );
}
