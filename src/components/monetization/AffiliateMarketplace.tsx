import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Filter, Search, ChevronDown, ChevronUp, DollarSign, Truck, Clock, PenTool, CheckCircle, RefreshCw, Package, Zap } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface AffiliateMarketplaceProps {
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
  };
  category?: 'all' | 'accessories' | 'parts' | 'electronics' | 'care';
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  compatibleVehicles: {
    make: string;
    model: string;
    years: number[];
  }[];
  images: string[];
  inStock: boolean;
  deliveryTime: string;
  installationAvailable: boolean;
  installationPrice?: number;
  commission: number;
  commissionRate: number;
}

const AffiliateMarketplace: React.FC<AffiliateMarketplaceProps> = ({
  vehicleDetails,
  category = 'all'
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<{id: string, quantity: number}[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'price_low' | 'price_high' | 'commission'>('popular');

  useEffect(() => {
    fetchProducts();
  }, [vehicleDetails]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock products
      const mockProducts: Product[] = [
        {
          id: 'prod1',
          name: 'Premium Car Cover',
          category: 'accessories',
          price: 2499,
          rating: 4.5,
          reviewCount: 128,
          description: 'Waterproof, dustproof car cover with UV protection. Custom fit for your vehicle.',
          compatibleVehicles: [
            {
              make: 'All',
              model: 'All',
              years: Array.from({ length: 30 }, (_, i) => 1995 + i)
            }
          ],
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          inStock: true,
          deliveryTime: '3-5 days',
          installationAvailable: false,
          commission: 375,
          commissionRate: 15
        },
        {
          id: 'prod2',
          name: 'Android Auto & Apple CarPlay Upgrade Kit',
          category: 'electronics',
          price: 8999,
          rating: 4.7,
          reviewCount: 342,
          description: 'Add Android Auto and Apple CarPlay functionality to your factory stereo. Easy installation with no cutting or splicing.',
          compatibleVehicles: [
            {
              make: 'Honda',
              model: 'City',
              years: [2015, 2016, 2017, 2018, 2019]
            },
            {
              make: 'Hyundai',
              model: 'Creta',
              years: [2016, 2017, 2018, 2019, 2020]
            },
            {
              make: 'Maruti Suzuki',
              model: 'Swift',
              years: [2018, 2019, 2020, 2021]
            }
          ],
          images: ['https://images.pexels.com/photos/6894528/pexels-photo-6894528.jpeg'],
          inStock: true,
          deliveryTime: '3-5 days',
          installationAvailable: true,
          installationPrice: 1500,
          commission: 1800,
          commissionRate: 20
        },
        {
          id: 'prod3',
          name: '360° Dash Camera with Parking Mode',
          category: 'electronics',
          price: 6499,
          rating: 4.6,
          reviewCount: 215,
          description: 'Full HD 360° view dash camera with night vision, G-sensor, and parking monitoring mode.',
          compatibleVehicles: [
            {
              make: 'All',
              model: 'All',
              years: Array.from({ length: 20 }, (_, i) => 2005 + i)
            }
          ],
          images: ['https://images.pexels.com/photos/6894528/pexels-photo-6894528.jpeg'],
          inStock: true,
          deliveryTime: '3-5 days',
          installationAvailable: true,
          installationPrice: 999,
          commission: 975,
          commissionRate: 15
        },
        {
          id: 'prod4',
          name: 'Premium 3D Floor Mats',
          category: 'accessories',
          price: 3999,
          rating: 4.8,
          reviewCount: 456,
          description: 'Custom-fit 3D floor mats with raised edges to contain spills. Durable and easy to clean.',
          compatibleVehicles: [
            {
              make: 'Honda',
              model: 'City',
              years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
            },
            {
              make: 'Hyundai',
              model: 'Creta',
              years: [2016, 2017, 2018, 2019, 2020, 2021, 2022]
            },
            {
              make: 'Maruti Suzuki',
              model: 'Swift',
              years: [2018, 2019, 2020, 2021, 2022]
            }
          ],
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          inStock: true,
          deliveryTime: '2-3 days',
          installationAvailable: false,
          commission: 800,
          commissionRate: 20
        },
        {
          id: 'prod5',
          name: 'Car Air Purifier with HEPA Filter',
          category: 'electronics',
          price: 4999,
          rating: 4.4,
          reviewCount: 189,
          description: 'Compact air purifier with HEPA filter, removes 99.97% of dust, pollen, smoke, and odors.',
          compatibleVehicles: [
            {
              make: 'All',
              model: 'All',
              years: Array.from({ length: 30 }, (_, i) => 1995 + i)
            }
          ],
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          inStock: true,
          deliveryTime: '2-3 days',
          installationAvailable: false,
          commission: 1000,
          commissionRate: 20
        },
        {
          id: 'prod6',
          name: 'Ceramic Coating Kit',
          category: 'care',
          price: 7999,
          rating: 4.3,
          reviewCount: 112,
          description: 'Professional-grade ceramic coating kit for long-lasting paint protection with hydrophobic properties.',
          compatibleVehicles: [
            {
              make: 'All',
              model: 'All',
              years: Array.from({ length: 30 }, (_, i) => 1995 + i)
            }
          ],
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          inStock: true,
          deliveryTime: '3-5 days',
          installationAvailable: true,
          installationPrice: 5000,
          commission: 1600,
          commissionRate: 20
        },
        {
          id: 'prod7',
          name: 'OEM Replacement Brake Pads',
          category: 'parts',
          price: 3499,
          rating: 4.7,
          reviewCount: 324,
          description: 'Genuine OEM replacement brake pads for optimal performance and safety.',
          compatibleVehicles: [
            {
              make: 'Honda',
              model: 'City',
              years: [2015, 2016, 2017, 2018, 2019, 2020]
            },
            {
              make: 'Honda',
              model: 'Civic',
              years: [2016, 2017, 2018, 2019, 2020]
            }
          ],
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          inStock: true,
          deliveryTime: '2-3 days',
          installationAvailable: true,
          installationPrice: 1200,
          commission: 525,
          commissionRate: 15
        },
        {
          id: 'prod8',
          name: 'Premium Car Wash & Wax Kit',
          category: 'care',
          price: 1999,
          rating: 4.6,
          reviewCount: 278,
          description: 'Complete car wash and wax kit with microfiber cloths, premium soap, and carnauba wax.',
          compatibleVehicles: [
            {
              make: 'All',
              model: 'All',
              years: Array.from({ length: 30 }, (_, i) => 1995 + i)
            }
          ],
          images: ['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg'],
          inStock: true,
          deliveryTime: '2-3 days',
          installationAvailable: false,
          commission: 400,
          commissionRate: 20
        }
      ];
      
      // Filter for compatible products if vehicle details are provided
      let filteredProducts = mockProducts;
      if (vehicleDetails) {
        filteredProducts = mockProducts.filter(prod => {
          return prod.compatibleVehicles.some(compat => {
            return (compat.make === 'All' || compat.make === vehicleDetails.make) &&
                   (compat.model === 'All' || compat.model === vehicleDetails.model) &&
                   compat.years.includes(vehicleDetails.year);
          });
        });
      }
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesPrice = prod.price >= priceRange[0] && prod.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.rating * b.reviewCount - a.rating * a.reviewCount;
    } else if (sortBy === 'price_low') {
      return a.price - b.price;
    } else if (sortBy === 'price_high') {
      return b.price - a.price;
    } else if (sortBy === 'commission') {
      return b.commission - a.commission;
    }
    return 0;
  });

  const categories = ['all', ...Array.from(new Set(products.map(prod => prod.category)))];

  const addToCart = (productId: string) => {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { id: productId, quantity: 1 }]);
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find(prod => prod.id === item.id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);

  const totalCommission = cart.reduce((total, item) => {
    const product = products.find(prod => prod.id === item.id);
    return total + (product?.commission || 0) * item.quantity;
  }, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white flex items-center">
            <ShoppingBag className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
            Affiliate Marketplace
          </h2>
          
          {cart.length > 0 && (
            <div className="flex items-center">
              <div className="mr-4 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Your Commission: </span>
                <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(totalCommission)}</span>
              </div>
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Cart ({cart.length}) - {formatCurrency(cartTotal)}
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="popular">Most Popular</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="commission">Highest Commission</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Filter className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-2 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    {categories.filter(c => c !== 'all').map((category) => (
                      <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price Range
                  </label>
                  <select
                    value={`${priceRange[0]}-${priceRange[1]}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(Number);
                      setPriceRange([min, max]);
                    }}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white"
                  >
                    <option value="0-50000">All Prices</option>
                    <option value="0-2000">Under ₹2,000</option>
                    <option value="2000-5000">₹2,000 - ₹5,000</option>
                    <option value="5000-10000">₹5,000 - ₹10,000</option>
                    <option value="10000-50000">Above ₹10,000</option>
                  </select>
                </div>
                
                {vehicleDetails && (
                  <div className="flex items-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg w-full">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        Showing products compatible with your {vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="border rounded-lg overflow-hidden transition-colors border-gray-200 dark:border-gray-700 relative"
                  >
                    <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                      {product.commissionRate}% COMMISSION
                    </div>
                    
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium dark:text-white">{product.name}</h4>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({product.reviewCount})
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Earn: {formatCurrency(product.commission)}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Truck className="h-4 w-4 mr-1" />
                          {product.deliveryTime}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                          className="text-sm text-blue-600 dark:text-blue-400"
                        >
                          {expandedProduct === product.id ? 'Less info' : 'More info'}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => addToCart(product.id)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                      
                      {/* Expanded Info */}
                      {expandedProduct === product.id && (
                        <div className="mt-4 pt-4 border-t dark:border-gray-700">
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                Delivery: {product.deliveryTime}
                              </span>
                            </div>
                            
                            {product.installationAvailable && (
                              <div className="flex items-center text-sm">
                                <PenTool className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-gray-600 dark:text-gray-300">
                                  Installation available: {formatCurrency(product.installationPrice || 0)}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm">
                              <Zap className="h-4 w-4 text-orange-500 mr-2" />
                              <span className="text-gray-600 dark:text-gray-300">
                                Commission: {formatCurrency(product.commission)} ({product.commissionRate}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. 
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </>
        )}

        {/* Affiliate Program Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Affiliate Program Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Earn Commissions</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Earn 15-20% commission on every product sold through your referrals
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Quality Products</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Curated selection of high-quality automotive products
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Fast Delivery</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quick delivery directly to your customers
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full text-blue-600 dark:text-blue-400 mr-3">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium dark:text-white">Easy Returns</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  30-day hassle-free return policy for all products
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateMarketplace;