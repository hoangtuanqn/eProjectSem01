// Import Library
import { useLayoutEffect } from "react";
// Router dom
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import "~/styles/reset.css"; // Reset css
import "~/styles/global.css"; // CSS Common

// Import Page
import Header from "~/components/Header";
import Footer from "~/components/Footer";

import HomePage from "~/pages/HomePage";
import Search from "~/pages/Search";
import Policies from "~/pages/Policies";
import NotFound from "~/pages/NotFound";
import Category from "~/pages/Category";
import Awards from "~/pages/Awards";
import SizeGuide from "~/pages/SizeGuide";
import Sitemap from "~/pages/Sitemap";
import Categories from "~/pages/Categories";
import Product from "~/pages/Product";
import Contact from "~/pages/Contact";
import Faq from "~/pages/Faq";
import AboutUs from "~/pages/AboutUs";
import Gallery from "~/pages/Gallery";
import Partners from "~/pages/Partners";
import WishList from "~/pages/WishList";
import Cart from "~/pages/Cart";
import CheckOuts from "~/pages/CheckOuts";
import OrderSuccess from "~/pages/OrderSuccess";
import OrderError from "~/pages/OrderError/OrderError";
import HandleReturnPaypal from "~/pages/CheckOuts/HandleReturnPaypal";
import Coupons from "~/pages/Coupons";
import Careers from "~/pages/Careers";
import OrderTracking from "~/pages/OrderTracking";
import News from "~/pages/News";
import NewsDetail from "~/pages/NewsDetail";
import CustomerGrowthChart from "~/pages/CustomerGrowthChart";
import RecentlyProducts from "~/pages/RecentlyProducts";

const App = () => {
    // Start: Xử lý cuộn lên đầu trang khi chuyển trang
    const location = useLocation();

    useLayoutEffect(() => {
        const smoothScroll = location.pathname.includes("/category/") ? "smooth" : "instant";
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: smoothScroll });
    }, [location.pathname]);
    // End: xử lý cuộn lên đầu trang khi chuyển trang

    return (
        <HelmetProvider>
            <Header />
            <Routes>
                {/* HomePage */}
                <Route path="/" element={<HomePage />} exact />

                {/* Trang tìm kiếm */}
                <Route path="/pages/search" element={<Search />} exact />

                {/* Trang chính sác đổi trả sản phẩm */}
                <Route path="/pages/policies" element={<Policies />} exact />

                {/* Page Contact */}
                <Route path="/pages/contact" element={<Contact />} exact />

                {/* Page FAQ */}
                <Route path="/pages/faq" element={<Faq />} exact />

                {/* Page About Us */}
                <Route path="/pages/about" element={<AboutUs />} exact />

                {/* Page Gallery */}
                <Route path="/pages/gallery/:slug" element={<Gallery />} />

                {/* Page Partners */}
                <Route path="/pages/partners" element={<Partners />} exact />

                {/* Page WishList */}
                <Route path="/pages/wishlist" element={<WishList />} exact />

                {/* Page coupons */}
                <Route path="/pages/coupons" element={<Coupons />} exact />

                {/* Page Careers */}
                <Route path="/pages/careers" element={<Careers />} exact />

                {/* Page Invoice Tracking */}
                <Route path="/pages/order-tracking" element={<OrderTracking />} exact />

                {/* Page Invoice Tracking */}
                <Route path="/pages/order-tracking/:orderId" element={<OrderTracking />} exact />

                {/* Page Awards */}
                <Route path="/pages/awards" element={<Awards />} exact />

                {/* Page Size Guide */}
                <Route path="/pages/size-guide" element={<SizeGuide />} exact />

                {/* Page Sitemap */}
                <Route path="/pages/sitemap" element={<Sitemap />} exact />

                {/* Page Customer Growth Chart */}
                <Route path="/pages/customer-growth-chart" element={<CustomerGrowthChart />} exact />

                {/* Danh mục product*/}
                <Route path="/blog/news" element={<News />} exact />

                {/* Chi tiết bài viết*/}
                <Route path="/blog/news/:slug" element={<NewsDetail />} exact />

                {/* Danh mục product*/}
                <Route path="/categories" element={<Categories />} exact />

                {/* Sản phẩm product theo từng danh mục*/}
                <Route path="/category/:slug" element={<Category />} exact />

                {/* Hiển thị 1 sản phẩm */}
                <Route path="/product/:slug" element={<Product />} exact />

                {/* Trang giỏ hàng */}
                <Route path="/cart" element={<Cart />} exact />

                {/* Trang giỏ hàng */}
                <Route path="/order-success/:order" element={<OrderSuccess />} exact />

                {/* Trang giỏ hàng */}
                <Route path="/order-error" element={<OrderError />} exact />

                {/* Trang thanh toán */}
                <Route path="/checkouts" element={<CheckOuts />} exact />

                {/* Xử lý thanh toán PayPal */}
                <Route path="/order-paypal" element={<HandleReturnPaypal />} exact />

                {/* Page Error - 404 */}
                <Route path="*" element={<NotFound />} exact />

                {/* Page Recently Products */}
                <Route path="/pages/recently-products" element={<RecentlyProducts />} exact />
            </Routes>

            <Footer />
        </HelmetProvider>
    );
};

export default App;
