// Import Component
import { useEffect } from "react";
import useTitle from "~/hooks/useTitle";

import Hero from "./Hero";
import BestSales from "./BestSales";
import BrandLogos from "./BrandLogos";
import CategoryHighlights from "./CategoryHighlights";
import FeaturedProducts from "./FeaturedProducts";
import Marquee from "./Marquee";
import VideoPromo from "./VideoPromo";
import Testimonial from "./Testimonial";
import BlogPosts from "./BlogPosts";

// Library
// AOS
import AOS from "aos";
import "aos/dist/aos.css"; // Import file CSS của AOS

const App = () => {
    useTitle("Home");
    useEffect(() => {
        AOS.init({
            duration: 1500,
            anchorPlacement: "top-bottom",
            once: true,
        });
    }, []);
    return (
        <>
            {/* Main Content */}
            <main className="main">
                <Hero />
                <CategoryHighlights />
                <FeaturedProducts />
                <Marquee />
                <BestSales />
                <BrandLogos />
                <VideoPromo />
                <Testimonial />
                <BlogPosts />
            </main>
        </>
    );
};

export default App;
