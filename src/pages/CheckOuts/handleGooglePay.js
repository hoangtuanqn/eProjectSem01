import toast from "react-hot-toast";
import { handleOrder } from "./handleOrder";

const handleGooglePayCheckout = async ({
    total,
    calculateSubtotal,
    shippingCost,
    cartItems,
    setIsLoading,
    formData,
}) => {
    try {
        setIsLoading(true);

        const paymentsClient = new window.google.payments.api.PaymentsClient({
            environment: "TEST", // Sandbox mode
        });

        const paymentDataRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
                {
                    type: "CARD",
                    parameters: {
                        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                        allowedCardNetworks: ["VISA", "MASTERCARD"],
                    },
                    tokenizationSpecification: {
                        type: "PAYMENT_GATEWAY",
                        parameters: {
                            gateway: "example",
                            gatewayMerchantId: "exampleGatewayMerchantId",
                        },
                    },
                },
            ],
            merchantInfo: {
                merchantId: "TEST",
                merchantName: "Demo Merchant",
            },
            transactionInfo: {
                totalPriceStatus: "FINAL",
                totalPrice: total.toFixed(2),
                currencyCode: "USD",
            },
        };

        try {
            const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);

            // Add artificial delay to simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Process the order directly after successful payment
            try {
                const orderId = await handleOrder(formData, cartItems, calculateSubtotal, shippingCost, total);

                // Clear cart after successful order
                localStorage.removeItem("cart");

                // Redirect to success page
                window.location.href = `/order-success/${orderId}`;
            } catch (error) {
                console.error("Error saving order:", error);
                window.location.href = `/order-error`;
            }
        } catch (error) {
            console.error("Payment Failed", error);
            setIsLoading(false);
            toast.error("Payment failed. Please try again!");
            throw error;
        }
    } catch (error) {
        setIsLoading(false);
        throw error;
    }
};

export default handleGooglePayCheckout;
