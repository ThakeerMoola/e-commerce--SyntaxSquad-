// Query selectors for elements
let searchForm = document.querySelector('.search-form');
let shoppingCart = document.querySelector('.shoooping-cart');
let loginForm = document.querySelector('.login-form');
let registerForm = document.querySelector('.register-form');
let Navbar = document.querySelector('.navbar');

// Toggle search form
document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    Navbar.classList.remove('active');
};

// Toggle shopping cart
document.querySelector('#cart-btn').onclick = () => {
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    Navbar.classList.remove('active');
};

// Toggle login form
document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    registerForm.classList.remove('active');
    Navbar.classList.remove('active');
};

// Toggle navbar menu
document.querySelector('#menu-btn').onclick = () => {
    Navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
};

// Close all forms on scroll
window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    Navbar.classList.remove('active');
};

// Swiper for product slider
var swiper = new Swiper(".product-slider", {
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1020: {
            slidesPerView: 3,
        },
    },
});

// Swiper for review slider
var swiper = new Swiper(".review-slider", {
    loop: true,
    spaceBetween: 30,
    autoplay: {
        delay: 7500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1020: {
            slidesPerView: 3,
        },
    },
});

// Cart functionality
let cart = [];

// Function to add a product to the cart
function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

// Function to remove a product from the cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartUI();
}

// Function to calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
}

// Function to update the cart UI
function updateCartUI() {
    const cartContainer = document.querySelector('.shoooping-cart');
    cartContainer.innerHTML = ''; // Clear existing items

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'box';
        cartItem.innerHTML = `
            <i class="fas fa-trash" onclick="removeFromCart('${item.name}')"></i>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <span class="price">R${item.price.toFixed(2)}</span>
                <span class="quantity">qty: ${item.quantity}</span>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'total';
    totalElement.textContent = `Total: R${calculateTotal()}`;
    cartContainer.appendChild(totalElement);

    const checkoutButton = document.createElement('a');
    checkoutButton.href = '#';
    checkoutButton.className = 'btn';
    checkoutButton.textContent = 'Checkout';
    cartContainer.appendChild(checkoutButton);
}

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        const productElement = this.closest('.swiper-slide');
        const product = {
            name: productElement.querySelector('h3').textContent,
            price: parseFloat(productElement.querySelector('.price').textContent.split('/')[0].replace('R', '').trim()),
            image: productElement.querySelector('img').src,
        };

        addToCart(product);
    });
});

// Register functionality
document.addEventListener('DOMContentLoaded', function () {
    // Switch to Register form
    document.querySelector('#register-link').addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    // Switch to Login form
    document.querySelector('#login-link').addEventListener('click', function (e) {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Handle form submission (optional: add your own backend logic)
    document.querySelector('.register-form').addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const name = document.querySelector('.register-form input[placeholder="Your name"]').value;
        const surname = document.querySelector('.register-form input[placeholder="Your surname"]').value;
        const username = document.querySelector('.register-form input[placeholder="Your username"]').value;
        const phone = document.querySelector('.register-form input[placeholder="Your phone number"]').value;
        const email = document.querySelector('.register-form input[placeholder="Your email"]').value;
        const password = document.querySelector('.register-form input[placeholder="Your password"]').value;

        console.log('Registering user:', { name, surname, username, phone, email, password });

        alert('Registration successful!');
    });
});


// script.js
document.getElementById('adminLoginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const adminUsername = document.getElementById('adminUsername').value;
    const adminPassword = document.getElementById('adminPassword').value;
  
    const response = await fetch('/login-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminUsername,
        adminPassword,
      }),
    });
  
    const result = await response.text();
    alert(result);
  });
  

  