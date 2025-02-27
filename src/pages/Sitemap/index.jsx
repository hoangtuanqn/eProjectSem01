import React from "react";
import Sitemap from "./Sitemap";
import useTitle from "~/hooks/useTitle";
import Breadcrumb from "~/components/Breadcrumb";
export default function Index() {
    useTitle("Sitemap");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Sitemap", url: "/pages/sitemap" },
    ];
    return (
        <>
            <main className="main2">
                <Breadcrumb title="" items={breadcrumbItems} style={{ alignItems: "flex-start" }} />
                <Sitemap />
            </main>
        </>
    );
}
