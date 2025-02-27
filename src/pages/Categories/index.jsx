import React from "react";
import Categories from "./Categories";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    useTitle("Categories");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Categories", url: "/categories" },
    ];
    return (
        <>
            <main className="main">
                <Breadcrumb title="Categories" items={breadcrumbItems} />
                <Categories />
            </main>
        </>
    );
}
