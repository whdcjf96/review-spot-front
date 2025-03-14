import ReviewsListComponent from "@/components/reviews/reviewsListComponent";
import { ReviewItem } from "@/types/types";

export default function Page() {

  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-20">
        <ReviewsListComponent  />
      </section>
    </main>
  );
}
