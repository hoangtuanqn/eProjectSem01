import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { GlobalProvider } from "./context/GlobalContext";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <>
        <BrowserRouter>
            <GlobalProvider>
                <App />
            </GlobalProvider>
        </BrowserRouter>
    </>,
);
