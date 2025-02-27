import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import { handleCheckQuantity, useCartActions } from "~/utils/handleCart";
import { useWishlistActions } from "~/utils/handleWishlist";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import "~/styles/product.css";
import useTitle from "~/hooks/useTitle";
import productsData from "~/data/products.json";
import categories from "~/data/categories.json";
import { calculateOriginalPrice, handleAddRecentProduct } from "~/utils/helpers";
import SuggestedProducts from "./SuggestedProducts";
import RelatedProducts from "./RelatedProducts";
import Reviews from "./Reviews";
import toast from "react-hot-toast";
import clsx from "clsx";
import Tooltip from "~/components/Tooltip";
import { Rating } from "@mui/material";
import PinterestIcon from "@mui/icons-material/Pinterest";
import sizeGuides from "~/data/sizeGuides.json";
import {
    Heart,
    Share2,
    ChevronRight,
    Truck,
    Shield,
    RefreshCw,
    Ruler,
    Facebook,
    Twitter,
    MoreHorizontal,
    ShoppingCart,
    ExternalLink,
    HeartOff,
    X,
    Star,
    ShoppingBag,
} from "lucide-react";

import { Helmet } from "react-helmet-async";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Product() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
    const [showImageModal, setShowImageModal] = useState(false);

    const { handleCartAction, isProductInCart } = useCartActions();
    const { handleWishlistAction } = useCallback(useWishlistActions(), []);
    const { isProductInWishlist } = useWishlistActions();

    useEffect(() => {
        const foundProduct = productsData.find((p) => p.slug === slug);
        if (!foundProduct) {
            navigate("/404");
            return;
        }
        setProduct(foundProduct);
        setSelectedSize(foundProduct.sizes[0]);
        setSelectedColor(foundProduct.colors[0]);
        setQuantity(1);

        setSelectedImage(0);
        setIsZoomed(false);
        setShowSizeGuide(false);
        setShowShareMenu(false);
        setIsLoading(false);
        setActiveTab("details");
        setShowImageModal(false);

        const related = productsData
            .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 8);
        setRelatedProducts(related);
    }, [slug, navigate]);

    useTitle(product?.name || "Product");

    useEffect(() => {
        if (product) {
            handleAddRecentProduct(product.id);
        }
    }, [product]);

    if (!product) return null;
    const originalPrice = product.price;
    const salePrice = product.sale > 0 ? product.price * (1 - product.sale / 100) : null;

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        if (!selectedColor) {
            toast.error("Please select a color");
            return;
        }
        if (Number.isNaN(quantity)) {
            toast.error("Please enter a valid quantity");
            return;
        }
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 500));
        await handleCartAction({ ...product, size: selectedSize, color: selectedColor, quantity, selected: false });
        setIsLoading(false);
    };

    const handleBuyNow = async () => {
        if (product.quantity <= 0) {
            toast.error("Product is out of stock");
            return;
        }
        if (!selectedSize || !selectedColor) {
            toast.error("Please select size and color");
            return;
        }
        await handleCartAction(
            { ...product, size: selectedSize, color: selectedColor, quantity, selected: true },
            false,
            true,
        );
        navigate("/cart");
    };

    const handleSocialShare = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Check out this ${product.name}!`);

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}&media=${encodeURIComponent(
                product.images[0],
            )}`,
        };

        window.open(shareUrls[platform], "_blank", "width=600,height=400");
    };

    const handleShare = () => {
        navigator
            .share({
                title: product.name,
                text: `Check out this ${product.name}!`,
                url: window.location.href,
            })
            .catch(() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "details":
                return (
                    <div className="product__tab-content">
                        <div className="product__specifications">
                            <h4>Product Information</h4>
                            <div className="product__spec-grid">
                                <div className="product__spec-item">
                                    <span>Category</span>
                                    <strong>{product.category}</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Gender</span>
                                    <strong>{product.gender}</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Education Level</span>
                                    <strong>{product.education_levels}</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Available Colors</span>
                                    <strong>{product.colors.join(", ")}</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Available Sizes</span>
                                    <strong>{product.sizes.join(", ")}</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Stock Status</span>
                                    <strong>{product.quantity > 0 ? "In Stock" : "Out of Stock"}</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Material</span>
                                    <strong>Premium Quality Fabric</strong>
                                </div>
                                <div className="product__spec-item">
                                    <span>Care Instructions</span>
                                    <strong>Machine Washable</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "description":
                return (
                    <div className="product__tab-content">
                        <div className="product__description">
                            <h4>Product Description</h4>
                            <p>
                                Our {product.name} is designed with both style and comfort in mind. Perfect for{" "}
                                {product.education_levels} students, this {product.category.toLowerCase()} features
                                premium quality materials and expert craftsmanship.
                            </p>
                            <div className="product__key-features">
                                <h5>Key Features:</h5>
                                <ul>
                                    <li>Premium quality {product.category.toLowerCase()}</li>
                                    <li>Perfect for {product.education_levels} students</li>
                                    <li>Available in multiple colors: {product.colors.join(", ")}</li>
                                    <li>Comfortable fit for all-day wear</li>
                                    <li>Easy care and maintenance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case "reviews":
                return <Reviews product={product} />;
            default:
                return null;
        }
    };

    const slugCategory = categories.find((c) => c.name === product.category)?.slug;

    // Thêm hàm để lấy size guide dựa trên category
    const getSizeGuideForProduct = () => {
        if (!product || !product.category) return null;

        // Chuyển đổi category thành slug để match với sizeGuides
        const categorySlug = product.category.toLowerCase().replace(/ |\.|-/g, "");
        console.log(categorySlug);

        return sizeGuides[categorySlug];
    };

    // Thêm handler cho việc click vào hình ảnh
    const handleImageClick = () => {
        setShowImageModal(true);
    };

    // Thêm hàm để tạo meta description
    const getMetaDescription = () => {
        if (!product) return "";
        return `Buy ${product.name} - ${product.category} for ${
            product.education_levels
        } students. Available in ${product.colors.join(", ")}. Starting from $${product.price}.`;
    };

    return (
        <>
            <Helmet>
                {/* Basic tags */}
                <title>{`${product.name} - School Uniform Store`}</title>
                <meta name="description" content={getMetaDescription()} />

                {/* Open Graph tags */}
                <meta property="og:title" content={product.name} />
                <meta property="og:description" content={getMetaDescription()} />
                <meta property="og:image" content={product.images[0]} />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="product" />
                <meta property="product:price:amount" content={product.price} />
                <meta property="product:price:currency" content="USD" />

                {/* Twitter Card tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={product.name} />
                <meta name="twitter:description" content={getMetaDescription()} />
                <meta name="twitter:image" content={product.images[0]} />

                {/* Additional SEO meta tags */}
                <meta
                    name="keywords"
                    content={`${product.name}, ${product.category}, school uniform, ${
                        product.education_levels
                    }, ${product.colors.join(", ")}`}
                />
                <link rel="canonical" href={window.location.href} />

                {/* Schema.org markup for Google */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        name: product.name,
                        image: product.images,
                        description: getMetaDescription(),
                        sku: product.id,
                        brand: {
                            "@type": "Brand",
                            name: "School Uniform Store",
                        },
                        offers: {
                            "@type": "Offer",
                            url: window.location.href,
                            priceCurrency: "USD",
                            price: product.sale > 0 ? product.price * (1 - product.sale / 100) : product.price,
                            priceValidUntil: new Date(
                                new Date().setFullYear(new Date().getFullYear() + 1),
                            ).toISOString(),
                            itemCondition: "https://schema.org/NewCondition",
                            availability:
                                product.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        },
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: product.rating,
                            reviewCount: product.soldQuantity,
                        },
                    })}
                </script>
            </Helmet>

            <motion.section
                className="product"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="product__breadcrumb">
                        <Link to="/">Home</Link>
                        <ChevronRight size={16} />
                        <Link to="/categories">Categories</Link>
                        <ChevronRight size={16} />
                        <Link
                            className="breadcrumb__item line-clamp"
                            style={{ "--line-clamp": 1 }}
                            to={`/category/${slugCategory}`}
                        >
                            {product.category}
                        </Link>
                        <ChevronRight size={16} />
                        <span className="line-clamp" style={{ "--line-clamp": 1 }}>
                            {product.name}
                        </span>
                    </nav>

                    <div className="product__grid">
                        {/* Images Section */}
                        <div className="product__images">
                            <motion.div
                                className={clsx("product__image-main", isZoomed && "zoomed")}
                                onHoverStart={() => setIsZoomed(true)}
                                onHoverEnd={() => setIsZoomed(false)}
                            >
                                {product.sale > 0 && <span className="product__sale-badge">{product.sale}% OFF</span>}
                                <Carousel
                                    showArrows={true}
                                    showThumbs={true}
                                    infiniteLoop={true}
                                    emulateTouch={true}
                                    autoFocus={true}
                                    showStatus={false}
                                    selectedItem={selectedImage}
                                    onChange={(index) => setSelectedImage(index)}
                                    swipeable={true}
                                    preventMovementUntilSwipeScrollTolerance={true}
                                    swipeScrollTolerance={50}
                                    axis="horizontal"
                                    useKeyboardArrows={true}
                                    stopOnHover={true}
                                >
                                    {product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="product__image-thumbnail-img"
                                            onClick={handleImageClick}
                                        >
                                            <img
                                                src={`${process.env.REACT_APP_BASE_URL}${image}`}
                                                alt={`${product.name} view ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            </motion.div>
                            <div className="product__image-gallery">
                                {product.images.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        className={clsx(
                                            "product__image-thumbnail",
                                            selectedImage === index && "active",
                                        )}
                                        onClick={() => setSelectedImage(index)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}${image}`}
                                            alt={`${product.name} view ${index + 1}`}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="product__info">
                            <div className="product__header">
                                <h1 className="product__title">{product.name}</h1>
                                <div className="product__meta">
                                    <Link to={`/category/${slugCategory}`} className="product__category">
                                        {product.category}
                                    </Link>
                                    <div className="best-sales-item__rating-wrap">
                                        <Rating
                                            name="read-only"
                                            value={product.rating}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                            sx={{
                                                fontSize: "1.8rem",
                                                color: "#ffd700",
                                            }}
                                        />
                                        <span className="best-sales-item__rating-value">
                                            ({product.rating.toFixed(1)})
                                        </span>
                                    </div>
                                    <span className="product__sold-quantity">
                                        <ShoppingBag size={16} />
                                        {product.soldQuantity.toLocaleString()} sold
                                    </span>
                                </div>
                            </div>

                            <div className="product__price">
                                {salePrice ? (
                                    <>
                                        <span className="product__price-sale">${originalPrice}</span>
                                        <span className="product__price-original">
                                            ${calculateOriginalPrice(originalPrice, product.sale)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="product__price-regular">${originalPrice}</span>
                                )}
                            </div>

                            {/* Size Selection */}
                            <div className="product__sizes">
                                <div className="product__option-header">
                                    <h3>Select Size</h3>
                                    <button
                                        className="product__size-guide"
                                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                                    >
                                        <Ruler size={18} />
                                        Size Guide
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showSizeGuide && (
                                        <motion.div
                                            className="product__size-guide-content"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: window.innerWidth <= 749 ? 550 : 500, opacity: 1 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            {getSizeGuideForProduct() ? (
                                                <div className="size-guide__table-container">
                                                    <h4>{getSizeGuideForProduct().title}</h4>
                                                    <p>{getSizeGuideForProduct().description}</p>

                                                    <table className="size-guide__table">
                                                        <thead>
                                                            <tr>
                                                                <th>Size</th>
                                                                {Object.keys(getSizeGuideForProduct().sizes[0])
                                                                    .filter((key) => key !== "size")
                                                                    .map((key) => (
                                                                        <th key={key}>
                                                                            {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                                                                            (cm)
                                                                        </th>
                                                                    ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {getSizeGuideForProduct().sizes.map((size, index) => (
                                                                <tr key={index}>
                                                                    <td>{size.size}</td>
                                                                    {Object.entries(size)
                                                                        .filter(([key]) => key !== "size")
                                                                        .map(([key, value]) => (
                                                                            <td key={key}>{value}</td>
                                                                        ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                    <div className="size-guide__tips">
                                                        <h5>Measurement Tips</h5>
                                                        <ul>
                                                            {getSizeGuideForProduct().measurementTips.map(
                                                                (tip, index) => (
                                                                    <li key={index}>{tip}</li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>Size guide not available for this product category.</p>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="product__size-options">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            className={clsx("product__size-option", selectedSize === size && "active")}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div className="product__colors">
                                <h3>Select Color</h3>
                                <div className="product__color-options">
                                    {product.colors.map((color, index) => {
                                        return (
                                            <Tooltip content={color} key={color}>
                                                <button
                                                    className={clsx(
                                                        "product__color-option",
                                                        selectedColor === color && "active",
                                                    )}
                                                    onClick={() => {
                                                        setSelectedColor(color);
                                                        setSelectedImage(product.detailImageColors[index]);
                                                    }}
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                ></button>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="product__stock-status">
                                <span
                                    className={clsx(
                                        "product__stock-badge",
                                        product.quantity > 0 ? "in-stock" : "out-of-stock",
                                    )}
                                >
                                    {product.quantity > 0
                                        ? `${product.quantity} products available in stock`
                                        : "Out of stock"}
                                </span>
                                {product.quantity > 0 && (
                                    <p className="product__stock-status-text">
                                        If you're a business owner, school representative, or need to place a bulk
                                        order, feel free to{" "}
                                        <a href="/pages/contact" target="_blank">
                                            contact us for a consultation
                                        </a>
                                        . Let's make something great together!
                                    </p>
                                )}
                            </div>

                            {/* Quantity */}
                            <div className="product__quantity">
                                <h3>Quantity</h3>
                                <div className="product__quantity-wrap">
                                    <div className="product__quantity-input">
                                        <button
                                            className={clsx("product__quantity-button", quantity <= 1 && "disabled")}
                                            onClick={() => {
                                                if (handleCheckQuantity(product.quantity, quantity - 1)) {
                                                    setQuantity((q) => q - 1);
                                                }
                                            }}
                                        >
                                            -
                                        </button>

                                        <input
                                            type="number"
                                            className="product__quantity-number"
                                            value={quantity}
                                            onChange={(e) => {
                                                if (handleCheckQuantity(product.quantity, e.target.value)) {
                                                    setQuantity(parseInt(e.target.value));
                                                }
                                            }}
                                            min="1"
                                            max={product.quantity}
                                        />
                                        <button
                                            className={clsx("product__quantity-button")}
                                            onClick={() => {
                                                if (handleCheckQuantity(product.quantity, quantity + 1)) {
                                                    setQuantity((q) => q + 1);
                                                }
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <motion.button
                                        className={clsx(
                                            "btn btn--primary product__add-to-cart",
                                            product.quantity <= 0 && "disabled",
                                        )}
                                        onClick={handleAddToCart}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <img
                                                src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                alt="Loading..."
                                                className="loading-spinner"
                                            />
                                        ) : (
                                            <>
                                                <ShoppingCart size={20} />
                                                Add to Cart
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="product__buttons">
                                <motion.button
                                    className={clsx(
                                        "btn btn--secondary product__buy-now",
                                        product.quantity <= 0 && "disabled",
                                    )}
                                    onClick={handleBuyNow}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ExternalLink size={20} />
                                    Buy Now
                                </motion.button>

                                <Tooltip
                                    content={
                                        isProductInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"
                                    }
                                >
                                    <motion.button
                                        className={clsx(
                                            "btn btn--secondary product__add-to-wishlist",
                                            isProductInWishlist(product.id) && "active",
                                        )}
                                        onClick={() => handleWishlistAction(product)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isProductInWishlist(product.id) ? (
                                            <HeartOff size={20} style={{ color: "currentColor" }} />
                                        ) : (
                                            <Heart size={20} style={{ color: "currentColor" }} />
                                        )}
                                    </motion.button>
                                </Tooltip>

                                <div className="product__share-container">
                                    <Tooltip content={"Share"}>
                                        <motion.button
                                            className="btn btn--secondary product__share"
                                            onClick={() => setShowShareMenu(!showShareMenu)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Share2 size={20} />
                                        </motion.button>
                                    </Tooltip>

                                    {showShareMenu && (
                                        <div className="product__share-menu">
                                            <button onClick={() => handleSocialShare("facebook")}>
                                                <Facebook size={20} /> Facebook
                                            </button>
                                            <button onClick={() => handleSocialShare("twitter")}>
                                                <Twitter size={20} /> Twitter
                                            </button>
                                            <button onClick={() => handleSocialShare("pinterest")}>
                                                <PinterestIcon sx={{ fontSize: 20 }} /> Pinterest
                                            </button>
                                            <button onClick={handleShare} className="hiddenMobile">
                                                <MoreHorizontal size={20} /> Share More
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="product__features">
                                <div className="product__feature">
                                    <Truck size={24} />
                                    <div>
                                        <h4>Free Shipping</h4>
                                        <p>On orders over $100</p>
                                    </div>
                                </div>
                                <div className="product__feature">
                                    <Shield size={24} />
                                    <div>
                                        <h4>Secure Payment</h4>
                                        <p>100% secure payment</p>
                                    </div>
                                </div>
                                <div className="product__feature">
                                    <RefreshCw size={24} />
                                    <div>
                                        <h4>Easy Returns</h4>
                                        <p>14 day return policy</p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="product__tabs">
                                <div className="product__tab-buttons">
                                    <button
                                        className={clsx("product__tab-button", activeTab === "details" && "active")}
                                        onClick={() => setActiveTab("details")}
                                    >
                                        Specifications
                                    </button>
                                    <button
                                        className={clsx("product__tab-button", activeTab === "description" && "active")}
                                        onClick={() => setActiveTab("description")}
                                    >
                                        Description
                                    </button>
                                    <button
                                        className={clsx("product__tab-button", activeTab === "reviews" && "active")}
                                        onClick={() => setActiveTab("reviews")}
                                    >
                                        Reviews ({product.soldQuantity.toLocaleString()})
                                    </button>
                                </div>
                                <motion.div
                                    className="product__tab-content-wrapper"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderTabContent()}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <RelatedProducts relatedProducts={relatedProducts} handleWishlistAction={handleWishlistAction} />
                    <SuggestedProducts idCategory={product.category} handleWishlistAction={handleWishlistAction} />
                </div>

                <AnimatePresence>
                    {showImageModal && (
                        <motion.div
                            className="product__image-modal"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowImageModal(false)}
                        >
                            <motion.div
                                className="product__image-modal-content"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                            >
                                <button className="product__image-modal-close" onClick={() => setShowImageModal(false)}>
                                    <X className="product__image-modal-close-icon" />
                                </button>
                                <Carousel
                                    showArrows={true}
                                    showThumbs={true}
                                    infiniteLoop={true}
                                    emulateTouch={true}
                                    selectedItem={selectedImage}
                                    onChange={(index) => setSelectedImage(index)}
                                    showStatus={false}
                                    thumbWidth={80}
                                    className="product__image-modal-carousel"
                                >
                                    {product.images.map((image, index) => (
                                        <div key={index} className="product__image-modal-slide">
                                            <img
                                                src={`${process.env.REACT_APP_BASE_URL}${image}`}
                                                alt={`${product.name} view ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.section>
        </>
    );
}
