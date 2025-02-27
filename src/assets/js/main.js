import { toggleSubmenu } from "~/utils/menuHelpers";

export function initMobileMenu() {
    try {
        const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
        const mobileMenu = document.querySelector(".mobile-menu");
        const mobileMenuClose = document.querySelector(".mobile-menu__close");
        const menuLinks = document.querySelectorAll(".mobile-menu__link[data-submenu]");

        // Kiểm tra xem các elements cần thiết có tồn tại không
        if (!mobileMenuToggle || !mobileMenu || !mobileMenuClose) {
            console.warn("Mobile menu elements not found");
            return;
        }

        // Hàm mở/đóng menu
        function toggleMenu() {
            if (!mobileMenu.classList.contains("active")) {
                // Mở menu
                mobileMenu.classList.add("active");
                document.body.style.overflow = "hidden";
            } else {
                // Đóng menu với animation
                closeMenuWithAnimation();
            }
        }

        // Hàm đóng menu với animation
        function closeMenuWithAnimation() {
            mobileMenu.classList.add("closing");
            setTimeout(() => {
                mobileMenu.classList.remove("active", "closing");
                document.body.style.overflow = "";
            }, 500);
        }

        // Cleanup function để remove event listeners
        const cleanup = () => {
            mobileMenuToggle.removeEventListener("click", toggleMenu);
            mobileMenuClose.removeEventListener("click", closeMenuWithAnimation);
            mobileMenu.removeEventListener("click", handleOverlayClick);
            menuLinks.forEach((link) => {
                link.removeEventListener("click", toggleSubmenu);
            });
        };

        // Handler cho click vào overlay
        const handleOverlayClick = (e) => {
            if (e.target === mobileMenu) {
                closeMenuWithAnimation();
            }
        };

        // Cleanup trước khi thêm listeners mới
        cleanup();

        // Thêm event listeners
        mobileMenuToggle.addEventListener("click", toggleMenu);
        mobileMenuClose.addEventListener("click", closeMenuWithAnimation);
        mobileMenu.addEventListener("click", handleOverlayClick);
        menuLinks.forEach((link) => {
            link.addEventListener("click", toggleSubmenu);
        });

        return cleanup;
    } catch (error) {
        console.error("Error initializing mobile menu:", error);
    }
}
