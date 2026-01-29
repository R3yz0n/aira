interface CategoryListProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: { id: string; name: string }[];
  isCategoryLoading: boolean;
}

export default function CategoryList({
  activeCategory,
  setActiveCategory,
  categories,
  isCategoryLoading,
}: CategoryListProps) {
  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-8">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {/* All Categories Button */}
        {!isCategoryLoading && (categories?.length ?? 0) > 0 && (
          <button
            key="all"
            onClick={() => setActiveCategory("all")}
            className={`md:px-6 px-2 py-2 border text-xs md:text-base rounded-full font-medium transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All
          </button>
        )}
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`md:px-6 px-2 py-2 border text-xs md:text-base rounded-full font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
