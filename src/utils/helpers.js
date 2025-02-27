import productsData from "~/data/products.json";
export const calculateOriginalPrice = (finalPrice, salePercentage) => {
    if (!salePercentage) return finalPrice;
    // Ví dụ: finalPrice = 100, sale = 50%
    // => originalPrice = 100 / (1 - 0.5) = 100 / 0.5 = 200
    return Math.round(finalPrice / (1 - salePercentage / 100));
};
export const handleAddRecentProduct = (id) => {
    const recentProducts = JSON.parse(localStorage.getItem("recentProducts")) || [];
    if (productsData.find((item) => item.id === id)) {
        if (recentProducts.length > 20) {
            recentProducts.pop();
        }
        // Tìm và xóa sản phẩm cũ nếu đã tồn tại
        const existingIndex = recentProducts.findIndex((item) =>
            typeof item === "object" ? item.id === id : item === id,
        );
        if (existingIndex !== -1) {
            recentProducts.splice(existingIndex, 1);
        }
        // Thêm sản phẩm mới với timestamp
        recentProducts.unshift({
            id: id,
            timestamp: Date.now(),
        });
        localStorage.setItem("recentProducts", JSON.stringify(recentProducts));
    }
};
export const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
};
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
