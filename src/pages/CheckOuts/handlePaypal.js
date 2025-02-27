import axios from "axios";
import toast from "react-hot-toast";
import { handleGetAccessTokenPaypal } from "~/utils/menuHelpers";
export const handlePaypalCheckout = async ({
    total,
    calculateSubtotal,
    shippingCost,
    cartItems,
    setIsLoading,
    formData,
}) => {
    try {
        setIsLoading(true);

        // Check input data
        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        if (!formData) {
            throw new Error("Missing order information");
        }

        // Save form data to localStorage for later use
        localStorage.setItem("checkoutFormData", JSON.stringify(formData));
        // Save cart items for synchronization
        localStorage.setItem("cartCheckoutPaypal", JSON.stringify(cartItems));

        const access_token_paypal = await handleGetAccessTokenPaypal();
        if (!access_token_paypal) {
            throw new Error("Unable to connect to PayPal");
        }

        const response = await axios.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: calculateSubtotal().toFixed(2),
                                },
                                shipping: {
                                    currency_code: "USD",
                                    value: shippingCost.toFixed(2),
                                },
                            },
                        },
                        items: cartItems.map((item) => ({
                            name: `${item.name} - Size: ${item.size} - Color: ${item.color}`,
                            unit_amount: {
                                currency_code: "USD",
                                value: item.price.toFixed(2),
                            },
                            quantity: item.quantity,
                            description: `Size: ${item.size}, Color: ${item.color}`,
                        })),
                        custom_id: 123,
                    },
                ],
                application_context: {
                    return_url: `${window.location.origin}/order-paypal`,
                    cancel_url: `${window.location.origin}/order-error`,
                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token_paypal}`,
                },
            },
        );

        if (response.data.id) {
            const approvalUrl = response.data.links.find((link) => link.rel === "approve").href;
            window.location.href = approvalUrl;
        } else {
            setIsLoading(false);
            toast.error("Could not create order. Please try again!");
        }
    } catch (error) {
        setIsLoading(false);
        const errorMessage = error.message || "Payment failed. Please try again!";
        toast.error(errorMessage);
        throw error;
    }
};
