import NewsSection from "./NewsSection";

function News({ news }: { news: HTNews[] }) {
  return (
    <div>
      <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
        News
      </h1>
      {news
        .sort((a, b) => b.updated_at.seconds - a.updated_at.seconds)
        .map((n) => (
          <NewsSection key={n.id} newsItem={n} />
        ))}
    </div>
  );
}

export default News;
