import { memo } from "react";
import { Rating } from "@mui/material";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Reviews = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div className="product__tab-content">
            <div className="product__reviews">
                <div className="product__reviews-summary">
                    <div className="product__reviews-average">
                        <h4>{product.rating.toFixed(1)} / 5.0</h4>
                        <Rating
                            name="read-only"
                            value={product.rating}
                            precision={0.1}
                            readOnly
                            size="large"
                            sx={{
                                fontSize: "2.4rem",
                                color: "#ffd700",
                            }}
                        />
                        <p>{product.soldQuantity.toLocaleString()} verified ratings</p>
                        <motion.button
                            className="btn product__review-btn"
                            onClick={() =>
                                navigate("/pages/contact", {
                                    state: { type: "FEEDBACK" },
                                })
                            }
                            whileHover={{
                                scale: 1.05,
                                backgroundColor: "#000",
                                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Star size={18} />
                            Write a Review
                        </motion.button>
                    </div>
                    <div className="product__rating-bars">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="product__rating-bar">
                                <span>{stars} stars</span>
                                <div className="product__rating-progress">
                                    <div
                                        className="product__rating-fill"
                                        style={{
                                            width: `${Math.random() * 100}%`,
                                        }}
                                    ></div>
                                </div>
                                <span>{Math.floor(Math.random() * 1000)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Review List */}
                <div className="product__reviews-list">
                    {[1, 2, 3].map((review) => (
                        <div key={review} className="product__review-item">
                            <div className="product__review-header">
                                <div className="product__review-user">
                                    <img
                                        src={`/assets/imgs/ui-face/user-${review}.webp`}
                                        alt="User avatar"
                                        className="product__review-avatar"
                                    />
                                    <div>
                                        <h5>John Doe {review}</h5>
                                        <Rating
                                            value={5}
                                            readOnly
                                            size="small"
                                            sx={{ fontSize: "1.6rem", color: "#ffd700" }}
                                        />
                                    </div>
                                </div>
                                <span className="product__review-date">2 days ago</span>
                            </div>
                            <div className="product__review-content">
                                <p>
                                    Great quality uniform! The material is durable and comfortable. Perfect for everyday
                                    school wear. My child loves it!
                                </p>
                                <div className="product__review-images">
                                    {product.images.map((image, index) => (
                                        <img
                                            src={image}
                                            alt={`Customer review ${index + 1}`}
                                            className="product__review-image"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(Reviews);
