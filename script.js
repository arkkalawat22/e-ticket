const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9eI33nKf_Ig6PhHcy20_KI0mTZWB6ff5y2wJ0bui12XdPv4nlQE_31fnvqRAhZpr3yiIrvP1RnTUX/pub?output=csv";

let data = []; // เก็บข้อมูลจาก Google Sheets

async function fetchData() {
    try {
        const response = await fetch(sheetURL);
        const csvText = await response.text();
        const rows = csvText.split("\\n");
        const headers = rows[0].split(",");

        data = rows.slice(1).map(row => {
            const values = row.split(",");
            return {
                bookingNumber: values[headers.indexOf("bookingNumber")],
                phoneNumber: values[headers.indexOf("phoneNumber")],
                ticket: values[headers.indexOf("ticket")],
                fullName: values[headers.indexOf("fullName")],
                nickname: values[headers.indexOf("nickname")],
                school: values[headers.indexOf("school")],
                grade: values[headers.indexOf("grade")]
            };
        });

        console.log("Data loaded:", data);
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

fetchData(); // โหลดข้อมูลจาก Google Sheets

function searchData() {
    const query = document.getElementById("search").value.trim();
    const result = data.find(item => item.bookingNumber === query || item.phoneNumber === query);

    if (result) {
        document.getElementById("output").style.display = "block";
        document.getElementById("ticket").innerText = result.ticket || "ไม่มีข้อมูล";
        document.getElementById("fullName").innerText = result.fullName || "ไม่มีข้อมูล";
        document.getElementById("nickname").innerText = result.nickname || "ไม่มีข้อมูล";
        document.getElementById("school").innerText = result.school || "ไม่มีข้อมูล";
        document.getElementById("grade").innerText = result.grade || "ไม่มีข้อมูล";

        const qrContainer = document.getElementById("qrcode");
        qrContainer.innerHTML = ""; // ล้าง QR Code เก่า
        QRCode.toCanvas(qrContainer, result.phoneNumber, function (error) {
            if (error) console.error(error);
        });
    } else {
        alert("ไม่พบข้อมูลของคุณในระบบ");
        document.getElementById("output").style.display = "none";
    }
}

function downloadQRCode() {
    const qrCanvas = document.querySelector("#qrcode canvas");
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrCanvas.toDataURL();
    link.click();
}
