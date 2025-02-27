import React from "react";
import "~/styles/momo.css";
import axios from "axios";
// Đang phát triển bởi Tuấn Ori
export default function Momo() {
    const execPostRequest = async (url, data) => {
        try {
            // Sử dụng CORS proxy
            const corsProxy = "https://cors-anywhere.herokuapp.com/";
            const formData = new URLSearchParams(data).toString();

            const response = await axios.post(corsProxy + url, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handlePayment = async () => {
        const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        const partnerCode = "MOMOBKUN20180529";
        const accessKey = "klm05TvNBzhg7h7j";
        const secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
        const orderInfo = "Thanh toán qua MoMo";
        const amount = "10000";
        const orderId = Date.now().toString();
        const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        const extraData = "";
        const requestId = Date.now().toString();
        const requestType = "captureWallet";

        // Create raw hash for signature
        const rawHash = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        // Create HMAC SHA256 signature
        const encoder = new TextEncoder();
        const data = encoder.encode(rawHash);
        const key = encoder.encode(secretKey);
        const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
        const signature = await crypto.subtle.sign("HMAC", cryptoKey, data);
        const signatureHex = Array.from(new Uint8Array(signature))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");

        const requestData = {
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: "vi",
            extraData: extraData,
            requestType: requestType,
            signature: signatureHex,
        };

        const result = await execPostRequest(endpoint, requestData);
        if (result && result.payUrl) {
            window.location.href = result.payUrl;
        }
    };

    return (
        <>
            <div className="momo">
                <button className="btn momo__btn" onClick={handlePayment}>
                    Confirm Payment
                </button>
            </div>
        </>
    );
}
