import { useState, useEffect, memo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import * as Yup from "yup";
import {
    Building2,
    CreditCard,
    Globe,
    Home,
    Mail,
    Mailbox,
    MapPin,
    MapPinned,
    Phone,
    StickyNote,
    Truck,
    User,
    ArrowLeft,
} from "lucide-react";

import { handleOrder } from "./handleOrder";
import products from "~/data/products.json";
import countries from "~/data/countries.json";
import "~/styles/checkOuts.css";
import toast from "react-hot-toast";
import { handlePaypalCheckout } from "./handlePaypal";
import handleGooglePayCheckout from "./handleGooglePay";
import { Box, CircularProgress } from "@mui/material";
import { isValidEmail } from "~/utils/helpers";
const CheckOut = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cartItems, setCartItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(() => {
        // Chỉ lấy coupon từ location.state khi khởi tạo lần đầu
        return location.state?.appliedCoupon || null;
    });

    // Validation Schema với Yup
    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required("First name is required")
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be less than 50 characters"),
        lastName: Yup.string()
            .required("Last name is required")
            .min(2, "Last name must be at least 2 characters")
            .max(50, "Last name must be less than 50 characters"),
        email: Yup.string()
            .required("Email is required")
            .test("is-valid-email", "Invalid email format", (value) => isValidEmail(value)),
        phone: Yup.string()
            .required("Phone number is required")
            .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number format"),
        address: Yup.string()
            .required("Street address is required")
            .min(5, "Street address must be at least 5 characters"),
        apartment: Yup.string().optional().min(2, "Apartment must be at least 2 characters if provided"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State/Province is required"),
        postalCode: Yup.string()
            .required("Postal code is required")
            .matches(/^\d{5,6}(-\d{4})?$/, "Postal code must be in format: 123456 or 12345-1234"),
        country: Yup.string().required("Country is required"),
        note: Yup.string().optional().max(300, "Note must not exceed 300 characters"),
    });

    // Formik hook
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            apartment: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            note: "",
            paymentMethod: "cod",
        },
        validationSchema,
        onSubmit: async (values) => {
            switch (values.paymentMethod) {
                // Xử lý khi thanh toán bằng tiền mặt
                case "cod":
                    setIsProcessing(true);
                    try {
                        setIsLoading(true);

                        const orderId = await handleOrder(values, cartItems, calculateSubtotal, shippingCost, total);
                        setIsLoading(false);
                        window.location.href = `/order-success/${orderId}`;
                    } catch (error) {
                        window.location.href = `/order-error`;
                    } finally {
                        setIsProcessing(false);
                    }

                    break;
                // Xử lý khi thanh toán bằng PayPal
                case "paypal":
                    try {
                        await handlePaypalCheckout({
                            total,
                            calculateSubtotal,
                            shippingCost,
                            cartItems,
                            setIsLoading,
                            formData: values,
                        });
                    } catch (error) {
                        window.location.href = `/order-error`;
                    }
                    break;
                case "googlepay":
                    try {
                        await handleGooglePayCheckout({
                            total,
                            calculateSubtotal,
                            shippingCost,
                            cartItems,
                            setIsLoading,
                            formData: values,
                        });
                    } catch (error) {
                        // window.location.href = `/order-error`;
                    }
                    break;
                default:
                    toast.error("Invalid payment method");
                    break;
            }
        },
    });

    useEffect(() => {
        const cartStorage = JSON.parse(localStorage.getItem("cart"))?.filter((item) => item.selected) || [];

        // Kiểm tra nếu không có cart items, redirect về trang categories
        if (!cartStorage.length || !location.state?.validCart) {
            navigate("/cart");
            return;
        }

        const cartWithDetails = cartStorage
            .map((item) => {
                const productDetails = products.find((p) => p.id === item.id);
                return productDetails
                    ? {
                          ...productDetails,
                          size: item.size,
                          color: item.color,
                          quantity: item.quantity || 1,
                          selected: true,
                      }
                    : null;
            })
            .filter((item) => item);
        setCartItems(cartWithDetails);
    }, [navigate]); // Chỉ phụ thuộc vào navigate

    const calculateSubtotal = () => {
        // Tính tổng tiền hàng gốc
        const rawSubtotal = cartItems.reduce((total, item) => {
            // Làm tròn số tiền để tránh lỗi số thập phân
            return total + Math.round(item.price * item.quantity * 100) / 100;
        }, 0);

        if (!appliedCoupon) return rawSubtotal;

        // Tính tiền giảm giá nếu có coupon
        let discountableAmount = 0;
        if (appliedCoupon.valid_categories.length === 0) {
            discountableAmount = rawSubtotal;
        } else {
            discountableAmount = cartItems
                .filter((item) => appliedCoupon.valid_categories.includes(item.category))
                .reduce((total, item) => {
                    return total + Math.round(item.price * item.quantity * 100) / 100;
                }, 0);
        }

        const discount = Math.round((discountableAmount * appliedCoupon.discount) / 100);
        return rawSubtotal - discount;
    };

    // Thêm giá trị mặc định cho phí ship
    const shippingCost = Number(process.env.REACT_APP_SHIPPING_COST) || 0;

    // Làm tròn tổng tiền cuối cùng
    const total = Math.round((calculateSubtotal() + shippingCost) * 100) / 100;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <section className="checkout">
            <div className="container">
                <form className="checkout__layout" onSubmit={formik.handleSubmit}>
                    <div className="checkout__form">
                        <motion.div
                            className="checkout__section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="checkout__section-title">
                                <User size={20} />
                                Contact Information
                            </h2>
                            <div className="checkout__input-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                <div className="checkout__field">
                                    <label className="checkout__label">First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        className={`checkout__input ${
                                            formik.touched.firstName && formik.errors.firstName ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("firstName")}
                                        autoFocus
                                        placeholder="John"
                                    />
                                    {formik.touched.firstName && formik.errors.firstName && (
                                        <div className="error-message">{formik.errors.firstName}</div>
                                    )}
                                </div>
                                <div className="checkout__field">
                                    <label className="checkout__label">Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        className={`checkout__input ${
                                            formik.touched.lastName && formik.errors.lastName ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("lastName")}
                                        placeholder="Doe"
                                    />
                                    {formik.touched.lastName && formik.errors.lastName && (
                                        <div className="error-message">{formik.errors.lastName}</div>
                                    )}
                                </div>
                                <div className="checkout__field">
                                    <label className="checkout__label">
                                        <Mail size={16} />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={`checkout__input ${
                                            formik.touched.email && formik.errors.email ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("email")}
                                        required
                                        placeholder="example@email.com"
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="error-message">{formik.errors.email}</div>
                                    )}
                                </div>
                                <div className="checkout__field">
                                    <label className="checkout__label">
                                        <Phone size={16} />
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className={`checkout__input ${
                                            formik.touched.phone && formik.errors.phone ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("phone")}
                                        required
                                        placeholder="+1 (555) 000-0000"
                                    />
                                    {formik.touched.phone && formik.errors.phone && (
                                        <div className="error-message">{formik.errors.phone}</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="checkout__section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h2 className="checkout__section-title">
                                <MapPin size={20} />
                                Shipping Address
                            </h2>
                            <div className="checkout__input-group">
                                <div className="checkout__field">
                                    <label className="checkout__label">
                                        <Home size={16} />
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        className={`checkout__input ${
                                            formik.touched.address && formik.errors.address ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("address")}
                                        required
                                        placeholder="Street address"
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <div className="error-message">{formik.errors.address}</div>
                                    )}
                                </div>
                                <div className="checkout__field">
                                    <label className="checkout__label">Apartment, suite, etc. (optional)</label>
                                    <input
                                        type="text"
                                        name="apartment"
                                        className={`checkout__input ${
                                            formik.touched.apartment && formik.errors.apartment ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("apartment")}
                                        placeholder="Apartment, suite, unit, etc."
                                    />
                                    {formik.touched.apartment && formik.errors.apartment && (
                                        <div className="error-message">{formik.errors.apartment}</div>
                                    )}
                                </div>
                                <div className="checkout__input-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                    <div className="checkout__field">
                                        <label className="checkout__label">
                                            <Globe size={16} />
                                            Country *
                                        </label>
                                        <select
                                            name="country"
                                            className={`checkout__input ${
                                                formik.touched.country && formik.errors.country ? "error" : ""
                                            }`}
                                            {...formik.getFieldProps("country")}
                                            required
                                        >
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.country && formik.errors.country && (
                                            <div className="error-message">{formik.errors.country}</div>
                                        )}
                                    </div>
                                    <div className="checkout__field">
                                        <label className="checkout__label">
                                            <MapPinned size={16} />
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            className={`checkout__input ${
                                                formik.touched.state && formik.errors.state ? "error" : ""
                                            }`}
                                            {...formik.getFieldProps("state")}
                                            required
                                            placeholder="Enter your state or province"
                                        />
                                        {formik.touched.state && formik.errors.state && (
                                            <div className="error-message">{formik.errors.state}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="checkout__input-group" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                    <div className="checkout__field">
                                        <label className="checkout__label">
                                            <Building2 size={16} />
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            className={`checkout__input ${
                                                formik.touched.city && formik.errors.city ? "error" : ""
                                            }`}
                                            {...formik.getFieldProps("city")}
                                            required
                                            placeholder="Enter your city"
                                        />
                                        {formik.touched.city && formik.errors.city && (
                                            <div className="error-message">{formik.errors.city}</div>
                                        )}
                                    </div>
                                    <div className="checkout__field">
                                        <label className="checkout__label">
                                            <Mailbox size={16} />
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            className={`checkout__input ${
                                                formik.touched.postalCode && formik.errors.postalCode ? "error" : ""
                                            }`}
                                            {...formik.getFieldProps("postalCode")}
                                            required
                                            placeholder="Enter your postal code (e.g., 12345)"
                                        />
                                        {formik.touched.postalCode && formik.errors.postalCode && (
                                            <div className="error-message">{formik.errors.postalCode}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="checkout__field">
                                    <label className="checkout__label">
                                        <StickyNote size={16} />
                                        Notes for Shipper (Optional)
                                    </label>
                                    <textarea
                                        name="note"
                                        className={`checkout__input checkout__input--textarea ${
                                            formik.touched.note && formik.errors.note ? "error" : ""
                                        }`}
                                        {...formik.getFieldProps("note")}
                                        placeholder="E.g: Please call me before delivery, Leave at front door, Fragile items, etc."
                                    />
                                    {formik.touched.note && formik.errors.note && (
                                        <div className="error-message">{formik.errors.note}</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="checkout__section"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="checkout__section-title">
                                <CreditCard size={20} />
                                Payment Method
                            </h2>
                            <div className="checkout__payment-methods">
                                <div className="checkout__payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={formik.values.paymentMethod === "cod"}
                                        onChange={formik.handleChange}
                                        className="checkout__payment-radio"
                                        id="cod"
                                    />
                                    <label className="checkout__payment-label" htmlFor="cod">
                                        <span className="checkout__payment-check"></span>
                                        <div className="checkout__payment-content">
                                            <div className="checkout__payment-title">Cash on Delivery</div>
                                            <div className="checkout__payment-description">
                                                Pay with cash upon delivery
                                            </div>
                                        </div>
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}/assets/icon/payment-upon-receipt.png`}
                                            alt="Payment upon receipt"
                                            className="checkout__payment-icon"
                                        />
                                    </label>
                                </div>

                                <div className="checkout__payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={formik.values.paymentMethod === "paypal"}
                                        onChange={formik.handleChange}
                                        className="checkout__payment-radio"
                                        id="paypal"
                                    />
                                    <label className="checkout__payment-label" htmlFor="paypal">
                                        <span className="checkout__payment-check"></span>
                                        <div className="checkout__payment-content">
                                            <div className="checkout__payment-title">PayPal</div>
                                            <div className="checkout__payment-description">
                                                Pay with your PayPal account
                                            </div>
                                        </div>
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}/assets/icon/paypal-big.png`}
                                            alt="PayPal"
                                            className="checkout__payment-icon"
                                        />
                                    </label>
                                </div>

                                <div className="checkout__payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="googlepay"
                                        checked={formik.values.paymentMethod === "googlepay"}
                                        onChange={formik.handleChange}
                                        className="checkout__payment-radio"
                                        id="googlepay"
                                    />
                                    <label className="checkout__payment-label" htmlFor="googlepay">
                                        <span className="checkout__payment-check"></span>
                                        <div className="checkout__payment-content">
                                            <div className="checkout__payment-title">Google Pay</div>
                                            <div className="checkout__payment-description">
                                                Pay with your Google Pay account
                                            </div>
                                        </div>
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}/assets/icon/google_pay.png`}
                                            alt="Google Pay"
                                            className="checkout__payment-icon"
                                        />
                                    </label>
                                </div>

                                <div className="checkout__payment-option" style={{ opacity: 0.6 }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="momo"
                                        disabled={true}
                                        checked={formik.values.paymentMethod === "momo"}
                                        onChange={formik.handleChange}
                                        className="checkout__payment-radio"
                                        id="momo"
                                    />
                                    <label className="checkout__payment-label" htmlFor="momo">
                                        <span className="checkout__payment-check"></span>
                                        <div className="checkout__payment-content">
                                            <div className="checkout__payment-title">Momo (Coming Soon)</div>
                                            <div className="checkout__payment-description">
                                                Pay with your Momo wallet
                                            </div>
                                        </div>
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}/assets/icon/momo.svg`}
                                            alt="Momo"
                                            className="checkout__payment-icon"
                                        />
                                    </label>
                                </div>
                                {/* {formik.values.paymentMethod === "momo" && (
                                        <Momo
                                            total={total}
                                            cartItems={cartItems}
                                            formData={formik.values}
                                            isProcessing={isProcessing}
                                            setIsProcessing={setIsProcessing}

                                        />
                                    )} */}
                            </div>
                        </motion.div>
                    </div>

                    <div className="checkout__summary">
                        <motion.div
                            className="checkout__section"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="checkout__section-title">
                                <Truck size={20} />
                                Order Summary
                            </h2>
                            <div className="checkout__items">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.color}-${item.size}`} className="checkout__item">
                                        <div className="checkout__item-image">
                                            <a href={`/product/${item.slug}`} target="_blank" rel="noreferrer">
                                                <img
                                                    src={`${process.env.REACT_APP_BASE_URL}${item.thumbnail}`}
                                                    alt={item.name}
                                                />
                                            </a>
                                        </div>

                                        <div className="checkout__item-info">
                                            <h3>
                                                <a
                                                    href={`/product/${item.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="checkout__item-name"
                                                >
                                                    {item.name}
                                                </a>
                                            </h3>

                                            <p className="checkout__item-meta">
                                                Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                                            </p>
                                            <p className="checkout__item-price">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="checkout__totals">
                                <div className="checkout__total-row">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(calculateSubtotal())}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="checkout__total-row checkout__total-row--discount">
                                        <span>Discount ({appliedCoupon.discount}%)</span>
                                        <span>
                                            -
                                            {formatCurrency(
                                                cartItems.reduce(
                                                    (total, item) => total + item.price * item.quantity,
                                                    0,
                                                ) - calculateSubtotal(),
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="checkout__total-row">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(shippingCost)}</span>
                                </div>
                                <div className="checkout__total-row checkout__total-row--final">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>

                            <button type="submit" className="checkout__submit" disabled={isProcessing}>
                                {isProcessing ? "Processing..." : "Place Order"}
                            </button>
                            <span
                                className="checkout__back-btn"
                                onClick={() => {
                                    if (appliedCoupon) {
                                        if (
                                            window.confirm(
                                                "Note: When you go back, you will lose the discount code you entered earlier?",
                                            )
                                        ) {
                                            navigate("/cart");
                                        }
                                    } else {
                                        navigate("/cart");
                                    }
                                }}
                            >
                                <ArrowLeft size={16} />
                                <span>Back</span>
                            </span>
                        </motion.div>
                    </div>
                </form>
            </div>
            {isLoading && (
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
        </section>
    );
};
export default memo(CheckOut);
