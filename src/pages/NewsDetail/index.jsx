import React, { useEffect, useState } from "react";
import NewsDetail from "./NewsDetail";
import Breadcrumb from "~/components/Breadcrumb/Breadcrumb";
import useTitle from "~/hooks/useTitle";
import { useParams } from "react-router-dom";
import newsData from "~/data/news.json";
export default function Index() {
    useTitle("Blog Detail");
    const { slug } = useParams();

    const [article, setArticle] = useState(null);
    useEffect(() => {
        const foundArticle = newsData.find((item) => item.slug === slug);
        setArticle(foundArticle);
    }, [slug]);
    if (!article) {
        return <div>Loading...</div>;
    }
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "News", url: "/blog/news" },
        { label: `Blog Detail: ${article.name}`, url: `/blog/news/${article.slug}` },
    ];

    return (
        <>
            <main className="main">
                <Breadcrumb items={breadcrumbItems} style={{ alignItems: "flex-start" }} />

                <NewsDetail article={article} />
            </main>
        </>
    );
}
