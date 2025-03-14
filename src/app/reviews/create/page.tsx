import ReviewCreateComponent from "@/components/reviews/reviewCreateComponent";

export default function Page() {
  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-20">
        <ReviewCreateComponent />
      </section>
    </main>
  );
}
