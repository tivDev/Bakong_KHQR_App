// Copyright (c) 2024, tiv and contributors
// For license information, please see license.txt

frappe.ui.form.on("Bakong Payment", {
    refresh(frm) {
        render_html(frm);  
        check_transaction_by_md5();
    },
});

function render_html(frm) {
    // Define the HTML content for the QR Code section and user details
    let html_content = `
        <div class="QRWrapper">
            <div class="container d-flex justify-content-center mt-5">
                <div class="card shadow-sm" style="width: 350px; border-radius: 15px;">
                    <div class="card-header text-white text-center" style="background-color: #e60012; font-size: 20px; font-weight: bold;">
                        KHQR Payment
                    </div>
                    <p></p>
                    <div class="d-flex justify-content-center my-4" id="QRfield">
                        <button class="btn btn-lg btn-primary" id="generate-qr-btn" style="border-radius: 30px;">Create Bakong KHQR</button>
                    </div>
       
                    <div class="card-body text-center">
                        <!-- Receiver Info Section -->
                        <div class="receiver_info text-left ml-5">
                            <h5 id="user-acc"></h5>
                            <h2 id="amount"></h2>
                        </div>
                        
                        <!-- QR Code Image -->
                        <div id="qr-code" class="d-flex justify-content-center mb-4"></div>
                        
                        <!-- Scan Instruction -->
                        <p class="text-muted" style="font-size: 16px;">
                            Scan to pay using Bakong Pay
                        </p>

                        <!-- Open in App Link -->
                         <div class="qr-code-link">
                            <a href="#" class="text text-danger" id="depLink" target="_blank" style="display: none; font-size: 16px;">Open in App</a>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    `;

    // Render the HTML content inside the form's field wrapper
    frm.fields_dict["html_qr"].$wrapper.html(html_content);

    // Dynamically load the QRCode.js library for generating QR codes
    frappe.require("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js", () => {
        // Attach click event to the button to generate the QR code
        document.getElementById("generate-qr-btn").onclick = async function () {
            let data_api = await get_bakong_khqr();  // Fetch Bakong QR data from the API

            if (data_api) {
                let qr_code = data_api.qr_code;  // Extract QR code URL from the API responsez
                let deplink = data_api.deplink;  // Extract the payment link from the API response
                let user_acc = data_api.user_acc;  // Extract user account from the API response
                let amount = data_api.amount;  // Extract amount from the API response

                // Clear any existing QR code and generate a new one using jQuery
                let $qrCodeContainer = $("#qr-code");
                $qrCodeContainer.empty();

                // Generate a new QR code using the QRCode.js library
                new QRCode($qrCodeContainer[0], {
                    text: qr_code,
                    width: 200,
                    height: 200,
                    colorLight: "#ffffff",
                    colorDark: "#000000",
                });

                // Display the QR code container
                $qrCodeContainer.css("display", "block");

                // Hide the button to create QR code
                $("#QRfield").remove();

                // Update and display the 'Open in App' link
                let $depLinkElement = $("#depLink");
                $depLinkElement.attr("href", deplink);
                $depLinkElement.css("display", "inline");

                // Update the user account and amount in the UI
                $("#user-acc").text(user_acc);
                $("#amount").text(amount + " ៛");
            } else {
                console.error("Failed to fetch data from API.");  // Log error if fetching fails
            }
        };
    });
}

// Function to fetch Bakong KHQR data from the API
async function get_bakong_khqr() {
    try {
        // Make an API call to fetch the Bakong KHQR data
        let response = await frappe.call({
            method: "shop_app.api.bakong_qr_api.get_bakong_qr",
            args: {}  // Pass necessary arguments if any
        });

        if (response.message) {
            let data_api = response.message;  // Assign API response to data_api
            console.log('data_api: ', data_api);
            return data_api;  // Return the entire data_api object
        }
    } catch (error) {
        console.error("Error fetching Bakong QR:", error);  // Log error if the API call fails
    }
    return null;  // Return null if the data fetching fails
}


// Function to check transaction by MD5 hash
async function check_transaction_by_md5() {
    try {
        // Make an API call to fetch the transaction status
        const response = await fetch("https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNDZjY2NiNzRjNmYyNDU0YyJ9LCJpYXQiOjE3MzM5NzE4ODIsImV4cCI6MTc0MTc0Nzg4Mn0.bFexsmYsDLaJn08dG_iOYImsuCyJAp9PMMuCbtOkMPc"
            },
            body: JSON.stringify({
                md5: "007ac2e4780ed7adfbc9dffce25e5248"
                // md5: "81590d81d7605e70f42aec2ed09da319"
            })
        });

        const data = await response.json();
        console.log('check_transaction_by_md5: ', data);
    }
    catch (error) {
        console.error("Error fetching transaction status:", error);
    }
}

