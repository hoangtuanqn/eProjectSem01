import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, Clock, ArrowRight, Printer } from "lucide-react";
import "~/styles/order.css";
import axios from "axios";
import productData from "~/data/products.json";
import categories from "~/data/categories.json";
import { CircularProgress, Box } from "@mui/material";

export default function OrderSuccess() {
    const [order, setOrder] = useState(null);
    const { order: orderNumber } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            setIsLoading(true);
            try {
                // Fetch all orders first
                const response = await axios.get("https://67a3bb0f31d0d3a6b78479f5.mockapi.io/api/v1/order");
                // Find the order that matches the orderNumber from URL
                const orderData = response.data.find((order) => {
                    return order.orderId === orderNumber;
                });

                if (!orderData) {
                    throw new Error("Order not found");
                }

                // Đảm bảo loading hiển thị ít nhất 1.500 giây
                await new Promise((resolve) => setTimeout(resolve, 1500));

                setOrder({
                    orderNumber: orderData.orderId,
                    items: orderData.orderDetails.items.map((item) => ({
                        id: item.productId,
                        name: item.name,
                        category: productData[item.productId - 1].category,
                        thumbnail: productData[item.productId - 1].thumbnail,
                        size: item.size,
                        color: item.color,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    shippingAddress: {
                        fullName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
                        address: `${orderData.shippingAddress.apartment}`,
                        city: `${orderData.shippingAddress.city}`,
                        phone: orderData.customerInfo.phone,
                    },
                    paymentMethod: orderData.paymentMethod,
                    subtotal: orderData.orderDetails.subtotal,
                    shipping: orderData.orderDetails.shippingCost,
                    total: orderData.orderDetails.total,
                });
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (orderNumber) {
            fetchOrder();
        }
    }, [orderNumber]);

    if (isLoading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: "#2c3e50", // Hoặc màu phù hợp với theme của bạn
                    }}
                />
            </Box>
        );

    if (!order)
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="50vh"
                fontSize="1.6rem"
                color="#666"
            >
                Order information not found
            </Box>
        );

    const {
        orderNumber: orderNumberFromState,
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shipping,
        total,
    } = order;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    };

    const formatDate = (days) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handlePrint = () => {
        const printContent = `
            <html>
                <head>
                    <title>Order #${orderNumberFromState}</title>
                    <style>
                        @media print {
                            @page { margin: 2cm; }
                        }
                        body { 
                            font-family: Arial, sans-serif; 
                            line-height: 1.6; 
                            color: #333;
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        h1, h2 { 
                            color: #2c3e50;
                            margin-bottom: 15px;
                        }
                        .order-details, .order-items, .order-summary { 
                            margin-bottom: 30px;
                            padding-bottom: 20px;
                            border-bottom: 1px solid #eee;
                        }
                        .item { 
                            margin-bottom: 15px;
                            padding-bottom: 15px;
                            border-bottom: 1px solid #eee;
                        }
                        .total { 
                            font-weight: bold;
                            font-size: 1.2em;
                            margin-top: 15px;
                        }
                        .logo {
                            text-align: center;
                            margin-bottom: 30px;
                            font-size: 24px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="logo">Maverick Drew</div>
                    <h1>Order #${orderNumberFromState}</h1>
                    <div class="order-details">
                        <h2>Shipping Address</h2>
                        <p>${shippingAddress.fullName}<br>
                        ${shippingAddress.address}<br>
                        ${shippingAddress.city}<br>
                        Phone: ${shippingAddress.phone}</p>
                        <p><strong>Estimated Delivery:</strong> ${formatDate(3)} - ${formatDate(5)}</p>
                    </div>
                    <div class="order-items">
                        <h2>Order Items</h2>
                        ${items
                            .map(
                                (item) => `
                            <div class="item">
                                <p><strong>${item.name}</strong> - ${item.quantity} x ${formatPrice(item.price)}</p>
                                <p>Size: ${item.size}, Color: ${item.color}</p>
                            </div>
                        `,
                            )
                            .join("")}
                    </div>
                    <div class="order-summary">
                        <h2>Order Summary</h2>
                        <p>Subtotal: ${formatPrice(subtotal)}</p>
                        <p>Shipping: ${formatPrice(shipping)}</p>
                        <p class="total">Total: ${formatPrice(total)}</p>
                        <p><strong>Payment Method:</strong> ${
                            paymentMethod === "cod" ? "Cash on Delivery" : "Paid via PayPal"
                        }</p>
                    </div>
                </body>
            </html>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="order-success">
            <div className="container">
                <motion.div
                    className="order-success__header"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="order-success__icon">
                        <CheckCircle size={40} />
                    </div>
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you for your purchase. Your order is being processed.</p>
                    <div className="order-success__order-number">
                        Order Number:{" "}
                        <strong>
                            <Link
                                to={`/pages/order-tracking/${orderNumberFromState}`}
                                style={{ color: "currentColor" }}
                            >
                                {orderNumberFromState}
                            </Link>
                        </strong>
                    </div>
                </motion.div>

                <div className="order-success__content">
                    <motion.div
                        className="order-success__main"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="order-success__delivery">
                            <div className="order-success__section-header">
                                <Package size={24} />
                                <h2>Delivery Information</h2>
                            </div>
                            <div className="order-success__delivery-info">
                                <div className="order-success__delivery-address">
                                    <MapPin size={20} />
                                    <div>
                                        <h3>Shipping Address</h3>
                                        <p>{shippingAddress.fullName}</p>
                                        <p>{shippingAddress.address}</p>
                                        <p>{shippingAddress.city}</p>
                                        <p>Phone: {shippingAddress.phone}</p>
                                    </div>
                                </div>
                                <div className="order-success__delivery-time">
                                    <Clock size={20} />
                                    <div>
                                        <h3>Estimated Delivery</h3>
                                        <p>
                                            {formatDate(3)} - {formatDate(5)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-success__items">
                            <div className="order-success__section-header">
                                <Package size={24} />
                                <h2>Order Details</h2>
                            </div>
                            <div className="order-success__items-list">
                                {items.map((item) => {
                                    const itemProduct = productData.find((p) => p.id === item.id);
                                    const itemCategory = categories.find((c) => c.name === item.category);
                                    return (
                                        <div key={`${item.id}-${item.size}-${item.color}`} className="cart-page__item">
                                            <div className="cart-page__item-image">
                                                <Link to={`/product/${itemProduct.slug}`}>
                                                    <img
                                                        src={`${process.env.REACT_APP_BASE_URL}${item.thumbnail}`}
                                                        alt={item.name}
                                                    />
                                                </Link>
                                            </div>

                                            <div className="cart-page__item-details">
                                                <div className="cart-page__item-info">
                                                    <Link
                                                        to={`/category/${itemCategory.slug}`}
                                                        className="cart-page__item-category"
                                                    >
                                                        {item.category}
                                                    </Link>
                                                    <h3>
                                                        <Link
                                                            to={`/product/${itemProduct.slug}`}
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
                                                        <div className="cart-item__detail">
                                                            <span className="cart-item__label">Quantity:</span>
                                                            <span className="cart-item__value">{item.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <span className="cart-item__current-price">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="order-success__sidebar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="order-success__summary">
                            <h2>Order Summary</h2>
                            <div className="order-success__summary-content">
                                <div className="order-success__summary-row">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="order-success__summary-row">
                                    <span>Shipping</span>
                                    <span>{formatPrice(shipping)}</span>
                                </div>
                                <div className="order-success__summary-row order-success__summary-row--total">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                                <div className="order-success__payment">
                                    <h3>Payment Method</h3>
                                    <p>
                                        {(() => {
                                            switch (paymentMethod) {
                                                case "cod":
                                                    return "Cash on Delivery";
                                                case "paypal":
                                                    return "Paid via PayPal";
                                                case "googlepay":
                                                    return "Paid via Google Pay";
                                                default:
                                                    return "Unknown";
                                            }
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="order-success__actions">
                            <button
                                className="order-success__action-btn order-success__action-btn--print"
                                onClick={handlePrint}
                            >
                                <Printer size={20} />
                                Print Order
                            </button>
                            <Link
                                to="/categories"
                                className="order-success__action-btn order-success__action-btn--continue"
                            >
                                Continue Shopping
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
