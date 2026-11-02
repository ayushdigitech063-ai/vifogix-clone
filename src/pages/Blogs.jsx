import { useState } from "react";
import HeroBanner from "../components/blogs-sections/HeroBanner";
import FeaturedPost from "../components/blogs-sections/FeaturedPost";
import BlogListing from "../components/blogs-sections/BlogListing";
import NewsletterSection from "../components/blogs-sections/NewsletterSection";
import {
  hero,
  categories,
  posts,
  popularTags,
  newsletter,
} from "../data/blogs";

const Blogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const isFiltering =
    Boolean(searchQuery && searchQuery.trim()) ||
    (activeCategory && activeCategory !== "All");

  return (
    <main className="font-sans">
      {/* 1. Hero Banner (Navy Gradient) */}
      <HeroBanner
        hero={hero}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Featured Post (White Background - displayed when no search/category filter is active) */}
      {/* {!isFiltering && <FeaturedPost post={featuredPost} />} */}

      {/* 3. Blog Listing + Sidebar (Warm Cream Background) */}
      <BlogListing
        posts={posts}
        categories={categories}
        popularTags={popularTags}
        newsletter={newsletter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 4. Newsletter CTA Section (White Background container with Dark Rounded Card) */}
      <NewsletterSection newsletter={newsletter} />
    </main>
  );
};

export default Blogs;

