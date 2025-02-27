import React from "react";
import News from "./News";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    useTitle("News");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "News", url: "/pages/news" },
    ];

    return (
        <>
            <main className="main">
                <Breadcrumb title="News" items={breadcrumbItems} />

                <News />
            </main>
        </>
    );
}
