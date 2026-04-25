import { useEffect, useMemo, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useProductSummaries, type Product } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart } from '../contexts/cartStore';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { PageTransition } from '../components/PageTransition';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';
import { formatCurrency } from '../utils/formatters';
import { buildShopCategoryIndex } from './shop/buildShopCategoryIndex';
import { filterShopProducts } from './shop/filterShopProducts';
import { useShopFilters } from './shop/useShopFilters';

const PRODUCTS_PER_PAGE = 20;

const CHARM_BAR_ASSET_BASE = '/images/Charm%20Bar%20assets';

// Charm Bar specific categories (all top-level) with images
const CHARM_BAR_CATEGORIES = [
  { slug: 'charm', name: 'Charm', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`] },
  { slug: 'holiday', name: 'Holiday', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`] },
  { slug: 'italian-bracket', name: 'Italian Bracket', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`] },
  { slug: 'pendant-charm', name: 'Pendant Charm', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`] },
  { slug: 'welded-charm', name: 'Welded Charm', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`] },
  { slug: 'edgy-soul', name: 'Edgy Soul', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`] },
  { slug: 'foodie', name: 'Foodie', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`] },
  { slug: 'island-vibes', name: 'Island Vibes', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`] },
  { slug: 'love', name: 'Love', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`] },
  { slug: 'pets', name: 'Pets', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`] },
  { slug: 'pop-icon', name: 'Pop Icon', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`] },
  { slug: 'sky-dream', name: 'Sky Dream', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`] },
  { slug: 'soft-muse', name: 'Soft Muse', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`] },
  { slug: 'the-icon', name: 'The Icon', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`] },
  { slug: 'zodiac', name: 'Zodiac', image: `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, images: [`${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%203.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%201.png`, `${CHARM_BAR_ASSET_BASE}/CHARM%20VISUAL%202.png`] },
];

type ShopResultsProps = {
  filteredProducts: Product[];
  loading: boolean;
  onPrefetchProduct: () => void;
  onAddToCart: (product: Product) => void;
};

function ShopResults({ filteredProducts, loading, onPrefetchProduct, onAddToCart }: ShopResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, page]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found in Charm Bar collection.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="group cursor-pointer"
            onMouseEnter={() => onPrefetchProduct()}
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image || product.placeholder}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
              <p className="mt-1 text-sm font-semibold text-[#ff4b86]">
                {formatCurrency(product.price)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={!product.defaultVariantId}
              className="mt-2 w-full rounded-full bg-[#ff4b86] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff6a9a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-full border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-full border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function CharmBar() {
  const { data: products = [], isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useProductSummaries();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const productsRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const loading = (productsLoading || categoriesLoading) && products.length === 0;

  const {
    activeCategory,
    activeSubcategory,
    activeSubSubcategory,
    searchQuery,
    updateFilters,
  } = useShopFilters();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Image rotation animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % 3);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const categoryIndex = useMemo(
    () => (categories ? buildShopCategoryIndex(categories) : null),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    if (!products || !categories) return [];
    
    // Filter to only show Charm Bar specific categories
    const charmBarSlugs = CHARM_BAR_CATEGORIES.map(cat => cat.slug);
    const charmBarProducts = products.filter((product) => {
      if (!product.categorySlug) return false;
      
      // Check if category is in Charm Bar categories
      return charmBarSlugs.includes(product.categorySlug);
    });

    return filterShopProducts({
      products: charmBarProducts,
      activeCategory: activeCategory || 'all',
      activeSubcategory: activeSubcategory || 'all',
      activeSubSubcategory: activeSubSubcategory || 'all',
      searchQuery: searchQuery || '',
      allowedSlugMap: categoryIndex?.allowedSlugMap || new Map(),
      bestSellerIds: [],
    });
  }, [products, categories, categoryIndex, activeCategory, activeSubcategory, activeSubSubcategory, searchQuery]);

  // Get available categories for Charm Bar
  const availableCategories = useMemo(() => {
    if (!categories) return [];
    
    const charmBarSlugs = CHARM_BAR_CATEGORIES.map(cat => cat.slug);
    return categories.filter((cat) => charmBarSlugs.includes(cat.slug));
  }, [categories]);

  const activeSubcategories = useMemo(() => {
    if (!activeCategory || activeCategory === 'all' || !categoryIndex) return [];
    return categoryIndex.childCategoriesByParentSlug.get(activeCategory) || [];
  }, [activeCategory, categoryIndex]);

  const activeSubSubcategories = useMemo(() => {
    if (!activeSubcategory || activeSubcategory === 'all' || !categoryIndex) return [];
    return categoryIndex.childCategoriesByParentSlug.get(activeSubcategory) || [];
  }, [activeSubcategory, categoryIndex]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showToast('error', 'Please log in to add items to cart');
      return;
    }
    if (!product.defaultVariantId || !product.defaultVariantName) return;

    try {
      addItem(
        {
          productId: product.id,
          productName: product.name,
          productImageUrl: product.image,
          variantId: product.defaultVariantId,
          variantName: product.defaultVariantName,
          unitPrice: product.price,
        },
        1
      );
      showToast('success', `${product.name} added to cart`);
    } catch {
      showToast('error', 'Failed to add to cart');
    }
  };

  const prefetchProduct = () => {
    // Prefetch disabled for now - can be implemented later if needed
  };

  const scrollToCategory = (index: number) => {
    const container = document.getElementById('category-scroll-container');
    if (container) {
      const buttons = container.querySelectorAll('button');
      if (buttons[index]) {
        buttons[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <section className="overflow-hidden border-b border-black/10 bg-white">
          <div className="mx-auto max-w-[1680px]">
            <div className="relative bg-[linear-gradient(180deg,#efe6e4_0%,#f4eeeb_100%)]">
              <img
                src={`${CHARM_BAR_ASSET_BASE}/43620168072.png`}
                alt="Charm bar hero"
                className="aspect-[16/8.6] w-full object-cover object-center"
              />
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Category Image Grid */}
          <div className="mb-12">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  const container = document.getElementById('category-grid-container');
                  if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:shadow-xl hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              
              <div 
                id="category-grid-container"
                className="flex gap-4 overflow-x-auto hide-scrollbar px-12 py-4 scroll-smooth"
              >
                {CHARM_BAR_CATEGORIES.map((category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => {
                        updateFilters({
                          category: isActive ? null : category.slug,
                          subcategory: null,
                          subsubcategory: null,
                        });
                      }}
                      className="group flex-shrink-0 text-center w-24 sm:w-28 md:w-32 lg:w-36"
                    >
                      <div className={`relative aspect-square overflow-hidden rounded-[20%] border-2 transition-all duration-300 ${
                        isActive
                          ? 'border-[#ff4b86] shadow-lg scale-105'
                          : 'border-gray-200 hover:border-[#ff4b86] hover:scale-105'
                      }`}>
                        {category.images.map((img: string, idx: number) => {
                          const isActive = idx === (activeImageIndex % category.images.length);
                          return (
                            <img
                              key={idx}
                              src={img}
                              alt={`${category.name} ${idx + 1}`}
                              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${
                                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                              }`}
                            />
                          );
                        })}
                        {isActive && (
                          <div className="absolute inset-0 bg-[#ff4b86]/20 flex items-center justify-center">
                            <div className="bg-[#ff4b86] text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Selected
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-700 group-hover:text-[#ff4b86] transition-colors">
                        {category.name}
                      </p>
                    </button>
                  );
                })}
              </div>
              
              <button
                type="button"
                onClick={() => {
                  const container = document.getElementById('category-grid-container');
                  if (container) {
                    container.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:shadow-xl hover:scale-105"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
          <div ref={productsRef} className="mb-8 border-b border-gray-100 pb-0 sticky top-0 bg-white z-40 pt-4 -mt-6">
            <div className="flex flex-col space-y-4">
              <div className="relative w-full max-w-md mx-auto mb-2 px-2">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      updateFilters({ q: e.target.value });
                    }}
                    placeholder="Search Charm Bar products..."
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#ff4b86] focus:ring-1 focus:ring-[#ff4b86] ux-transition-color"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => {
                        updateFilters({ q: null });
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-200 ux-transition-color"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const container = document.getElementById('category-scroll-container');
                      if (container) {
                        container.scrollBy({ left: -200, behavior: 'smooth' });
                      }
                    }}
                    className="absolute left-0 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:shadow-xl hover:scale-105 md:p-2.5 md:block hidden"
                  >
                    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                  </button>
                  
                  <div 
                    id="category-scroll-container"
                    className="flex space-x-4 md:space-x-6 overflow-x-auto w-full pb-0 hide-scrollbar px-8 md:px-12 justify-center md:justify-start scroll-smooth"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        updateFilters({
                          category: null,
                          subcategory: null,
                          subsubcategory: null,
                        });
                        scrollToCategory(0);
                      }}
                      className={`px-3 md:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ux-transition-color ${
                        activeCategory === null
                          ? 'bg-[#ff4b86] text-white border-[#ff4b86] shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-[#ff4b86] hover:text-[#ff4b86]'
                      }`}
                    >
                      All
                    </button>
                    {availableCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          updateFilters({
                            category: category.slug,
                            subcategory: null,
                            subsubcategory: null,
                          });
                        }}
                        className={`px-3 md:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ux-transition-color ${
                          activeCategory === category.slug
                            ? 'bg-[#ff4b86] text-white border-[#ff4b86] shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#ff4b86] hover:text-[#ff4b86]'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const container = document.getElementById('category-scroll-container');
                      if (container) {
                        container.scrollBy({ left: 200, behavior: 'smooth' });
                      }
                    }}
                    className="absolute right-0 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:shadow-xl hover:scale-105 md:p-2.5 md:block hidden"
                  >
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {activeCategory !== 'all' && activeSubcategories.length > 0 ? (
                <div className="w-full justify-center md:justify-start flex overflow-x-auto hide-scrollbar pb-2 px-2">
                  <div className="flex gap-1.5 md:gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateFilters({
                          subcategory: null,
                          subsubcategory: null,
                        });
                      }}
                      className={`px-3 md:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ux-transition-color ${
                        activeSubcategory === null
                          ? 'bg-[#ff4b86] text-white border-[#ff4b86] shadow-sm'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-[#ff4b86] hover:text-[#ff4b86]'
                      }`}
                    >
                      All
                    </button>
                    {activeSubcategories.map((subcategory) => (
                      <button
                        key={subcategory.slug}
                        type="button"
                        onClick={() => {
                          updateFilters({
                            subcategory: subcategory.slug,
                            subsubcategory: null,
                          });
                        }}
                        className={`px-3 md:px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap border ux-transition-color ${
                          activeSubcategory === subcategory.slug
                            ? 'bg-[#ff4b86] text-white border-[#ff4b86] shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-[#ff4b86] hover:text-[#ff4b86]'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeCategory !== 'all' && activeSubcategory !== 'all' && activeSubSubcategories.length > 0 ? (
                <div className="w-full justify-center md:justify-start flex overflow-x-auto hide-scrollbar pb-3 px-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateFilters({ subsubcategory: null })}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border ux-transition-color ${
                        activeSubSubcategory === null
                          ? 'bg-[#ff4b86]/10 text-[#ff4b86] border-[#ff4b86]/30'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-[#ff4b86]/50 hover:text-[#ff4b86]'
                      }`}
                    >
                      All
                    </button>
                    {activeSubSubcategories.map((subcategory) => (
                      <button
                        key={subcategory.slug}
                        type="button"
                        onClick={() => updateFilters({ subsubcategory: subcategory.slug })}
                        className={`px-4 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap border ux-transition-color ${
                          activeSubSubcategory === subcategory.slug
                            ? 'bg-[#ff4b86]/10 text-[#ff4b86] border-[#ff4b86]/30'
                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-[#ff4b86]/50 hover:text-[#ff4b86]'
                        }`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {productsError ? (
            <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
              <p className="text-sm text-red-700 mb-4">
                {productsError instanceof Error ? productsError.message : 'Failed to load charm bar data'}
              </p>
              <button
                type="button"
                onClick={() => {
                  refetchProducts();
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark ux-transition-color text-sm font-medium"
              >
                Retry
              </button>
            </div>
          ) : null}

          <ShopResults
            filteredProducts={filteredProducts}
            loading={loading}
            onPrefetchProduct={prefetchProduct}
            onAddToCart={handleAddToCart}
          />
        </main>
      </div>
    </PageTransition>
  );
}
