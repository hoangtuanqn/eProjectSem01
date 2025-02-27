import React from "react";
import CheckOuts from "./CheckOuts";
import useTitle from "~/hooks/useTitle";

export default function Index() {
    useTitle("Checkout");

    return (
        <>
            <main className="main2">
                <CheckOuts />
            </main>
        </>
    );
}
