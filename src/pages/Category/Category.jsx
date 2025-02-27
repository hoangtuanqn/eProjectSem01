import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { DoorClosedIcon as CloseIcon, FilterIcon, Heart, HeartOff } from "lucide-react";
import toast from "react-hot-toast";

import "~/styles/category.css";
import NotData from "~/components/NotData";
import productData from "~/data/products.json";
import categoriesData from "~/data/categories.json";
import { useWishlistActions } from "~/utils/handleWishlist";
import { calculateOriginalPrice } from "~/utils/helpers";

export default function Category({ nameCategory }) {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [isChecking, setIsChecking] = useState(true);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedEducationLevels, setSelectedEducationLevels] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [openCategories, setOpenCategories] = useState({
        search: true,
        category: true,
        education: true,
        price: true,
        sizes: true,
        sale: true,
        gender: true,
    });
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: 1, max: 999 });
    const [priceInputs, setPriceInputs] = useState({
        min: 1,
        max: 999,
    });
    const location = useLocation();
    const [selectedSale, setSelectedSale] = useState([]);
    const [searchTerm, setSearchTerm] = useState(() => {
        // Chỉ lấy search từ location.state khi khởi tạo lần đầu
        return location.state?.searchTerm || "";
    });

    // Thêm state tạm thời cho mobile filter
    const [tempMobileFilters, setTempMobileFilters] = useState({
        categories: [],
        sizes: [],
        educationLevels: [],
        sale: [],
        priceRange: { min: 10, max: 999 },
        searchTerm: "",
        genders: [],
    });

    // Thêm state cho sorting
    const [sortOption, setSortOption] = useState("newest");

    // Thêm state cho gender filter
    const [selectedGenders, setSelectedGenders] = useState([]);

    // Thay thế state currentPage bằng visibleItems
    const [visibleItems, setVisibleItems] = useState(20);

    // Thêm state để quản lý trạng thái loading
    const [isLoading, setIsLoading] = useState(false);

    // Add wishlist hooks
    const { handleWishlistAction, isProductInWishlist, loadingStates: wishlistLoadingStates } = useWishlistActions();

    // Kiểm tra path và slug
    useEffect(() => {
        // Nếu path là /all-product thì không cần kiểm tra

        // Kiểm tra xem slug có tồn tại trong categories không
        const categoryExists = categoriesData.some((category) => category.slug === slug);
        if (!categoryExists && slug !== "all-product") {
            navigate("/404", { replace: true });
        }
        setIsChecking(false);
    }, [slug, navigate]);
    // Tự động chọn category dựa trên slug

    useEffect(() => {
        if (slug === "all-product") {
            // Không reset selected categories khi chuyển sang all-product
            return;
        } else {
            const category = categoriesData.find((cat) => cat.slug === slug);
            if (category) {
                setSelectedCategories((prev) => {
                    // Nếu category đã có trong danh sách, giữ nguyên danh sách
                    if (prev.includes(category.name)) {
                        return prev;
                    }
                    // Nếu category chưa có, thêm vào danh sách hiện tại

                    return [...prev, category.name];
                });
            }
        }
    }, [slug]);

    // Cập nhật lại data memo để phù hợp với logic mới
    const data = useMemo(() => {
        if (slug === "all-product") return productData;
        const category = categoriesData.find((cat) => cat.slug === slug);
        return category ? productData.filter((product) => product.category === category.name) : [];
    }, [slug]);

    const [filteredProducts, setFilteredProducts] = useState(data);
    const [displayColumns, setDisplayColumns] = useState(4);

    // Đồng bộ giá trị ban đầu
    useEffect(() => {
        setPriceInputs({
            min: priceRange.min,
            max: priceRange.max,
        });
    }, []); // Chỉ chạy một lần khi component mount

    // Hàm để mở/tắt các danh mục bộ lọc
    const toggleCategory = useCallback((category) => {
        setOpenCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    }, []);

    // Định nghĩa các options
    const sizeOptions = ["S", "M", "L", "XL", "XXL"];
    const educationOptions = ["Preschool", "Elementary School", "High School", "University"];

    // Thêm gender options
    const genderOptions = ["Unisex", "Male", "Female"];

    // Thêm handlers cho các filter mới
    const handleSizeChange = useCallback((size) => {
        setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    }, []);

    const handleEducationChange = useCallback((level) => {
        setSelectedEducationLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
        );
    }, []);
    
    const handleCategoryChange = useCallback(
        (categoryName) => {
            // Không đứng ở trang all-product
            if (slug !== "all-product") {
                // Kiểm tra xem category được click có phải là category hiện tại không
                const currentCategory = categoriesData.find((cat) => cat.slug === slug);
                if (currentCategory && currentCategory.name === categoryName) {
                    // Nếu đúng là category hiện tại, chỉ cần bỏ chọn nó và chuyển sang trang all-product
                    setSelectedCategories([]);
                    navigate("/category/all-product");
                    return;
                }

                // Nếu không phải category hiện tại, chuyển về all-product
                setSelectedCategories((prev) => {
                    if (prev.includes(categoryName)) {
                        return prev;
                    }
                    // console.log([prev, categoryName]);

                    return [...prev, categoryName];
                });
                navigate("/category/all-product");
            } else {
                // Nếu đã ở all-product, xử lý toggle như bình thường
                setSelectedCategories((prev) => {
                    const categoriesNew = prev.includes(categoryName)
                        ? prev.filter((c) => c !== categoryName)
                        : [...prev, categoryName];
                    if (categoriesNew.length === 1) {
                        const slugNew = categoriesData.find((cat) => cat.name === categoriesNew[0]).slug;
                        navigate(`/category/${slugNew}`);
                    }
                    return categoriesNew;
                });
            }
        },
        [slug, navigate, categoriesData],
    );

    useEffect(() => {
        if (slug !== "all-product") {
            setSelectedCategories([categoriesData.find((cat) => cat.slug === slug)?.name]);
        }
    }, [slug]);

    // Thêm hàm xử lý filter sale
    const handleSelectSale = (saleStatus) => {
        setSelectedSale((prev) => {
            if (prev.includes(saleStatus)) {
                return prev.filter((status) => status !== saleStatus);
            } else {
                return [...prev, saleStatus];
            }
        });
    };

    // Thêm handler cho gender filter
    const handleGenderChange = useCallback((gender) => {
        setSelectedGenders((prev) => (prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]));
    }, []);

    // Cập nhật lại filteredProductsList để thêm điều kiện search
    const filteredProductsList = useMemo(() => {
        return productData.filter((product) => {
            // Thêm điều kiện search
            const searchCondition = product.name.toLowerCase().includes(searchTerm.trim().toLowerCase());

            // Lọc sản phẩm hết hàng
            if (product.quantity <= 0) return false;

            // Các điều kiện lọc hiện có
            const priceCondition = product.price >= priceRange.min && product.price <= priceRange.max;

            const sizeCondition =
                selectedSizes.length === 0 || product.sizes.some((size) => selectedSizes.includes(size));

            const educationCondition =
                selectedEducationLevels.length === 0 || selectedEducationLevels.includes(product.education_levels);

            const categoryCondition = selectedCategories.length === 0 || selectedCategories.includes(product.category);

            const saleCondition =
                selectedSale.length === 0 ||
                (selectedSale.includes("On Sale") && product.sale > 0) ||
                (selectedSale.includes("Regular Price") && product.sale === 0);

            const genderCondition = selectedGenders.length === 0 || selectedGenders.includes(product.gender);

            return (
                searchCondition &&
                priceCondition &&
                sizeCondition &&
                educationCondition &&
                categoryCondition &&
                saleCondition &&
                genderCondition
            );
        });
    }, [
        productData,
        searchTerm, // Thêm searchTerm vào dependencies
        priceRange,
        selectedSizes,
        selectedEducationLevels,
        selectedCategories,
        selectedSale,
        selectedGenders,
    ]);

    // Update references to use filteredProductsList instead of filteredProducts
    useEffect(() => {
        setFilteredProducts(filteredProductsList);
    }, [filteredProductsList]);

    // Thêm hàm sortProducts
    const sortProducts = useCallback((products, option) => {
        const sortedProducts = [...products];
        switch (option) {
            case "newest":
                return sortedProducts.sort((a, b) => b.id - a.id); // Giả sử id cao hơn là sản phẩm mới hơn
            case "oldest":
                return sortedProducts.sort((a, b) => a.id - b.id);
            case "az":
                return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            case "za":
                return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            case "price_low_high":
                return sortedProducts.sort((a, b) => {
                    // const priceA = a.sale > 0 ? a.price * (1 - a.sale / 100) : a.price;
                    // const priceB = b.sale > 0 ? b.price * (1 - b.sale / 100) : b.price;
                    const priceA = a.price;
                    const priceB = b.price;
                    return priceA - priceB;
                });
            case "price_high_low":
                return sortedProducts.sort((a, b) => {
                    // const priceA = a.sale > 0 ? a.price * (1 - a.sale / 100) : a.price;
                    // const priceB = b.sale > 0 ? b.price * (1 - b.sale / 100) : b.price;
                    const priceA = a.price;
                    const priceB = b.price;
                    return priceB - priceA;
                });
            default:
                return sortedProducts;
        }
    }, []);

    // Thêm hàm handleSortChange
    const handleSortChange = useCallback((e) => {
        setSortOption(e.target.value);
    }, []);

    // Thêm sortedProducts memo để xử lý sorting mà không ảnh hưởng đến filteredProducts
    const sortedProducts = useMemo(() => {
        return sortProducts(filteredProducts, sortOption);
    }, [filteredProducts, sortOption, sortProducts]);

    // Thay thế getCurrentItems bằng getVisibleItems
    let getVisibleItems = useCallback(() => {
        return sortedProducts.slice(0, visibleItems);
    }, [sortedProducts, visibleItems]);

    // Hàm để thay đổi số cột hiển thị
    const handleColumnChange = useCallback((columns) => {
        setDisplayColumns(columns);
    }, []);

    // Hàm để mở/tắt bộ lọc trên di động
    const handleApplyPriceFilter = useCallback(() => {
        const min = priceInputs.min === "" ? 0 : Number(priceInputs.min);
        const max = priceInputs.max === "" ? Infinity : Number(priceInputs.max);
        setPriceRange({ min, max });
    }, [priceInputs]);

    const toggleMobileFilter = useCallback(() => {
        if (isMobileFilterOpen) {
            handleApplyPriceFilter();
        }
        setIsMobileFilterOpen((prev) => !prev);
        // Reset overflow style cho body
        document.body.style.overflow = !isMobileFilterOpen ? "hidden" : "";
    }, [isMobileFilterOpen, handleApplyPriceFilter]);

    // Tính toán số lượng bộ lọc đang hoạt động
    useEffect(() => {
        const count = selectedAvailability.length;
    }, [selectedAvailability]);

    // Cập nhật handler cho nút Load More với hiệu ứng loading
    const handleLoadMore = useCallback(() => {
        setIsLoading(true);

        // Sử dụng toast.promise để hiển thị trạng thái loading
        toast.promise(
            new Promise((resolve) => {
                setTimeout(() => {
                    setVisibleItems((prev) => prev + 20);
                    setIsLoading(false);
                    resolve();
                }, 2000);
            }),
            {
                loading: "Loading more products...",
                success: "Successfully loaded more products!",
                error: "Error loading products.",
            },
        );
    }, []);

    // Hàm để xử lý thay đổi kích thước cửa sổ
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setDisplayColumns(2);
            } else if (window.innerWidth <= 1024) {
                setDisplayColumns(3);
            } else {
                setDisplayColumns(4);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cập nhật hàm xử lý khi nhập input
    const handlePriceInputChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            const newValue = value === "" ? "" : Math.max(0, parseInt(value));

            setPriceInputs((prev) => ({
                ...prev,
                [name]: newValue,
            }));

            // Đồng bộ với thanh trượt
            if (name === "min") {
                const validMin = Math.min(Math.max(1, newValue), priceRange.max);
                setPriceRange((prev) => ({ ...prev, min: validMin }));
            } else {
                const validMax = Math.max(Math.min(999, newValue), priceRange.min);
                setPriceRange((prev) => ({ ...prev, max: validMax }));
            }
        },
        [priceRange],
    );

    // Thêm hàm xử lý khi blur khỏi input
    const handlePriceInputBlur = useCallback(
        (e) => {
            const { name, value } = e.target;

            // If input is empty, set default value
            if (value === "") {
                if (name === "min") {
                    setPriceInputs((prev) => ({ ...prev, min: 1 }));
                    setPriceRange((prev) => ({ ...prev, min: 1 }));
                } else {
                    setPriceInputs((prev) => ({ ...prev, max: 999 }));
                    setPriceRange((prev) => ({ ...prev, max: 999 }));
                }
                return;
            }

            const newValue = parseInt(value);

            if (name === "min") {
                // Ensure min is not less than 1 and not greater than max
                const validMin = Math.min(Math.max(1, newValue), priceRange.max);
                setPriceInputs((prev) => ({ ...prev, min: validMin }));
                setPriceRange((prev) => ({ ...prev, min: validMin }));
            } else {
                // Ensure max is not less than min and not greater than 999
                const validMax = Math.max(Math.min(999, newValue), priceRange.min);
                setPriceInputs((prev) => ({ ...prev, max: validMax }));
                setPriceRange((prev) => ({ ...prev, max: validMax }));
            }
        },
        [priceRange],
    );

    // Cập nhật hàm xử lý khi kéo thanh trượt
    const handlePriceRangeChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            const newValue = parseInt(value);

            // Cập nhật cả priceRange và priceInputs
            if (name === "min") {
                const validMin = Math.min(newValue, priceRange.max);
                setPriceRange((prev) => ({ ...prev, min: validMin }));
                setPriceInputs((prev) => ({ ...prev, min: validMin }));
            } else {
                const validMax = Math.max(newValue, priceRange.min);
                setPriceRange((prev) => ({ ...prev, max: validMax }));
                setPriceInputs((prev) => ({ ...prev, max: validMax }));
            }
        },
        [priceRange],
    );

    // Khởi tạo giá trị cho tempMobileFilters khi mở mobile filter
    useEffect(() => {
        if (isMobileFilterOpen) {
            setTempMobileFilters({
                categories: [...selectedCategories],
                sizes: [...selectedSizes],
                educationLevels: [...selectedEducationLevels],
                sale: [...selectedSale],
                priceRange: { ...priceRange },
                searchTerm: searchTerm,
                genders: [...selectedGenders],
            });
        }
    }, [
        isMobileFilterOpen,
        selectedCategories,
        selectedSizes,
        selectedEducationLevels,
        selectedSale,
        priceRange,
        searchTerm,
        selectedGenders,
    ]);

    // Handlers cho mobile filter
    const handleMobileCategoryChange = useCallback((categoryName) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(categoryName)
                ? prev.categories.filter((c) => c !== categoryName)
                : [...prev.categories, categoryName],
        }));
    }, []);

    const handleMobileSizeChange = useCallback((size) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
        }));
    }, []);

    const handleMobileEducationChange = useCallback((level) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            educationLevels: prev.educationLevels.includes(level)
                ? prev.educationLevels.filter((l) => l !== level)
                : [...prev.educationLevels, level],
        }));
    }, []);

    const handleMobileSaleChange = useCallback((saleStatus) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            sale: prev.sale.includes(saleStatus)
                ? prev.sale.filter((s) => s !== saleStatus)
                : [...prev.sale, saleStatus],
        }));
    }, []);

    const handleMobilePriceChange = useCallback((min, max) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            priceRange: { min, max },
        }));
    }, []);

    // Thêm handler cho mobile search
    const handleMobileSearchChange = useCallback((value) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            searchTerm: value,
        }));
    }, []);

    // Thêm handler cho mobile gender
    const handleMobileGenderChange = useCallback((gender) => {
        setTempMobileFilters((prev) => ({
            ...prev,
            genders: prev.genders.includes(gender)
                ? prev.genders.filter((g) => g !== gender)
                : [...prev.genders, gender],
        }));
    }, []);

    // Cập nhật handler khi nhấn Apply
    const handleApplyMobileFilters = useCallback(() => {
        if (slug !== "all-product" && tempMobileFilters.categories.length > 0) {
            navigate("/category/all-product");
        }

        setSelectedCategories(tempMobileFilters.categories);
        setSelectedSizes(tempMobileFilters.sizes);
        setSelectedEducationLevels(tempMobileFilters.educationLevels);
        setSelectedSale(tempMobileFilters.sale);
        setPriceRange(tempMobileFilters.priceRange);
        setSearchTerm(tempMobileFilters.searchTerm);
        setSelectedGenders(tempMobileFilters.genders);

        setIsMobileFilterOpen(false);
        // Reset overflow style cho body khi đóng filter
        document.body.style.overflow = "";
    }, [tempMobileFilters, slug, navigate]);

    const productRelated = useMemo(() => {
        return productData.reverse().slice(0, 8);
    }, []);

    return (
        <>
            <section className="category">
                <div className="container">
                    <div className="category__header">
                        <div className="category__filter-icon">
                            <span className="category__product-col" onClick={() => handleColumnChange(2)}>
                                <svg
                                    className={displayColumns === 2 ? "category__product--opcity" : undefined}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect x="3" y="4" width="2" height="15" fill="black" />
                                    <rect x="7" y="4" width="2" height="15" fill="black" />
                                </svg>
                            </span>
                            <span className="category__product-col" onClick={() => handleColumnChange(3)}>
                                <svg
                                    className={displayColumns === 3 ? "category__product--opcity" : undefined}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect x="2" y="4" width="2" height="15" fill="black" />
                                    <rect x="6" y="4" width="2" height="15" fill="black" />
                                    <rect x="10" y="4" width="2" height="15" fill="black" />
                                </svg>
                            </span>
                            <span className="category__product-col" onClick={() => handleColumnChange(4)}>
                                <svg
                                    className={displayColumns === 4 ? "category__product--opcity" : undefined}
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect x="2" y="4" width="2" height="15" fill="black" />
                                    <rect x="6" y="4" width="2" height="15" fill="black" />
                                    <rect x="10" y="4" width="2" height="15" fill="black" />
                                    <rect x="14" y="4" width="2" height="15" fill="black" />
                                </svg>
                            </span>
                        </div>
                        <div className="category__sort dfbetween">
                            <label className="sort__name">Sort by:</label>
                            <select name="sort__by" className="sort__by" onChange={handleSortChange} value={sortOption}>
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="az">Alphabetically, A-Z</option>
                                <option value="za">Alphabetically, Z-A</option>
                                <option value="price_low_high">Price, low to high</option>
                                <option value="price_high_low">Price, high to low</option>
                            </select>
                            <span className="sort__count-product">{filteredProducts.length} products</span>
                        </div>
                    </div>

                    <button className="mobile-filter-toggle" onClick={toggleMobileFilter}>
                        <span>
                            <FilterIcon size={16} />
                            Filter and sort
                        </span>
                    </button>

                    <div className={`mobile-filter-drawer ${isMobileFilterOpen ? "active" : ""}`}>
                        <div className="mobile-filter-header">
                            <h2 className="mobile-filter-title">Filter and sort</h2>
                            <button className="mobile-filter-close" onClick={toggleMobileFilter}>
                                <CloseIcon size={24} />
                            </button>
                        </div>
                        <div className="mobile-filter-content">
                            {/* Search - Updated with tempMobileFilters */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Search Products</h3>
                                </div>
                                <div className="filter__content">
                                    <div className="filter__search">
                                        <input
                                            type="text"
                                            className="price-range__input-field"
                                            placeholder="Search products..."
                                            value={tempMobileFilters.searchTerm}
                                            onChange={(e) => handleMobileSearchChange(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Categories</h3>
                                </div>
                                <div className="filter__content">
                                    {categoriesData.map((category) => (
                                        <label key={category.id} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={tempMobileFilters.categories.includes(category.name)}
                                                onChange={() => handleMobileCategoryChange(category.name)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {category.name}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Sizes</h3>
                                </div>
                                <div className="filter__content">
                                    {sizeOptions.map((size) => (
                                        <label key={size} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={tempMobileFilters.sizes.includes(size)}
                                                onChange={() => handleMobileSizeChange(size)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {size}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Education Levels */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Education Levels</h3>
                                </div>
                                <div className="filter__content">
                                    {educationOptions.map((level) => (
                                        <label key={level} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={tempMobileFilters.educationLevels.includes(level)}
                                                onChange={() => handleMobileEducationChange(level)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {level}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Price Range</h3>
                                </div>
                                <div className="price-range">
                                    <div className="price-range__inputs">
                                        <div className="price-range__input-group">
                                            <span className="price-range__currency">$</span>
                                            <input
                                                type="number"
                                                name="min"
                                                className="price-range__input-field"
                                                value={tempMobileFilters.priceRange.min}
                                                onChange={(e) =>
                                                    handleMobilePriceChange(
                                                        e.target.value,
                                                        tempMobileFilters.priceRange.max,
                                                    )
                                                }
                                                onBlur={handlePriceInputBlur}
                                                min="1"
                                                max="999"
                                            />
                                        </div>
                                        <span className="price-range__separator">to</span>
                                        <div className="price-range__input-group">
                                            <span className="price-range__currency">$</span>
                                            <input
                                                type="number"
                                                name="max"
                                                className="price-range__input-field"
                                                value={tempMobileFilters.priceRange.max}
                                                onChange={(e) =>
                                                    handleMobilePriceChange(
                                                        tempMobileFilters.priceRange.min,
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={handlePriceInputBlur}
                                                min="1"
                                                max="999"
                                            />
                                        </div>
                                    </div>
                                    <div className="price-range__slider">
                                        <div className="price-range__track"></div>
                                        <div
                                            className="price-range__progress"
                                            style={{
                                                left: `${((tempMobileFilters.priceRange.min - 1) / (999 - 1)) * 100}%`,
                                                right: `${
                                                    100 - ((tempMobileFilters.priceRange.max - 1) / (999 - 1)) * 100
                                                }%`,
                                            }}
                                        ></div>
                                        <input
                                            type="range"
                                            name="min"
                                            min="1"
                                            max="999"
                                            value={tempMobileFilters.priceRange.min}
                                            onChange={(e) =>
                                                handleMobilePriceChange(
                                                    e.target.value,
                                                    tempMobileFilters.priceRange.max,
                                                )
                                            }
                                            className="price-range__input price-range__input--left"
                                        />
                                        <input
                                            type="range"
                                            name="max"
                                            min="1"
                                            max="999"
                                            value={tempMobileFilters.priceRange.max}
                                            onChange={(e) =>
                                                handleMobilePriceChange(
                                                    tempMobileFilters.priceRange.min,
                                                    e.target.value,
                                                )
                                            }
                                            className="price-range__input price-range__input--right"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sale Status */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Sale Status</h3>
                                </div>
                                <div className="filter__content">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={tempMobileFilters.sale.includes("On Sale")}
                                            onChange={() => handleMobileSaleChange("On Sale")}
                                        />
                                        <span className="checkbox-custom"></span>
                                        On Sale
                                    </label>
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={tempMobileFilters.sale.includes("Regular Price")}
                                            onChange={() => handleMobileSaleChange("Regular Price")}
                                        />
                                        <span className="checkbox-custom"></span>
                                        Regular Price
                                    </label>
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="filter__category">
                                <div className="filter__category-top">
                                    <h3>Gender</h3>
                                </div>
                                <div className="filter__content">
                                    {genderOptions.map((gender) => (
                                        <label key={gender} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={tempMobileFilters.genders.includes(gender)}
                                                onChange={() => handleMobileGenderChange(gender)}
                                            />
                                            <span className="checkbox-custom"></span>
                                            {gender}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mobile-filter-footer">
                            <button className="mobile-filter-apply" onClick={handleApplyMobileFilters}>
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="category__body">
                        {/* Menu Filter PC */}
                        <aside className="category__filter">
                            {/* Search Filter - Quan trọng nhất vì người dùng thường tìm kiếm trực tiếp */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("search")}>
                                    <h3>Search Products</h3>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/icon/chevron-top.svg`}
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.search,
                                        })}
                                    />
                                </div>
                                {openCategories.search && (
                                    <div className="filter__content">
                                        <div className="filter__search">
                                            <input
                                                type="text"
                                                className="price-range__input-field"
                                                placeholder="Search products..."
                                                value={searchTerm}
                                                maxLength={255}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Categories Filter - Quan trọng thứ hai vì phân loại chính của sản phẩm */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("category")}>
                                    <h3>Categories</h3>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/icon/chevron-top.svg`}
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.category,
                                        })}
                                    />
                                </div>
                                {openCategories.category && (
                                    <div className="filter__content">
                                        {/* Categories checkboxes */}
                                        {categoriesData.map((category) => (
                                            <label
                                                key={category.id}
                                                className={clsx("checkbox-label", {
                                                    active: selectedCategories.includes(category.name),
                                                })}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.name)}
                                                    onChange={() => handleCategoryChange(category.name)}
                                                />
                                                <span className="checkbox-custom"></span>
                                                {category.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Price Range - Yếu tố quan trọng trong quyết định mua hàng */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("price")}>
                                    <h3>Price Range</h3>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/icon/chevron-top.svg`}
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.price,
                                        })}
                                    />
                                </div>
                                {openCategories.price && (
                                    <div className="price-range">
                                        <div className="price-range__inputs">
                                            <div className="price-range__input-group">
                                                <span className="price-range__currency">$</span>
                                                <input
                                                    type="number"
                                                    name="min"
                                                    className="price-range__input-field"
                                                    value={priceInputs.min}
                                                    onChange={handlePriceInputChange}
                                                    onBlur={handlePriceInputBlur}
                                                    min="1"
                                                    max="999"
                                                />
                                            </div>
                                            <span className="price-range__separator">to</span>
                                            <div className="price-range__input-group">
                                                <span className="price-range__currency">$</span>
                                                <input
                                                    type="number"
                                                    name="max"
                                                    className="price-range__input-field"
                                                    value={priceInputs.max}
                                                    onChange={handlePriceInputChange}
                                                    onBlur={handlePriceInputBlur}
                                                    min="1"
                                                    max="999"
                                                />
                                            </div>
                                        </div>
                                        <div className="price-range__slider">
                                            <div className="price-range__track"></div>
                                            <div
                                                className="price-range__progress"
                                                style={{
                                                    left: `${((priceRange.min - 1) / (999 - 1)) * 100}%`,
                                                    right: `${100 - ((priceRange.max - 1) / (999 - 1)) * 100}%`,
                                                }}
                                            ></div>
                                            <input
                                                type="range"
                                                name="min"
                                                min="1"
                                                max="999"
                                                value={priceRange.min}
                                                onChange={handlePriceRangeChange}
                                                className="price-range__input price-range__input--left"
                                            />
                                            <input
                                                type="range"
                                                name="max"
                                                min="1"
                                                max="999"
                                                value={priceRange.max}
                                                onChange={handlePriceRangeChange}
                                                className="price-range__input price-range__input--right"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Education Level - Quan trọng vì liên quan đến mục đích sử dụng */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("education")}>
                                    <h3>Education Level</h3>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/icon/chevron-top.svg`}
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.education,
                                        })}
                                    />
                                </div>
                                {openCategories.education && (
                                    <div className="filter__content">
                                        {educationOptions.map((level) => (
                                            <label key={level} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEducationLevels.includes(level)}
                                                    onChange={() => handleEducationChange(level)}
                                                />
                                                <span className="checkbox-custom"></span>
                                                {level}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Gender - Quan trọng vì ảnh hưởng trực tiếp đến việc lựa chọn */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("gender")}>
                                    <h3>Gender</h3>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/icon/chevron-top.svg`}
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.gender,
                                        })}
                                    />
                                </div>
                                {openCategories.gender && (
                                    <div className="filter__content">
                                        {genderOptions.map((gender) => (
                                            <label key={gender} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedGenders.includes(gender)}
                                                    onChange={() => handleGenderChange(gender)}
                                                />
                                                <span className="checkbox-custom"></span>
                                                {gender}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sizes - Thông tin kỹ thuật của sản phẩm */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("sizes")}>
                                    <h3>Sizes</h3>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/assets/icon/chevron-top.svg`}
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.sizes,
                                        })}
                                    />
                                </div>
                                {openCategories.sizes && (
                                    <div className="filter__content">
                                        {sizeOptions.map((size) => (
                                            <label key={size} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSizes.includes(size)}
                                                    onChange={() => handleSizeChange(size)}
                                                />
                                                <span className="checkbox-custom"></span>
                                                {size}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Sale Status - Đặt cuối cùng vì là thông tin bổ sung */}
                            <div className="filter__group">
                                <div className="filter__header" onClick={() => toggleCategory("sale")}>
                                    <h3>Sale Status</h3>
                                    <img
                                        src="/assets/icon/chevron-top.svg"
                                        alt=""
                                        className={clsx("filter__icon", {
                                            "filter__icon--active": openCategories.sale,
                                        })}
                                    />
                                </div>
                                {openCategories.sale && (
                                    <div className="filter__content">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedSale.includes("On Sale")}
                                                onChange={() => handleSelectSale("On Sale")}
                                            />
                                            <span className="checkbox-custom"></span>
                                            On Sale
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedSale.includes("Regular Price")}
                                                onChange={() => handleSelectSale("Regular Price")}
                                            />
                                            <span className="checkbox-custom"></span>
                                            Regular Price
                                        </label>
                                    </div>
                                )}
                            </div>
                        </aside>
                        {!isChecking &&
                            (() => {
                                const productFilter = getVisibleItems();
                                return (
                                    <div className="category__product">
                                        {filteredProducts.length === 0 && <NotData />}

                                        {productFilter.length === 0 && (
                                            <h1 className="category__suggested-title">Suggested Products</h1>
                                        )}
                                        <div
                                            className={`category__product-grid columns-${displayColumns} responsive-grid`}
                                        >
                                            <AnimatePresence>
                                                {(productFilter.length === 0 ? productRelated : productFilter).map(
                                                    (item) => {
                                                        // Nếu có sale thì minPrice là giá đã giảm, cần tính ngược lại giá gốc

                                                        return (
                                                            <motion.article
                                                                key={item.slug}
                                                                className="category__product-item"
                                                                layout
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                            >
                                                                <Link to={`/product/${item.slug}`}>
                                                                    <figure className="category-product__wrapper">
                                                                        {item.quantity > 0 ? (
                                                                            item.sale > 0 && (
                                                                                <span className="badge__sale">
                                                                                    {item.sale}% OFF
                                                                                </span>
                                                                            )
                                                                        ) : (
                                                                            <span className="badge__sale">
                                                                                Sold Out
                                                                            </span>
                                                                        )}
                                                                        <img
                                                                            src={item.thumbnail || "/placeholder.svg"}
                                                                            alt=""
                                                                            className={clsx(
                                                                                "category__product-image",
                                                                                item.quantity === 0 &&
                                                                                    "category__product-image--opacity",
                                                                            )}
                                                                        />
                                                                        <div className="product-card__actions">
                                                                            <button
                                                                                className="action-btn"
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    handleWishlistAction(item);
                                                                                }}
                                                                                disabled={
                                                                                    wishlistLoadingStates[item.id]
                                                                                }
                                                                            >
                                                                                {wishlistLoadingStates[item.id] ? (
                                                                                    <img
                                                                                        src="/assets/icon/loading.gif"
                                                                                        alt="Loading..."
                                                                                        className="loading-spinner"
                                                                                        width={18}
                                                                                        height={18}
                                                                                    />
                                                                                ) : isProductInWishlist(item.id) ? (
                                                                                    <HeartOff size={20} />
                                                                                ) : (
                                                                                    <Heart size={20} />
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </figure>
                                                                    <div className="category__product-details">
                                                                        <h3 className="category__product-name">
                                                                            {item.name}
                                                                        </h3>
                                                                        <span className="category__product-price dfcenter">
                                                                            ${item.price}
                                                                            {item.sale > 0 && (
                                                                                <span className="category__product-price--old">
                                                                                    $
                                                                                    {calculateOriginalPrice(
                                                                                        item.price,
                                                                                        item.sale,
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </Link>
                                                            </motion.article>
                                                        );
                                                    },
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Thay thế ReactPaginate bằng nút Load More */}
                                        {filteredProducts.length > visibleItems && (
                                            <div className="dfcenter category__load-more">
                                                <button
                                                    className={`btn ${isLoading ? "loading" : ""}`}
                                                    onClick={handleLoadMore}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <img
                                                            src="/assets/icon/loading.gif"
                                                            alt="Loading..."
                                                            className="loading-spinner"
                                                        />
                                                    ) : (
                                                        "Show More Products"
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                    </div>
                </div>
            </section>
        </>
    );
}
