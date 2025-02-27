import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Rating } from "@mui/material";
import { Heart, HeartOff } from "lucide-react";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import productData from "~/data/products.json";
import { useWishlistActions } from "~/utils/handleWishlist";
import { calculateOriginalPrice } from "~/utils/helpers";
import "~/styles/bestSales.css"; // Import CSS Module
const BestSales = () => {
    const { handleWishlistAction, isProductInWishlist, loadingStates: wishlistLoadingStates } = useWishlistActions();

    /*Sản phẩm được sắp xếp theo tiêu chí => Rating và doanh thu cao*/
    // Tính toán doanh thu và sắp xếp sản phẩm
    const bestSellingProducts = productData
        .filter((product) => product.best_sale)
        .map((product) => ({
            ...product,
            revenue: product.price * product.soldQuantity, // Tính doanh thu để sắp xếp
        }))
        .sort((a, b) => {
            // Sắp xếp theo doanh thu giảm dần
            if (b.revenue !== a.revenue) {
                return b.revenue - a.revenue;
            }
            // Nếu doanh thu bằng nhau, sắp xếp theo số lượng bán
            return b.soldQuantity - a.soldQuantity;
        })
        .slice(0, 6); // Lấy 6 sản phẩm đầu tiên

    return (
        <section className="best-sales">
            <div className="container">
                <div className="section-top">
                    <h2 className="section-title">Best Sales</h2>
                    <p className="section-subtitle">
                        Our top-performing products based on total sales and revenue. These items showcase the best in
                        terms of sales volume and revenue generation within our school uniform collection
                    </p>
                </div>
                <div className="best-sales__grid">
                    {bestSellingProducts.map(
                        ({ id, name, price, sale, thumbnail, soldQuantity, rating, slug }, index) => {
                            return (
                                <article key={id} className="best-sales-item" data-aos="zoom-in">
                                    <figure className="best-sales-item__image">
                                        {/* Hiển thị SALE nếu sản phẩm đang giảm giá */}
                                        {sale > 0 && <span className="badge__sale">SALE {sale}%</span>}
                                        <Link to={`/product/${slug}`}>
                                            <img
                                                src={`${process.env.REACT_APP_BASE_URL}${thumbnail}`}
                                                alt={name}
                                                width="100%"
                                                loading="lazy"
                                                className="best-sale-item__thumb"
                                            />
                                        </Link>
                                        <div className="product-card__actions">
                                            <button
                                                className="action-btn"
                                                onClick={() =>
                                                    handleWishlistAction(productData.find((p) => p.id === id))
                                                }
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
                                    </figure>

                                    <div className="best-sales-item__info">
                                        <h3>
                                            <Link to={`/product/${slug}`} className="best-sales-item__name">
                                                {name}
                                            </Link>
                                        </h3>

                                        <div className="best-sales-item__rating-wrap">
                                            <Rating
                                                name="read-only"
                                                value={rating}
                                                precision={0.1}
                                                readOnly
                                                size="small"
                                                sx={{
                                                    fontSize: "1.8rem",
                                                    color: "#ffd700",
                                                }}
                                            />
                                            <span className="best-sales-item__rating-value">({rating.toFixed(1)})</span>
                                        </div>
                                        <div className="best-sales-item__sold-wrap">
                                            <span className="best-sales-item__sold">
                                                {soldQuantity.toLocaleString()} purchases
                                            </span>
                                            <TrendingUpIcon sx={{ fontSize: 16 }} />
                                        </div>
                                        {/* Nút thêm vào giỏ hàng và yêu thích */}
                                        <div className="best-sales-item__actions"></div>
                                        {/* Hiển thị giá và giá cũ nếu có giảm giá */}
                                        <p className="best-sales-item__price">
                                            ${price}
                                            {sale > 0 && (
                                                <span className="best-sales-item__price--old">
                                                    ${calculateOriginalPrice(price, sale)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </article>
                            );
                        },
                    )}
                </div>
            </div>
        </section>
    );
};
export default memo(BestSales);
