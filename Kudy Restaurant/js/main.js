// =========================================================
// KUDY RESTAURANT
// CART + CHECKOUT SYSTEM
// =========================================================


// =========================================================
// CART DATA
// =========================================================

let cart = JSON.parse(
    localStorage.getItem("kudyCart")
) || [];


// =========================================================
// GET HTML ELEMENTS
// =========================================================

const addButtons =
    document.querySelectorAll(".add-btn");

const cartBox =
    document.querySelector("aside.cart");

const cartButton =
    document.querySelector(".Cart-btn");


// =========================================================
//  CART STRUCTURE 
// =========================================================


let cartItems =
    document.querySelector(".cart-items");

if (!cartItems && cartBox) {

    cartItems =
        document.createElement("div");

    cartItems.className =
        "cart-items";

    cartBox.insertBefore(
        cartItems,
        cartBox.querySelector(".total")
    );
}


let cartTotal =
    document.querySelector(".cart-total");


// If .total exists, create the actual total number
if (!cartTotal && cartBox) {

    const totalElement =
        cartBox.querySelector(".total");

    if (totalElement) {

        totalElement.innerHTML = `
            <span>Total</span>
            <span>
                <span class="cart-total">0</span> Tzs
            </span>
        `;

        cartTotal =
            cartBox.querySelector(".cart-total");
    }
}


const cartCount =
    document.querySelector(".cart-count");

const checkoutButton =
    document.querySelector(".checkout");


// =========================================================
// SAVE CART
// =========================================================

function saveCart() {

    localStorage.setItem(
        "kudyCart",
        JSON.stringify(cart)
    );

}


// =========================================================
// ADD TO CART
// =========================================================

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.dataset.name;

        const price =
            Number(button.dataset.price);


        // Check whether item already exists
        const existingItem =
            cart.find(
                item => item.name === name
            );


        if (existingItem) {

            existingItem.quantity++;

        } else {

            cart.push({

                name: name,

                price: price,

                quantity: 1

            });

        }


        // Update everything
        updateCart();


        // Open cart automatically on desktop
       if (cartBox) {

            cartBox.classList.add(
                "cart-open"
            );

}

    });

});


// =========================================================
// UPDATE CHECKOUT BUTTON
// =========================================================

function updateCheckoutButton() {

    if (!checkoutButton) {

        return;
    }


    if (cart.length === 0) {

        // Cart empty
        checkoutButton.disabled = true;

        checkoutButton.setAttribute(
            "aria-disabled",
            "true"
        );

    } else {

        // Cart has items
        checkoutButton.disabled = false;

        checkoutButton.removeAttribute(
            "aria-disabled"
        );

    }

}


// =========================================================
// CHECKOUT BUTTON
// =========================================================

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            // Do nothing if cart is empty
            if (cart.length === 0) {

                return;

            }


            // Go to checkout page
            window.location.href =
                "checkout.html";

        }
    );

}


// =========================================================
// UPDATE CART
// =========================================================

function updateCart() {

    // Make sure cart items container exists
    if (!cartItems) {

        // Pages without a cart sidebar still show the header cart count
        if (cartCount) {

            cartCount.textContent =
                cart.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

        }

        return;

    }


    // Clear previous items
    cartItems.innerHTML = "";


    let total = 0;

    let totalQuantity = 0;


    // =====================================================
    // CREATE CART ITEMS
    // =====================================================

    cart.forEach((item, index) => {

        // Calculate price
        const itemTotal =
            item.price * item.quantity;


        total += itemTotal;

        totalQuantity += item.quantity;


        // Create item
        const cartItem =
            document.createElement("div");


        cartItem.classList.add(
            "cart-item"
        );


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h5>
                    ${item.name}
                </h5>

                <span>
                    ${item.price.toLocaleString()} Tzs
                </span>

            </div>


            <div class="cart-controls">

                <button
                    class="quantity-btn decrease"
                    data-index="${index}"
                    type="button"
                >
                    -
                </button>


                <span>
                    ${item.quantity}
                </span>


                <button
                    class="quantity-btn increase"
                    data-index="${index}"
                    type="button"
                >
                    +
                </button>


                <button
                    class="delete-btn"
                    data-index="${index}"
                    type="button"
                    aria-label="Remove ${item.name}"
                >
                    <i class="fa fa-trash"></i>
                </button>

            </div>

        `;


        cartItems.appendChild(
            cartItem
        );

    });


    // =====================================================
    // UPDATE CART COUNT
    // =====================================================

    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    // =====================================================
    // UPDATE CART TOTAL
    // =====================================================

    if (cartTotal) {

        cartTotal.textContent =
            total.toLocaleString();

    }


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cart.length === 0) {

        if (cartBox) {

            cartBox.classList.remove(
                "cart-open"
            );

        }

    }


    // =====================================================
    // SAVE
    // =====================================================

    saveCart();


    // =====================================================
    // UPDATE CHECKOUT
    // =====================================================

    updateCheckoutButton();


    // =====================================================
    // RE-ADD CART CONTROLS
    // =====================================================

    addCartControls();

}


// =========================================================
// QUANTITY + DELETE CONTROLS
// =========================================================

function addCartControls() {


    // =====================================================
    // INCREASE
    // =====================================================

    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    cart[index].quantity++;


                    updateCart();

                }
            );

        });


    // =====================================================
    // DECREASE
    // =====================================================

    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    if (
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(
                            index,
                            1
                        );

                    }


                    updateCart();

                }
            );

        });


    // =====================================================
    // DELETE
    // =====================================================

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    if (!cart[index]) {

                        return;

                    }


                    cart.splice(
                        index,
                        1
                    );


                    updateCart();

                }
            );

        });

}


// =========================================================
// CART ICON
// =========================================================

if (cartButton) {

    cartButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            // No cart sidebar on this page: open it on the menu page
            if (!cartBox) {

                window.location.href = "menu.html#cart";

                return;

            }

            cartBox.classList.toggle(
                "cart-open"
            );

        }
    );

}

// =========================================================
// CLOSE CART WHEN CLICKING OUTSIDE
// =========================================================

document.addEventListener(
    "click",
    (event) => {

        if (!cartBox) {

            return;

        }


        // Only apply this behavior on mobile
        if (window.innerWidth > 600) {

            return;

        }


        // If cart is closed, nothing to do
        if (
            !cartBox.classList.contains(
                "cart-open"
            )
        ) {

            return;

        }


        // Don't close when clicking inside cart
        if (
            cartBox.contains(event.target)
        ) {

            return;

        }


        // Don't close when clicking cart icon
        if (
            cartButton &&
            cartButton.contains(event.target)
        ) {

            return;

        }


        // Close cart
        cartBox.classList.remove(
            "cart-open"
        );

    }
);


// =========================================================
// INITIALIZE CART
// =========================================================

updateCart();


// Opened from another page's cart button (menu.html#cart)
if (cartBox && window.location.hash === "#cart") {

    cartBox.classList.add("cart-open");

}


//==========================================================
//   MOBILE HAMBURGER
//==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("mobile-nav-toggle");
    const nav = document.getElementById("main-nav");

    if (!menuToggle || !nav) return;

    const menuIcon = menuToggle.querySelector("i");

    function openMenu() {
        nav.classList.add("nav-active");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        if (menuIcon) {
            menuIcon.classList.replace("fa-bars", "fa-xmark");
        }
    }

    function closeMenu() {
        nav.classList.remove("nav-active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        if (menuIcon) {
            menuIcon.classList.replace("fa-xmark", "fa-bars");
        }
    }

    function toggleMenu() {
        const isOpen = nav.classList.contains("nav-active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.addEventListener("click", toggleMenu);

    // Close menu after clicking a navigation link
    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener("click", event => {
        if (
            !nav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Close menu using Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Reset mobile menu when switching to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 767) {
            closeMenu();
        }
    });

});