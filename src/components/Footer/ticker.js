// Import thư viện axios để thực hiện các HTTP requests
import axios from "axios";

// Hàm khởi tạo ticker để hiển thị thời gian và vị trí
export function initTicker() {
    // Lấy các phần tử DOM để hiển thị thời gian và vị trí
    const dateTimeElement = document.getElementById("dateTime");
    const locationElement = document.getElementById("location");

    // Hàm cập nhật ngày giờ
    function updateDateTime() {
        // Tạo đối tượng Date chứa thời gian hiện tại
        const now = new Date();

        // Cấu hình định dạng hiển thị ngày giờ
        const options = {
            weekday: "long", // Hiển thị tên đầy đủ của thứ
            year: "numeric", // Hiển thị năm dạng số
            month: "long", // Hiển thị tên đầy đủ của tháng
            day: "numeric", // Hiển thị ngày dạng số
            hour: "2-digit", // Hiển thị giờ 2 chữ số
            minute: "2-digit", // Hiển thị phút 2 chữ số
            second: "2-digit", // Hiển thị giây 2 chữ số
        };

        // Cập nhật nội dung hiển thị với định dạng ngày giờ đã cấu hình
        dateTimeElement.textContent = now.toLocaleDateString("en-US", options);
    }

    // Hàm cập nhật vị trí
    function updateLocation() {
        // Kiểm tra trình duyệt có hỗ trợ geolocation không
        if (navigator.geolocation) {
            // Tạo button nhưng chưa thêm vào DOM
            const requestButton = document.createElement("button");
            requestButton.textContent = "📍 Request Location Access";
            requestButton.onclick = () => {
                requestButton.style.display = "none";
                requestLocationAccess();
            };

            // Hàm xử lý yêu cầu vị trí
            function requestLocationAccess() {
                navigator.geolocation.getCurrentPosition(
                    // Callback khi lấy vị trí thành công
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;

                        axios
                            .get(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                            )
                            .then(({ data }) => {
                                const city = data.address.city || data.address.town || data.address.state;
                                const country = data.address.country;
                                locationElement.textContent = `📍 ${city}, ${country}`;
                            })
                            .catch(() => {
                                locationElement.textContent = "📍 Unable to get location name. Please try again later.";
                            });
                    },
                    // Callback khi có lỗi lấy vị trí
                    (error) => {
                        // Chỉ hiện button khi người dùng từ chối cấp quyền
                        locationElement.innerHTML = "";
                        locationElement.appendChild(requestButton);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0,
                    },
                );
            }

            // Gọi hàm yêu cầu vị trí ngay khi khởi tạo
            requestLocationAccess();
        } else {
            locationElement.textContent = "📍 Geolocation is not supported";
        }
    }

    // Cập nhật lần đầu khi khởi tạo
    updateDateTime();
    updateLocation();

    // Thiết lập cập nhật định kỳ
    setInterval(updateDateTime, 1000); // Cập nhật thời gian mỗi giây
    setInterval(updateLocation, 300000); // Cập nhật vị trí mỗi 5 phút
}
