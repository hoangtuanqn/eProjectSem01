// OrderSuccess.js
import React, { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { handleGetAccessTokenPaypal } from "~/utils/menuHelpers";
import { useNavigate } from "react-router-dom";
import { handleOrder } from "./handleOrder";
import { Box, CircularProgress } from "@mui/material";
import products from "~/data/products.json";

const OrderSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderDetails = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");
            const payerId = params.get("PayerID");

            if (!token || !payerId) {
                navigate("/order-error");
                return;
            }

            try {
                // 1. Verify PayPal payment status
                const accessToken = await handleGetAccessTokenPaypal();
                const orderResponse = await axios.get(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (orderResponse.data.status === "APPROVED") {
                    // 2. Get cart and form data from localStorage
                    let cartItems = JSON.parse(localStorage.getItem("cartCheckoutPaypal")) || [];
                    cartItems = cartItems
                        .filter((item) => item.selected)
                        .map((item) => {
                            return {
                                ...item,
                                price: (() => {
                                    const product = products.find((p) => p.id === item.id);
                                    return product.price;
                                })(),
                            };
                        });

                    const formData = JSON.parse(localStorage.getItem("checkoutFormData"));

                    if (!cartItems.length || !formData) {
                        // toast.error("Order information not found");
                        navigate("/categories");
                        return;
                    }

                    // 3. Calculate order totals
                    const calculateSubtotal = () => {
                        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
                    };
                    const shippingCost = process.env.REACT_APP_SHIPPING_COST;
                    const total = calculateSubtotal() + +shippingCost;

                    // 4. Save order to database
                    try {
                        const orderId = await handleOrder(formData, cartItems, calculateSubtotal, shippingCost, total);

                        // 5. Clear checkout data
                        localStorage.removeItem("cartCheckoutPaypal");
                        localStorage.removeItem("checkoutFormData");

                        // 6. Redirect to success page
                        navigate(`/order-success/${orderId}`);
                    } catch (error) {
                        console.error("Error saving order:", error);
                        navigate("/order-error");
                    }
                } else {
                    navigate("/order-error");
                }
            } catch (error) {
                toast.error("An error occurred while processing your payment.");
                navigate("/order-error");
            }
        };

        fetchOrderDetails();
    }, [navigate]);

    return (
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
    );
};

export default OrderSuccess;
