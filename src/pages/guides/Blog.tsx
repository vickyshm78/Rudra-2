import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, User, Clock, ArrowRight, 
  Search, Tag, TrendingUp, Car,
  Wrench, DollarSign, FileText, Shield,
  Cpu, Newspaper
} from 'lucide-react';

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPost = {
    title: "The Future of Electric Vehicles: What to Expect in 2025",
    excerpt: "As we move towards a more sustainable future, electric vehicles are becoming increasingly popular. Here's what you need to know about the latest trends and technologies in the EV market.",
    image: "https://images.pexels.com/photos/7516509/pexels-photo-7516509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    author: "John Smith",
    date: "March 15, 2025",
    readTime: "8 min read",
    category: "Electric Vehicles"
  };

  const allPosts = [
    {
      title: "Essential Maintenance Tips for Your Vehicle",
      excerpt: "Regular maintenance is key to keeping your vehicle running smoothly. Learn about the most important maintenance tasks you should never skip.",
      image: "https://images.pexels.com/photos/3807171/pexels-photo-3807171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: "Emma Johnson",
      date: "March 12, 2025",
      readTime: "6 min read",
      category: "Maintenance"
    },
    {
      title: "How to Negotiate the Best Deal When Buying a Car",
      excerpt: "Getting the best deal on a new or used car requires preparation and strategy. Here are expert tips to help you negotiate effectively.",
      image: "https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: "Michael Brown",
      date: "March 10, 2025",
      readTime: "5 min read",
      category: "Buying Tips"
    },
    {
      title: "Top 10 Most Reliable SUVs of 2025",
      excerpt: "Looking for a dependable SUV? We've compiled a list of the most reliable models based on user reviews and expert ratings.",
      image: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: "Sarah Wilson",
      date: "March 8, 2025",
      readTime: "7 min read",
      category: "Vehicle Reviews"
    },
    {
      title: "Understanding Vehicle Safety Ratings",
      excerpt: "Safety should be a top priority when choosing a vehicle. Learn how to interpret safety ratings and what features to look for.",
      image: "https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: "David Chen",
      date: "March 5, 2025",
      readTime: "6 min read",
      category: "Safety"
    },
    {
      title: "The Latest Car Tech Features You Need to Know About",
      excerpt: "From advanced driver assistance to connected car features, here's what's new in automotive technology.",
      image: "https://images.pexels.com/photos/3843934/pexels-photo-3843934.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: "Lisa Zhang",
      date: "March 3, 2025",
      readTime: "5 min read",
      category: "Technology"
    },
    {
      title: "Global Automotive Market Trends 2025",
      excerpt: "Analysis of the latest trends shaping the automotive industry, from electric vehicles to shared mobility.",
      image: "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      author: "Robert Miller",
      date: "March 1, 2025",
      readTime: "8 min read",
      category: "Industry News"
    }
  ];

  const categories = [
    { name: "Electric Vehicles", icon: <Car /> },
    { name: "Maintenance", icon: <Wrench /> },
    { name: "Buying Tips", icon: <DollarSign /> },
    { name: "Vehicle Reviews", icon: <FileText /> },
    { name: "Safety", icon: <Shield /> },
    { name: "Technology", icon: <Cpu /> },
    { name: "Industry News", icon: <Newspaper /> }
  ];

  const trending = [
    "Best Electric Cars Under $40,000",
    "How to Extend Your Vehicle's Lifespan",
    "2025 Vehicle Technology Trends",
    "Common Maintenance Mistakes to Avoid"
  ];

  const filteredPosts = allPosts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled through the filteredPosts
  };

  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </form>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4 dark:text-white">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{featuredPost.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-4">{featuredPost.date}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredPost.readTime}</span>
                </div>
                <Link
                  to="#"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <Tag className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                      <button 
                        onClick={() => setSelectedCategory(post.category)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {post.category}
                      </button>
                    </div>
                    <h3 className="text-xl font-bold mb-2 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <Link
                      to="#"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(
                      category.name === selectedCategory ? null : category.name
                    )}
                    className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
                      category.name === selectedCategory
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Trending Posts
              </h3>
              <div className="space-y-4">
                {trending.map((post, index) => (
                  <Link
                    key={index}
                    to="#"
                    className="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-blue-800 dark:bg-blue-900 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-blue-100 mb-4">
                Get the latest automotive news and tips delivered to your inbox
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 rounded-lg mb-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full bg-white text-blue-800 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;