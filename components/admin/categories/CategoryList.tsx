import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container py-4 min-h-28 lg:min-h-24 justify-center flex items-center  mx-auto px-2 md:px-4 lg:px-8"
    >
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {/* Skeleton Loading State */}
        {isCategoryLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="md:px-6 px-2 py-2 border text-xs md:text-base text-opacity-0 text-black rounded-full font-medium bg-muted animate-pulse "
            >
              Category
            </div>
          ))}

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
    </motion.div>
  );
}
