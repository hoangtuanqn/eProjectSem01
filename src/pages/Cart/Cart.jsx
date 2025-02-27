import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, BadgePercent, Trash2Icon } from "lucide-react";
import "~/styles/cart.css";
import products from "~/data/products.json";
import { handleCheckQuantity, useCartActions } from "~/utils/handleCart";
import coupons from "~/data/coupons.json";
import toast from "react-hot-toast";
import { Box, CircularProgress } from "@mui/material";
import { useGlobalState } from "~/context/GlobalContext";
import categories from "~/data/categories.json";
import clsx from "clsx";

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [notes, setNotes] = useState({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [shippingCost] = useState(process.env.REACT_APP_SHIPPING_COST);
    const [deletingItemId, setDeletingItemId] = useState(null);
    const { handleCartAction, getUpdatedCartItems } = useCartActions();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const { cartQuantityTemp, setCartQuantityTemp } = useGlobalState();
    const [selectedItems, setSelectedItems] = useState([]);
    let cartStorage;
    useEffect(() => {
        cartStorage = JSON.parse(localStorage.getItem("cart")) || [];
        const cartWithDetails = cartStorage
            .map((item) => {
                const productDetails = products.find((p) => p.id === item.id);
                return productDetails
                    ? {
                          ...productDetails,
                          size: item.size,
                          color: item.color,
                          quantity: item.quantity || 1,
                          note: notes[`${item.id}-${item.color}-${item.size}`] || "",
                          selected: item.selected,
                      }
                    : null;
            })
            .filter((item) => item);
        setCartItems(cartWithDetails);
        setSelectedItems(() => {
            const selectedItems = [];
            cartWithDetails.forEach((item) => {
                if (item.selected) {
                    selectedItems.push(`${item.id}-${item.color}-${item.size}`);
                }
            });
            return selectedItems;
        });
    }, [notes, cartQuantityTemp]);

    // Hàm kiểm tra lại sản phẩm có trong giỏ hàng không trước khi thanh toán
    const handleProcess = () => {
        for (const item of cartItems) {
            // Chỉ kiểm tra những sản phẩm được chọn
            if (item.selected) {
                const productInStore = products.find((p) => p.id === item.id);
                if (productInStore && productInStore.quantity < item.quantity) {
                    toast.error(
                        `Quantity for ${productInStore.name} exceeds available stock. Available: ${productInStore.quantity}`,
                    );
                    return false; // Prevent checkout if any item exceeds stock
                }
            }
        }
        return true; // Proceed to checkout if all quantities are valid
    };

    // setCartQuantityTemp((prev) => !prev);

    const handleQuantityChange = (id, maxQuantity, newQuantity) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item,
        );
        setCartItems(updatedCart);
        localStorage.setItem(
            "cart",
            JSON.stringify(
                updatedCart.map(({ id, size, color, quantity, selected }) => ({
                    id,
                    size,
                    color,
                    quantity,
                    selected,
                })),
            ),
        );
        setCartQuantityTemp((prev) => !prev);
    };

    const handleRemoveItem = async (id) => {
        setDeletingItemId(id);
        const itemToRemove = cartItems.find((item) => item.id === id);
        const updatedCart = await handleCartAction(itemToRemove, true);
        if (updatedCart) {
            setCartItems(getUpdatedCartItems(updatedCart, true));
        }
        setDeletingItemId(null);
    };

    const handleNoteChange = (id, color, size, note) => {
        setNotes((prev) => ({
            ...prev,
            [`${id}-${color}-${size}`]: note,
        }));
    };

    const validateCoupon = (code, subtotal, items) => {
        const coupon = coupons.find((c) => c.code === code.toUpperCase());

        if (!coupon) {
            toast.error("Invalid coupon code");
            return null;
        }

        // Check expiry date
        if (new Date(coupon.expiry_date) < new Date()) {
            toast.error("Coupon has expired");

            return null;
        }

        // Check minimum purchase
        if (subtotal < coupon.min_purchase) {
            toast.error(`Minimum purchase amount of $${coupon.min_purchase} required`);
            return null;
        }

        // If valid_categories is empty, coupon applies to all categories
        if (coupon.valid_categories.length > 0) {
            const hasValidItem = items.some((item) => coupon.valid_categories.includes(item.category));

            if (!hasValidItem) {
                toast.error("Coupon is not valid for any items in your cart");
                return null;
            }
        }

        return coupon;
    };

    const calculateDiscountedTotal = (items, coupon) => {
        if (!coupon) return calculateSubtotal();

        let discountableAmount = 0;

        if (coupon.valid_categories.length === 0) {
            // Nếu không có category cụ thể, áp dụng giảm giá cho toàn bộ giỏ hàng
            discountableAmount = calculateSubtotal();
        } else {
            // Chỉ tính tổng các sản phẩm thuộc category hợp lệ
            discountableAmount = items
                .filter((item) => coupon.valid_categories.includes(item.category))
                .reduce((total, item) => total + item.price * item.quantity, 0);
        }

        const discount = Math.min((discountableAmount * coupon.discount) / 100, discountableAmount); // Thêm Math.min để đảm bảo giảm giá không vượt quá tổng tiền
        return calculateSubtotal() - discount;
    };

    const applyCoupon = async () => {
        setIsCalculating(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        try {
            const subtotal = calculateSubtotal();
            const validCoupon = validateCoupon(couponCode, subtotal, cartItems);

            if (validCoupon) {
                setAppliedCoupon(validCoupon);
                setCouponCode(couponCode.toUpperCase());
                toast.success(`Coupon applied! ${validCoupon.discount}% off`);
            }
        } finally {
            setIsCalculating(false);
        }
    };
    const removeCoupon = async () => {
        if (window.confirm("Are you sure you want to remove the coupon?")) {
            setIsCalculating(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setAppliedCoupon(null);
            setIsCalculating(false);
            toast.success("Coupon removed successfully");
        }
    };

    const calculateSubtotal = () => {
        return cartItems
            .filter((item) => selectedItems.includes(`${item.id}-${item.color}-${item.size}`))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getSuggestedCoupons = () => {
        const subtotal = calculateSubtotal();
        const validCoupons = coupons
            .filter((coupon) => {
                return coupon.visible && new Date(coupon.expiry_date) > new Date() && subtotal >= coupon.min_purchase;
            })
            .sort((a, b) => b.discount - a.discount);
        return validCoupons.filter(
            (coupon) =>
                coupon.valid_categories.length === 0 ||
                coupon.valid_categories.some((category) => cartItems.some((item) => item.category === category)),
        );
    };
    const listCoupons = getSuggestedCoupons();


    const handleSelectItem = (itemId, color, size) => {
        const key = `${itemId}-${color}-${size}`;
        setSelectedItems((prev) => {
            if (prev.includes(key)) {
                return prev.filter((id) => id !== key);
            }
            return [...prev, key];
        });

        const updatedCart = cartItems.map((item) => {
            if (item.id === itemId && item.color === color && item.size === size) {
                return { ...item, selected: !item.selected };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem(
            "cart",
            JSON.stringify(
                updatedCart.map(({ id, size, color, quantity, selected }) => ({
                    id,
                    size,
                    color,
                    quantity,
                    selected,
                })),
            ),
        );
    };

    const handleSelectAll = () => {
        const newSelectedItems =
            selectedItems.length === cartItems.length
                ? [] // Bỏ chọn tất cả
                : cartItems.map((item) => `${item.id}-${item.color}-${item.size}`); // Chọn tất cả

        setSelectedItems(newSelectedItems);

        // Cập nhật trạng thái selected trong cartItems
        const updatedCart = cartItems.map((item) => ({
            ...item,
            selected: newSelectedItems.includes(`${item.id}-${item.color}-${item.size}`), // Cập nhật selected
        }));

        setCartItems(updatedCart);
        localStorage.setItem(
            "cart",
            JSON.stringify(
                // Cập nhật localStorage
                updatedCart.map(({ id, size, color, quantity, selected }) => ({
                    id,
                    size,
                    color,
                    quantity,
                    selected,
                })),
            ),
        );
    };

    const handleDeleteSelected = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
            setIsCalculating(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
            const updatedCart = currentCart.filter(
                (item) => !selectedItems.includes(`${item.id}-${item.color}-${item.size}`),
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            const remainingItems = cartItems.filter(
                (item) => !selectedItems.includes(`${item.id}-${item.color}-${item.size}`),
            );
            setCartItems(remainingItems);
            setSelectedItems([]);
            setAppliedCoupon(null);

            setIsCalculating(false);
            toast.success("Selected items removed successfully");
        }
    };

    return (
        <>
            <section className="cart-page">
                <div className="container">
                    {/* <h1 className="section-title">Shopping Cart</h1>
                <p className="section-subtitle">Review your items and checkout</p> */}

                    {cartItems.length > 0 ? (
                        <div className="cart-page__layout">
                            <div className="cart-page__items">
                                <div className="cart-page__items-header">
                                    <label className="checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === cartItems.length}
                                            onChange={handleSelectAll}
                                        />
                                        <span className="checkmark"></span>
                                        Select All ({selectedItems.length}/{cartItems.length})
                                    </label>
                                    {selectedItems.length > 0 && (
                                        <button
                                            className="cart-page__delete-selected-btn"
                                            onClick={handleDeleteSelected}
                                        >
                                            <Trash2 size={16} />
                                            Delete Selected ({selectedItems.length})
                                        </button>
                                    )}
                                </div>

                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((item) => {
                                        const itemProductOrigin = products.find((p) => p.id === item.id);

                                        return (
                                            <motion.article
                                                key={`${item.id}-${item.size}-${item.color}`}
                                                className={clsx(
                                                    "cart-page__item",
                                                    item.quantity > itemProductOrigin.quantity && "disabled",
                                                )}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    height: 0,
                                                    marginBottom: 0,
                                                    marginLeft: -200,
                                                    transition: {
                                                        opacity: { duration: 0.2 },
                                                        height: { duration: 0.3, delay: 0.1 },
                                                    },
                                                }}
                                                transition={{ duration: 0.8 }}
                                            >
                                                <div className="cart-page__item-checkbox">
                                                    <label className="checkbox-wrapper">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedItems.includes(
                                                                `${item.id}-${item.color}-${item.size}`,
                                                            )}
                                                            onChange={() =>
                                                                handleSelectItem(item.id, item.color, item.size)
                                                            }
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                                <div className="cart-page__item-image">
                                                    <Link to={`/product/${item.slug}`}>
                                                        <img
                                                            src={`${process.env.REACT_APP_BASE_URL}${item.thumbnail}`}
                                                            alt={item.name}
                                                        />
                                                    </Link>
                                                </div>
                                                <div className="cart-page__item-details">
                                                    <div className="cart-page__item-info">
                                                        <Link
                                                            to={`/category/${(() => {
                                                                const category = categories.find(
                                                                    (cate) => cate.name === item.category,
                                                                );
                                                                return category?.slug;
                                                            })()}`}
                                                            className="cart-page__item-category"
                                                        >
                                                            {item.category}
                                                        </Link>
                                                        <h3>
                                                            <Link
                                                                to={`/product/${item.slug}`}
                                                                className="cart-page__item-name"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </h3>
                                                        <div className="cart-item__details">
                                                            <div className="cart-item__detail">
                                                                <span className="cart-item__label">Size:</span>
                                                                <span className="cart-item__value">{item.size}</span>
                                                            </div>
                                                            <div className="cart-item__detail">
                                                                <span className="cart-item__label">Color:</span>
                                                                <span className="cart-item__value">{item.color}</span>
                                                            </div>
                                                        </div>
                                                        <span className="cart-item__current-price">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </span>
                                                        {item.quantity > itemProductOrigin.quantity && (
                                                            <span className="cart-item__current-price red">
                                                                The product in stock is currently insufficient to
                                                                supply.
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="cart-page__item-actions">
                                                        <div className="product__quantity-input">
                                                            <button
                                                                className={clsx(
                                                                    "product__quantity-button",
                                                                    item.quantity <= 1 && "disabled",
                                                                )}
                                                                onClick={() => {
                                                                    if (
                                                                        handleCheckQuantity(
                                                                            itemProductOrigin.quantity,
                                                                            item.quantity - 1,
                                                                        )
                                                                    ) {
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            itemProductOrigin.quantity,
                                                                            item.quantity - 1,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                className={clsx(
                                                                    "product__quantity-number",
                                                                    item.quantity > itemProductOrigin.quantity &&
                                                                        "disabled",
                                                                )}
                                                                onChange={(e) => {
                                                                    if (
                                                                        handleCheckQuantity(
                                                                            itemProductOrigin.quantity,
                                                                            Number.parseInt(e.target.value),
                                                                        )
                                                                    ) {
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            itemProductOrigin.quantity,
                                                                            Number.parseInt(e.target.value),
                                                                        );
                                                                    }
                                                                }}
                                                                min="1"
                                                            />
                                                            <button
                                                                className={clsx(
                                                                    "product__quantity-button",
                                                                    item.quantity > itemProductOrigin.quantity &&
                                                                        "disabled",
                                                                )}
                                                                onClick={() => {
                                                                    if (
                                                                        handleCheckQuantity(
                                                                            itemProductOrigin.quantity,
                                                                            item.quantity + 1,
                                                                        )
                                                                    ) {
                                                                        handleQuantityChange(
                                                                            item.id,
                                                                            itemProductOrigin.quantity,
                                                                            item.quantity + 1,
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button
                                                            className="cart-page__remove-btn"
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            disabled={deletingItemId === item.id}
                                                        >
                                                            {deletingItemId === item.id ? (
                                                                <img
                                                                    src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                                    alt="Loading..."
                                                                    className="loading-spinner"
                                                                />
                                                            ) : (
                                                                <Trash2 size={16} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="cart-page__item-note">
                                                    <textarea
                                                        placeholder="Add note about this item"
                                                        value={notes[`${item.id}-${item.color}-${item.size}`] || ""}
                                                        onChange={(e) =>
                                                            handleNoteChange(
                                                                item.id,
                                                                item.color,
                                                                item.size,
                                                                e.target.value,
                                                            )
                                                        }
                                                        rows="2"
                                                    />
                                                </div>
                                            </motion.article>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            <div className="cart-page__summary">
                                {/* {cartItems.length > 1 && (
                                    <button
                                        className="cart-page__clear-btn"
                                        onClick={handleClearCart}
                                        disabled={isCalculating}
                                    >
                                        {isCalculating ? (
                                            <img
                                                src="/assets/icon/loading.gif"
                                                alt="Loading..."
                                                className="loading-spinner"
                                            />
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                Clear Cart
                                            </>
                                        )}
                                    </button>
                                )} */}

                                <div className="cart-page__totals">
                                    <div className="cart-page__totals-row">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(calculateSubtotal())}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="cart-page__totals-row cart-page__totals-row--discount checkout__total-row--discount">
                                            <span>Discount ({appliedCoupon.discount}%)</span>
                                            <span>
                                                -
                                                {formatCurrency(
                                                    calculateSubtotal() -
                                                        calculateDiscountedTotal(cartItems, appliedCoupon),
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div className="cart-page__totals-row">
                                        <span>Shipping</span>
                                        <span>{formatCurrency(Number(shippingCost))}</span>
                                    </div>
                                    <div className="cart-page__totals-row cart-page__totals-row--total">
                                        <span>Total</span>
                                        <span>
                                            {formatCurrency(
                                                (appliedCoupon
                                                    ? calculateDiscountedTotal(cartItems, appliedCoupon)
                                                    : calculateSubtotal()) + Number(shippingCost),
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="cart-page__shipping">
                                    <h3>Coupon Code</h3>
                                    <div className="cart-page__shipping-form">
                                        <input
                                            type="text"
                                            placeholder="Enter coupon code"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={appliedCoupon !== null}
                                        />
                                        {appliedCoupon ? (
                                            <button
                                                className="cart-page__calculate-btn cart-page__remove-coupon-btn"
                                                onClick={removeCoupon}
                                            >
                                                {isCalculating ? (
                                                    <img
                                                        src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                        alt="Loading..."
                                                        className="loading-spinner"
                                                    />
                                                ) : (
                                                    <>
                                                        <Trash2Icon size={16} />
                                                        Remove
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                className="cart-page__calculate-btn"
                                                onClick={applyCoupon}
                                                disabled={isCalculating || !couponCode}
                                            >
                                                {isCalculating ? (
                                                    <img
                                                        src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                        alt="Loading..."
                                                        className="loading-spinner"
                                                    />
                                                ) : (
                                                    <>
                                                        <BadgePercent size={16} />
                                                        Apply
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                    {!appliedCoupon && (
                                        <div className="cart-page__coupon-suggestions">
                                            <div className="dfbetween">
                                                <h4>
                                                    {listCoupons.length !== 0 ||
                                                        "Haven't found a suitable discount code for you"}
                                                </h4>
                                                {listCoupons.length > 0 && <h4>{listCoupons.length} coupons found</h4>}
                                            </div>
                                            <div className="coupon-list">
                                                {listCoupons.map((coupon) => (
                                                    <div
                                                        key={coupon.code}
                                                        className="coupon-item"
                                                        onClick={() => setCouponCode(coupon.code)}
                                                    >
                                                        <div className="coupon-info">
                                                            <span className="coupon-code">{coupon.code}</span>
                                                            <span className="coupon-discount">
                                                                {coupon.discount}% OFF
                                                            </span>
                                                        </div>
                                                        <div className="coupon-details">
                                                            <span>Min. purchase: ${coupon.min_purchase}</span>
                                                            {coupon.valid_categories.length > 0 && (
                                                                <span>
                                                                    Valid for: {coupon.valid_categories.join(", ")}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (handleProcess()) {
                                            navigate("/checkouts", {
                                                // Đảm bảo rằng chỉ có thể truy cập trang thanh toán khi bấm
                                                state: { appliedCoupon: appliedCoupon, validCart: true },
                                            });
                                        }
                                    }}
                                    className="cart-page__checkout-btn"
                                    disabled={selectedItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            className="cart-page__empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <img src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/cart_empty.png`} alt="Empty cart" />
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven't added any items to your cart yet.</p>
                            <Link to="/categories" className="btn cart__btn">
                                Continue Shopping
                            </Link>
                        </motion.div>
                    )}
                </div>
            </section>
            {isCalculating && (
                <Box
                    position="fixed"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="rgba(255, 255, 255, 0.7)"
                    zIndex={9999}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: "#2c3e50",
                        }}
                    />
                </Box>
            )}
        </>
    );
}
