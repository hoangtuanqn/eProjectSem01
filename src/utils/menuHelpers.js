// Hàm mở menu/search chung
export const openMenu = (target) => {
    if (target.current) {
        target.current.classList.add("active");
        document.body.style.overflow = "hidden"; // Ngăn cuộn trang
    }
};

// Hàm đóng menu/search với animation
export const closeWithAnimation = (target) => {
    if (target.current) {
        target.current.classList.add("closing");
        document.body.style.overflow = ""; // Reset overflow ngay lập tức
        setTimeout(() => {
            if (target.current) {
                target.current.classList.remove("active", "closing");
            }
        }, 500);
    }
};

// Hàm xử lý đóng khi click outside
export const handleClickOutside = (e, target, closeCallback) => {
    if (target.current && e.target === target.current) {
        closeCallback();
    }
};

// Hàm xử lý đóng menu khác trước khi mở menu mới
export const toggleSubmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const menuItem = e.currentTarget.closest("li");
    if (!menuItem) return;

    const parentUl = menuItem.closest("ul");

    // Đóng tất cả submenu cùng cấp
    const siblings = parentUl.children;
    Array.from(siblings).forEach((sibling) => {
        if (sibling !== menuItem) {
            sibling.classList.remove("active");
        }
    });

    // Toggle active class cho menu item hiện tại
    menuItem.classList.toggle("active");
};

// Lấy access token paypal
export const handleGetAccessTokenPaypal = async () => {
    const url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";

    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-Language": "en_US",
            Authorization:
                "Basic " + btoa(process.env.REACT_APP_PAYPAL_CLIENT_ID + ":" + process.env.REACT_APP_PAYPAL_SECRET_ID), // Cung cấp thông tin xác thực Base64
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    };

    // Gửi yêu cầu fetch
    const response = await fetch(url, options); // Sử dụng await để chờ phản hồi
    const data = await response.json(); // Chờ dữ liệu JSON

    return data.access_token ?? ""; // Trả về access token
};
