import axios from "axios";

export const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORDER${timestamp}${random}`;
};

export const handleOrder = async (formData, cartItems, calculateSubtotal, shippingCost, total) => {
    const orderId = generateOrderId();
    const orderData = {
        orderId: orderId,
        customerInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
        },
        shippingAddress: {
            address: formData.address,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
        },
        orderDetails: {
            items: cartItems.map((item) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            })),
            subtotal: calculateSubtotal(),
            shippingCost: shippingCost,
            total: total,
        },
        paymentMethod: formData.paymentMethod,
        note: formData.note,
        orderDate: new Date().toISOString(),
        status: "pending",
    };

    await axios.post("https://67a3bb0f31d0d3a6b78479f5.mockapi.io/api/v1/order", orderData);

    // Clear cart and return orderId
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart
        .filter((item) => !item.selected)
        .map(({ id, size, color, quantity, selected }) => ({
            id,
            size,
            color,
            quantity,
            selected,
        }));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return orderId;
};
