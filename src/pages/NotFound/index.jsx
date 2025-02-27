import React from "react";
import NotFound from "./NotFound";
import useTitle from "~/hooks/useTitle";
export default function Index() {
    useTitle("404 Not Found");
    return (
        <>
            <main className="main">
                <NotFound />
            </main>
        </>
    );
}
