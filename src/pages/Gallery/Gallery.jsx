import React from "react";
import { useParams } from "react-router-dom";
import Product from "./Product";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";
import SchoolEvents from "./SchoolEvents";
import SportsEvents from "./SportsEvents";

export default function Index() {
    const { slug } = useParams();
    const breadcrumbItems = [{ label: "Home", url: "/" }];
    let nameTitle = "";
    switch (slug) {
        case "product-photos":
            nameTitle = "Product Photos";
            breadcrumbItems.push({ label: "Product Photos", url: "/pages/gallery/product-photos" });
            break;
        case "school-events":
            nameTitle = "School Events";
            breadcrumbItems.push({ label: "School Events", url: "/pages/gallery/school-events" });
            break;
        case "sports-events":
            nameTitle = "Sports Events";
            breadcrumbItems.push({ label: "Sports Events", url: "/pages/gallery/sports-events" });
            break;
        default:
            nameTitle = "Gallery";
            breadcrumbItems.push({ label: "Gallery", url: "/pages/gallery" });
            break;
    }

    useTitle(nameTitle);

    return (
        <>
            <main className="main">
                <Breadcrumb title={nameTitle} items={breadcrumbItems} />

                {slug === "product-photos" && <Product />}
                {slug === "school-events" && <SchoolEvents />}
                {slug === "sports-events" && <SportsEvents />}
            </main>
        </>
    );
}
