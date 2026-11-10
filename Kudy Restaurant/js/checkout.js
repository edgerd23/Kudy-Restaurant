// =========================================================
// KUDY RESTAURANT
// CHECKOUT SYSTEM
// =========================================================


// Get cart from localStorage
let cart = JSON.parse(
    localStorage.getItem("kudyCart")
) || [];


// Get elements
const checkoutItems =
    document.getElementById("checkout-items");

const emptyCheckout =
    document.getElementById("empty-checkout");

const subtotalElement =
    document.getElementById("subtotal");

const totalElement =
    document.getElementById("checkout-total");

const itemCountElement =
    document.getElementById("item-count");

const placeOrderButton =
    document.getElementById("place-order");

const checkoutForm =
    document.getElementById("checkout-form");

const orderIdInput =
    document.getElementById("order-id");

const orderTypeSelect =
    document.getElementById("order-type");

const deliveryInput =
    document.getElementById("delivery-address");

const orderError =
    document.getElementById("order-error");

const orderSuccess =
    document.getElementById("order-success");


// Orders are sent to this Formspree form
// (replace with your own checkout form URL if you create a separate one)
const FORMSPREE_ENDPOINT =
    "https://formspree.io/f/xnpnglka";


// =========================================================
// RENDER CHECKOUT
// =========================================================

function renderCheckout() {

    checkoutItems.innerHTML = "";


    // Empty cart
    if (cart.length === 0) {

        emptyCheckout.classList.add("show");

        placeOrderButton.disabled = true;

        subtotalElement.textContent = "0";

        totalElement.textContent = "0";

        itemCountElement.textContent = "0 items";

        return;
    }


    // Hide empty message
    emptyCheckout.classList.remove("show");


    // Enable button
    placeOrderButton.disabled = false;


    let subtotal = 0;

    let totalQuantity = 0;


    // Create order items
    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        subtotal += itemTotal;

        totalQuantity += item.quantity;


        const itemElement =
            document.createElement("div");


        itemElement.classList.add(
            "checkout-item"
        );


        itemElement.innerHTML = `

            <div class="checkout-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.quantity}
                    ×
                    ${item.price.toLocaleString()} Tzs
                </p>

            </div>


            <div class="checkout-item-price">

                ${itemTotal.toLocaleString()} Tzs

            </div>

        `;


        checkoutItems.appendChild(
            itemElement
        );

    });


    // Update totals
    subtotalElement.textContent =
        subtotal.toLocaleString();


    totalElement.textContent =
        subtotal.toLocaleString();


    itemCountElement.textContent =
        `${totalQuantity} ${
            totalQuantity === 1
                ? "item"
                : "items"
        }`;

}


// =========================================================
// ORDER ID  (KUDY-XXXX)
// =========================================================

function generateOrderId() {

    // No look-alike characters (0/O, 1/I)
    const chars =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 4; i++) {

        code +=
            chars[
                Math.floor(Math.random() * chars.length)
            ];

    }

    return "KUDY-" + code;

}


function getOrderId() {

    // Keep the same ID if the page is refreshed before ordering
    let id = null;

    try {

        id = sessionStorage.getItem("kudyOrderId");

    } catch (error) { }

    if (!id) {

        id = generateOrderId();

        try {

            sessionStorage.setItem("kudyOrderId", id);

        } catch (error) { }

    }

    return id;

}


orderIdInput.value = getOrderId();


// =========================================================
// ORDER TYPE  (delivery needs an address)
// =========================================================

function updateOrderType() {

    deliveryInput.required =
        orderTypeSelect.value === "Delivery";

}

orderTypeSelect.addEventListener(
    "change",
    updateOrderType
);

updateOrderType();


// =========================================================
// PLACE ORDER  (sent with Formspree)
// =========================================================

function showOrderError(message) {

    orderError.textContent = message;

    orderError.hidden = false;

}

checkoutForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (cart.length === 0) {

            return;

        }


        orderError.hidden = true;


        // Order summary as plain text for the email
        let total = 0;

        const itemsText =
            cart.map(item => {

                const lineTotal =
                    item.price * item.quantity;

                total += lineTotal;

                return `${item.quantity} x ${item.name} @ ${item.price.toLocaleString()} Tzs = ${lineTotal.toLocaleString()} Tzs`;

            }).join("\n");


        const formData =
            new FormData(checkoutForm);

        const customerName =
            String(formData.get("name") || "").trim();

        const customerPhone =
            String(formData.get("phone") || "").trim();

        // Formspree uses "email" as reply-to, so skip it when empty
        if (!String(formData.get("email") || "").trim()) {

            formData.delete("email");

        }

        formData.set("order_items", itemsText);

        formData.set("order_total", `${total.toLocaleString()} Tzs`);

        formData.set(
            "_subject",
            `New Order ${orderIdInput.value} - ${customerName}`
        );


        // Sending state
        const buttonHTML =
            placeOrderButton.innerHTML;

        placeOrderButton.disabled = true;

        placeOrderButton.textContent = "Sending order...";


        try {

            const response = await fetch(
                FORMSPREE_ENDPOINT,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            if (!response.ok) {

                throw new Error("Request failed");

            }


            // Success: clear cart + show confirmation
            const orderId = orderIdInput.value;

            localStorage.removeItem("kudyCart");

            try {

                sessionStorage.removeItem("kudyOrderId");

            } catch (error) { }

            cart = [];


            document.getElementById("success-message").textContent =
                `Thank you, ${customerName}! We have received your order and will contact you on ${customerPhone} shortly to confirm it.`;

            document.getElementById("success-order-id").textContent =
                orderId;

            checkoutForm.hidden = true;

            orderSuccess.hidden = false;

            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (error) {

            showOrderError(
                "Sorry, we could not send your order. Please check your internet connection and try again, or order on WhatsApp: +255 674 732 970."
            );

            placeOrderButton.innerHTML = buttonHTML;

            placeOrderButton.disabled = false;

        }

    }
);

// =========================================================
// INITIALIZE
// =========================================================

renderCheckout();