export function initScrollToTop() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Xử lý hiển thị/ẩn nút scroll top
    window.addEventListener("scroll", () => {
        if (window.scrollY > 200) {
            scrollToTopBtn.classList.add("show");
        } else {
            scrollToTopBtn.classList.remove("show");
        }
    });

    // Xử lý sự kiện click scroll to top
    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
