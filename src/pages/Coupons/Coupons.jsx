import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import coupons from "~/data/coupons.json";
import "~/styles/coupons.css";
import toast from "react-hot-toast";
import categories from "~/data/categories.json";

const CouponPage = () => {
    const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = async (code) => {
        try {
            // Try the modern Clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(code);
            } else {
                // Fallback for older browsers and mobile
                const textArea = document.createElement("textarea");
                textArea.value = code;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }
            setCopiedCode(code);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (error) {
            console.error("Copy failed:", error);
            toast.error("Failed to copy to clipboard");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <section className="coupon-page">
            <div className="container">
                <motion.h1
                    className="coupon-page__title"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Special Offers Just For You
                </motion.h1>
                <div className="coupon-page__grid">
                    <AnimatePresence>
                        {coupons
                            .filter((coupon) => coupon.visible)
                            .map((coupon, index) => {
                                const slugCategory = [];
                                if (coupon.valid_categories) {
                                    coupon.valid_categories.forEach((category) => {
                                        const itemCategory = categories.find((item) => item.name === category);
                                        if (itemCategory) {
                                            slugCategory.push({ slug: itemCategory.slug, name: itemCategory.name });
                                        }
                                    });
                                }

                                return (
                                    <motion.div
                                        key={coupon.code}
                                        className="coupon-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <div className="coupon-card__label">SAVE {coupon.discount}%</div>
                                        <div className="coupon-card__content">
                                            <div className="coupon-card__header">
                                                <h2 className="coupon-card__discount">{coupon.discount}% OFF</h2>
                                                <div className="coupon-card__expiry">
                                                    Expires: {formatDate(coupon.expiry_date)}
                                                </div>
                                            </div>
                                            <div className="coupon-card__details">
                                                <p className="coupon-card__min-purchase">
                                                    Min. Purchase: ${coupon.min_purchase}
                                                </p>
                                                {
                                                    <div className="coupon-card__categories">
                                                        <p className="coupon-card__categories-title">Valid for:</p>
                                                        {slugCategory.map((category, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={`/category/${category.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="coupon-card__category"
                                                            >
                                                                {category.name}
                                                            </a>
                                                        ))}
                                                        {!slugCategory.length && (
                                                            <a
                                                                className="coupon-card__category"
                                                                href="/category/all-product"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                All products
                                                            </a>
                                                        )}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="coupon-card__code">
                                            <div className="coupon-card__code-container">
                                                <span className="coupon-card__code-text">{coupon.code}</span>
                                                <button
                                                    className="coupon-card__copy"
                                                    onClick={() => copyToClipboard(coupon.code)}
                                                >
                                                    {copiedCode === coupon.code ? (
                                                        <>
                                                            <Check className="coupon-card__icon" />
                                                            <span className="coupon-card__copy-text">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="coupon-card__icon" />
                                                            <span className="coupon-card__copy-text">Copy Code</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
export default memo(CouponPage);
