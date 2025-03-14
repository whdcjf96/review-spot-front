import Image from "next/image";

export default function BannerComponent() {
  return (
    <article className="w-full h-full flex flex-col justify-center items-center mx-auto p-4">
      <div className="relative w-full h-[60vh] p-14 flex items-center justify-start overflow-hidden">
        <Image
          src="/whisky-banner.jpg"
          alt="Whisky Banner"
          fill
          className="object-cover"
        />
        <div className="text-left text-white z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Discover the World of Fine Whiskies
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8">
            Unveil rich flavors and exclusive reviews
          </p>
        </div>
      </div>
    </article>
  );
}
