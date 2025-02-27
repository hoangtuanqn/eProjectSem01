import { useState, useEffect } from "react";
import { Search, Package, MapPin, Clock, ArrowRight, Ruler, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import products from "~/data/products.json";
import "~/styles/orderTracking.css";
import categories from "~/data/categories.json";

export default function InvoiceTracking() {
    const { orderId: orderIdFromUrl } = useParams();
    const [orderId, setOrderId] = useState(orderIdFromUrl || "");
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Thêm useEffect để tự động tìm kiếm khi có orderId từ URL
    useEffect(() => {
        if (orderIdFromUrl) {
            handleSearch(orderIdFromUrl);
        }
    }, [orderIdFromUrl]);

    // Hàm để lấy thông tin chi tiết sản phẩm từ products.json
    const getProductDetails = (productId) => {
        return products.find((product) => product.id === productId) || null;
    };

    // Xử lý dữ liệu đơn hàng khi nhận được response
    const processOrderData = (data) => {
        const processedItems = data.orderDetails.items.map((item) => {
            const productDetails = getProductDetails(item.productId);
            return {
                ...item,
                name: productDetails?.name || "Unknown Product",
                thumbnail: productDetails?.thumbnail,
                price: productDetails?.price || 0,
                category: productDetails?.category,
                slug: productDetails?.slug,
            };
        });

        // Tính subtotal và đảm bảo không âm
        const subtotal = Math.max(
            0,
            processedItems.reduce((sum, item) => sum + item.price * Math.max(0, item.quantity), 0),
        );

        // Lấy phí vận chuyển, đảm bảo không âm
        const shippingCost = Math.max(0, data.orderDetails.shippingCost || 0);

        // Tính giảm giá nếu có
        const discount = data.orderDetails.discount || 0;
        const discountedSubtotal = Math.max(0, subtotal - discount);

        // Tính tổng và làm tròn đến 2 chữ số thập phân
        const total = Number((discountedSubtotal + shippingCost).toFixed(2));

        return {
            ...data,
            orderDetails: {
                ...data.orderDetails,
                items: processedItems,
                subtotal: Number(subtotal.toFixed(2)),
                shippingCost: Number(shippingCost.toFixed(2)),
                discount: Number(discount.toFixed(2)),
                total: total,
            },
        };
    };

    // Tách logic tìm kiếm thành hàm riêng để tái sử dụng
    const handleSearch = async (searchOrderId) => {
        if (!searchOrderId.trim()) {
            toast.error("Please enter an order number");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get("https://67a3bb0f31d0d3a6b78479f5.mockapi.io/api/v1/order");
            const order = response.data.find((order) => order.orderId === searchOrderId.trim());

            if (!order) {
                toast.error("Order not found");
                setOrderData(null);
            } else {
                const processedOrder = processOrderData(order);
                setOrderData(processedOrder);
                toast.success("Order found!");
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            toast.error("Error fetching order details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleSearch(orderId);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusStep = (status) => {
        switch (status) {
            case "pending":
            case "processing":
                return 1;
            case "shipped":
                return 2;
            case "delivered":
                return 3;
            default:
                return 1;
        }
    };

    // Thêm hàm tính ngày dự kiến giao hàng
    const calculateExpectedDelivery = (orderDate) => {
        const minDate = new Date(orderDate);
        const maxDate = new Date(orderDate);

        // Thêm 3 ngày cho thời gian giao hàng tối thiểu
        minDate.setDate(minDate.getDate() + 3);
        // Thêm 5 ngày cho thời gian giao hàng tối đa
        maxDate.setDate(maxDate.getDate() + 5);

        return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
    };

    return (
        <section className="order-tracking">
            <div className="container">
                <div className="order-tracking__header">
                    <h1 className="order-tracking__title">Track Your Order</h1>
                    <p className="order-tracking__subtitle">Enter your order number to track your order status</p>
                </div>

                <form onSubmit={handleSubmit} className="order-tracking__form">
                    <input
                        type="text"
                        className="order-tracking__input"
                        placeholder="Enter your order number"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                    <button type="submit" className="order-tracking__button" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <img
                                    src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                    alt="Loading..."
                                    className="loading-spinner"
                                />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Search size={18} />
                                Track Order
                            </>
                        )}
                    </button>
                </form>

                {orderData && (
                    <motion.div
                        className="order-tracking__result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="order-tracking__status">
                            <div className="order-tracking__status-track">
                                <div
                                    className={`order-tracking__status-line ${
                                        getStatusStep(orderData.status) >= 2 ? "active" : ""
                                    }`}
                                ></div>
                                <div
                                    className={`order-tracking__status-line ${
                                        getStatusStep(orderData.status) >= 3 ? "active" : ""
                                    }`}
                                ></div>
                                <div className="order-tracking__status-steps">
                                    <div
                                        className={`order-tracking__status-step ${
                                            getStatusStep(orderData.status) >= 1 ? "active" : ""
                                        }`}
                                    >
                                        <div className="order-tracking__status-icon">
                                            <Package size={20} />
                                        </div>
                                        <span>Processing</span>
                                    </div>
                                    <div
                                        className={`order-tracking__status-step ${
                                            getStatusStep(orderData.status) >= 2 ? "active" : ""
                                        }`}
                                    >
                                        <div className="order-tracking__status-icon">
                                            <MapPin size={20} />
                                        </div>
                                        <span>Shipped</span>
                                    </div>
                                    <div
                                        className={`order-tracking__status-step ${
                                            getStatusStep(orderData.status) >= 3 ? "active" : ""
                                        }`}
                                    >
                                        <div className="order-tracking__status-icon">
                                            <Clock size={20} />
                                        </div>
                                        <span>Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-tracking__order-info">
                            <div className="order-tracking__info-group">
                                <span className="order-tracking__label">Order Number</span>
                                <span className="order-tracking__value">{orderData.orderId}</span>
                            </div>
                            <div className="order-tracking__info-group">
                                <span className="order-tracking__label">Order Date</span>
                                <span className="order-tracking__value">{formatDate(orderData.orderDate)}</span>
                            </div>
                            <div className="order-tracking__info-group">
                                <span className="order-tracking__label">Expected Delivery</span>
                                <span className="order-tracking__value">
                                    {orderData.expectedDelivery
                                        ? formatDate(orderData.expectedDelivery)
                                        : calculateExpectedDelivery(orderData.orderDate)}
                                </span>
                            </div>
                            <div className="order-tracking__info-group">
                                <span className="order-tracking__label">Customer Name</span>
                                <span className="order-tracking__value">
                                    {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
                                </span>
                            </div>
                            <div className="order-tracking__info-group">
                                <span className="order-tracking__label">Contact</span>
                                <span className="order-tracking__value">
                                    {orderData.customerInfo.phone} | {orderData.customerInfo.email}
                                </span>
                            </div>
                        </div>

                        <div className="order-tracking__shipping">
                            <div className="order-tracking__info-group">
                                <span className="order-tracking__label">Shipping Address</span>
                                <span className="order-tracking__value">
                                    <br />
                                    {orderData.shippingAddress.apartment}
                                    <br />
                                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state}
                                    <br />
                                    {orderData.shippingAddress.postalCode}, {orderData.shippingAddress.country}
                                </span>
                            </div>
                        </div>

                        <div className="order-tracking__items">
                            <div className="order-tracking__items-header">
                                <h2 className="order-tracking__items-title">Order Items</h2>
                                <span className="order-tracking__items-count">
                                    {orderData.orderDetails.items.length} items
                                </span>
                            </div>

                            <div className="order-tracking__items-list">
                                {orderData.orderDetails.items.map((item, index) => {
                                    return (
                                        <div key={index} className="order-tracking__item">
                                            <div className="order-tracking__item-image">
                                                <Link
                                                    to={`/product/${item.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={`${process.env.REACT_APP_BASE_URL}${item.thumbnail}`}
                                                        alt={item.name}
                                                    />
                                                </Link>
                                            </div>

                                            <div className="order-tracking__item-content">
                                                <div className="order-tracking__item-category">
                                                    <div className="cart-page__item-info">
                                                        <Link
                                                            to={`/category/${(() => {
                                                                const category = categories.find(
                                                                    (cate) => cate.name === item.category,
                                                                );
                                                                return category?.slug;
                                                            })()}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="cart-page__item-category"
                                                        >
                                                            {item.category}
                                                        </Link>
                                                        <h3>
                                                            <Link
                                                                to={`/product/${item.slug}`}
                                                                className="cart-page__item-name"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
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
                                                            {formatPrice(item.price * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="order-tracking__item-specs">
                                                    <div className="order-tracking__spec">
                                                        <div className="order-tracking__spec-icon">
                                                            <Ruler size={14} />
                                                        </div>
                                                        <span className="order-tracking__spec-label">Size:</span>
                                                        <span className="order-tracking__spec-value">{item.size}</span>
                                                    </div>

                                                    <div className="order-tracking__spec">
                                                        <div className="order-tracking__spec-icon">
                                                            <Palette size={14} />
                                                        </div>
                                                        <span className="order-tracking__spec-label">Color:</span>
                                                        <span className="order-tracking__spec-value">{item.color}</span>
                                                    </div>

                                                    <div className="order-tracking__spec">
                                                        <div className="order-tracking__spec-icon">
                                                            <Package size={14} />
                                                        </div>
                                                        <span className="order-tracking__spec-label">Quantity:</span>
                                                        <span className="order-tracking__spec-value">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="order-tracking__summary">
                            <div className="order-tracking__summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(orderData.orderDetails.subtotal)}</span>
                            </div>
                            <div className="order-tracking__summary-row">
                                <span>Shipping</span>
                                <span>{formatPrice(orderData.orderDetails.shippingCost)}</span>
                            </div>
                            <div className="order-tracking__summary-row order-tracking__summary-row--total">
                                <span>Total</span>
                                <span>{formatPrice(orderData.orderDetails.total)}</span>
                            </div>
                        </div>

                        <div className="order-tracking__actions">
                            {/* <button className="order-tracking__action-btn invoice-tracking__action-btn--print">
                                <Printer size={20} />
                                Print Order
                            </button> */}
                            <Link
                                to="/categories"
                                className="order-tracking__action-btn order-tracking__action-btn--continue"
                            >
                                Continue Shopping
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
