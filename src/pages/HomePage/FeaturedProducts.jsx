import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Heart, HeartOff } from "lucide-react";
import productData from "~/data/products.json";
import { useWishlistActions } from "~/utils/handleWishlist";
import "~/styles/featuredProducts.css";
import { Rating } from "@mui/material";
import { calculateOriginalPrice } from "~/utils/helpers";
const FeaturedProducts = () => {
    const { handleWishlistAction, isProductInWishlist, loadingStates: wishlistLoadingStates } = useWishlistActions();

    const featuredProducts = productData
        .filter((product) => product.feature)
        .sort((a, b) => {
            if (b.rating !== a.rating) {
                return b.rating - a.rating;
            }
            // Nếu rating bằng nhau, sắp xếp theo id giảm dần (sản phẩm mới có id cao hơn)
            return b.id - a.id;
        })
        .slice(0, 8);

    return (
        <>
            <section className="featured-products">
                <div className="container">
                    <div className="section-top">
                        <h2 className="section-title">Featured Products</h2>
                        <p className="section-subtitle">
                            Discover our premium school uniforms - Crafted with care and designed for comfort, our
                            collection features high-quality materials and timeless styles
                        </p>
                    </div>

                    <div className="featured-products__grid">
                        {featuredProducts.map((product) => {
                            const { id, name, price, sale, thumbnail, slug } = product;
                            return (
                                <article key={id} className="product-card" data-aos="zoom-in">
                                    <figure className="category-product__wrapper">
                                        {sale > 0 && <span className="badge__sale">{`${sale}% OFF`}</span>}
                                        <div className="image-wrapper">
                                            <Link to={`/product/${slug}`}>
                                                <img
                                                    src={`${process.env.REACT_APP_BASE_URL}${thumbnail}`}
                                                    alt={name}
                                                    className="category__product-image"
                                                />
                                            </Link>

                                            <div className="product-card__actions">
                                                <button
                                                    className="action-btn"
                                                    onClick={() => handleWishlistAction(product)}
                                                    disabled={wishlistLoadingStates[id]}
                                                >
                                                    {wishlistLoadingStates[id] ? (
                                                        <img
                                                            src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                            alt="Loading..."
                                                            className="loading-spinner"
                                                        />
                                                    ) : isProductInWishlist(id) ? (
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
                                            <span className="best-sales-item__rating-value">
                                                ({product.rating.toFixed(1)})
                                            </span>
                                        </div>
                                        <h3>
                                            <Link
                                                to={`/product/${slug}`}
                                                className="category__product-name line-clamp"
                                                style={{ "--line-clamp": 2 }}
                                            >
                                                {name}
                                            </Link>
                                        </h3>
                                        <p className="category__product-price">
                                            ${price}
                                            {sale > 0 && (
                                                <span className="category__product-price--old">
                                                    ${calculateOriginalPrice(price, sale)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
};
export default memo(FeaturedProducts);
