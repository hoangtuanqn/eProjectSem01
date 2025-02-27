import React, { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import Category from "./Category";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";
import categories from "~/data/categories.json";

export default function IndexPage() {
    const { slug } = useParams();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(() => {
        // Chỉ lấy search từ location.state khi khởi tạo lần đầu
        return location.state?.searchTerm || "";
    });
    // Dùng useMemo để tính toán nameCategory
    const nameCategory = useMemo(() => {
        const category = categories.find((c) => c.slug === slug);
        return category ? category.name : slug === "all-product" ? "All Product" : "404";
    }, [slug]);

    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Categories", url: "/categories" },
        { label: nameCategory, url: `/pages/${slug}` },
    ];
    useTitle(nameCategory);

    return (
        <>
            <main className="main2">
                <Breadcrumb
                    title={searchTerm ? `Showing info for: ${searchTerm}` : nameCategory}
                    items={breadcrumbItems}
                    style={{ alignItems: "flex-start" }}
                />
                <Category nameCategory={nameCategory} />
            </main>
        </>
    );
}
