import ReviewsListComponent from "@/components/reviews/reviewsListComponent";
import { ReviewItem } from "@/types/types";

export default function Page() {
  const items: ReviewItem[] = [
    {
      id: 1,
      nickname: "nickname1",
      avgScore: 85,
      noseScore: 85,
      palateScore: 85,
      finishScore: 85,
      content:
        "Overall, there are no off-notes, and the note composition is excellent. First of all, the note composition of the nose is really good. On the palate, the medium to mild peatiness supports the main citrus note of orange. The elements that could have become off-notes if overdone are suppressed at just the right level, making it feel quite complex. Although the strength of the palate/finish feels a bit lacking considering the high ABV, this seems to be almost the best performance possible given the age and specifications.",
      createdAt: "2021-09-01 00:00:00",
      product: {
        product_id: 1,
        product_name: "스프링뱅크 10",
        img_path: "/temp/스뱅.webp",
        alcohol: 46,
        capacity: 700,
        area: "캠밸타운",
        category: {
          id: 1,
          name: "싱글몬트",
          created: "ㅅㄷㄴㅅ",
          updated: "test",
        },
      },
      aromaProfile: {
        labels: [
          "Citrus",
          "Tropical Fruits",
          "Pome Fruits",
          "Dried Fruits",
          "Vanilla",
          "Honey",
          "Smoke",
          "Peat",
          "Nutty",
          "Malt",
        ],
        data: [10, 20, 15, 25, 30, 35, 40, 25, 20, 15],
      },
    },
    {
      id: 2,
      nickname: "nickname2",
      avgScore: 85,
      noseScore: 85,
      palateScore: 85,
      finishScore: 85,
      content:
        "Overall, there are no off-notes, and the note composition is excellent. First of all, the note composition of the nose is really good. On the palate, the medium to mild peatiness supports the main citrus note of orange. The elements that could have become off-notes if overdone are suppressed at just the right level, making it feel quite complex. Although the strength of the palate/finish feels a bit lacking considering the high ABV, this seems to be almost the best performance possible given the age and specifications.",
      createdAt: "2021-09-01 00:00:00",
      product: {
        product_id: 2,
        product_name: "와일드터키 레어브리드",
        img_path: "/temp/레어브리드.webp",
        alcohol: 58.4,
        capacity: 750,
        area: "켄터키",
        category: {
          id: 1,
          name: "싱글몬트",
          created: "ㅅㄷㄴㅅ",
          updated: "test",
        },
      },
      aromaProfile: {
        labels: [
          "Citrus",
          "Tropical Fruits",
          "Pome Fruits",
          "Dried Fruits",
          "Vanilla",
          "Honey",
          "Smoke",
          "Peat",
          "Nutty",
          "Malt",
        ],
        data: [12, 18, 22, 28, 32, 38, 35, 30, 25, 20],
      },
    },
  ];
  return (
    <main className="container-xl">
      <section className="p-8 flex flex-col space-y-20">
        <ReviewsListComponent items={items} />
      </section>
    </main>
  );
}
