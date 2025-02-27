import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Rating } from "@mui/material";
import { Heart, HeartOff } from "lucide-react";
import { calculateOriginalPrice } from "~/utils/helpers";
import { useWishlistActions } from "~/utils/handleWishlist";

const RelatedProducts = memo(({ relatedProducts }) => {
    const { handleWishlistAction, isProductInWishlist, loadingStates: wishlistLoadingStates } = useWishlistActions();
    return (
        <section className="related-products">
            <h2>Related Products</h2>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
            >
                {relatedProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                        <motion.article className="product-card product-card--boder">
                            <figure className="category-product__wrapper">
                                {product.sale > 0 && <span className="badge__sale">{`${product.sale}% OFF`}</span>}
                                <div className="image-wrapper">
                                    <Link to={`/product/${product.slug}`}>
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}${product.thumbnail}`}
                                            alt={product.name}
                                            className="category__product-image"
                                        />
                                    </Link>
                                    <div className="product-card__actions">
                                        <button className="action-btn" onClick={() => handleWishlistAction(product)}>
                                            {wishlistLoadingStates[product.id] ? (
                                                <img
                                                    src="/assets/icon/loading.gif"
                                                    alt="Loading..."
                                                    className="loading-spinner"
                                                />
                                            ) : isProductInWishlist(product.id) ? (
                                                <HeartOff size={20} />
                                            ) : (
                                                <Heart size={20} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </figure>
                            <div className="category__product-details">
                                <div className="product-card__rating-wrap">
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
                                    <span className="best-sales-item__rating-value">({product.rating.toFixed(1)})</span>
                                </div>
                                <h3>
                                    <Link
                                        to={`/product/${product.slug}`}
                                        className="category__product-name line-clamp"
                                        style={{ "--line-clamp": 3 }}
                                    >
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="category__product-price">
                                    ${product.price}
                                    {product.sale > 0 && (
                                        <span className="category__product-price--old">
                                            ${calculateOriginalPrice(product.price, product.sale)}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </motion.article>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
});

export default RelatedProducts;
