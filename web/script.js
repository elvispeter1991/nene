document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Menu Logic ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle menu open/close
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Toggle icon between bars and X
        const icon = menuToggle.querySelector('i');
        if(navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // --- Smooth Scrolling & Close Mobile Menu ---
    const navLinks = document.querySelectorAll('nav a, .cta-btn');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                // Close mobile menu if open
                if(navMenu.classList.contains('active')){
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }

                const targetElement = document.getElementById(targetId.substring(1));

                if (targetElement) {
                    const headerOffset = 80; // Adjusted for mobile header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Special Offer Popup Logic ---
    const popup = document.getElementById('offerPopup');
    const closeBtn = document.querySelector('.close-popup');
    const claimBtn = document.getElementById('claimOfferBtn');

    setTimeout(() => {
        if (!sessionStorage.getItem('popupShown')) {
            popup.classList.add('show');
            sessionStorage.setItem('popupShown', 'true');
        }
    }, 1500);

    const closePopup = () => { popup.classList.remove('show'); };

    closeBtn.addEventListener('click', closePopup);

    claimBtn.addEventListener('click', () => {
        closePopup();
        const shopSection = document.getElementById('shop');
        const headerOffset = 80;
        const offsetPosition = shopSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    });

    window.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });

    // --- Razorpay Payment Gateway Integration ---
    const buyButtons = document.querySelectorAll('.buy-btn');

    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').innerText;
            const priceText = productCard.querySelector('.price').innerText.replace('$', '');
            const amountInCents = Math.round(parseFloat(priceText) * 100);

            const options = {
                "key": "rzp_test_YOUR_KEY_HERE", 
                "amount": amountInCents,
                "currency": "USD", 
                "name": "nene - Mother's Special Blend",
                "description": "Purchase: " + productName,
                "image": "https://via.placeholder.com/150/cf4f98/ffffff?text=nene",
                "handler": function (response) {
                    alert("Payment successful!\nPayment ID: " + response.razorpay_payment_id);
                },
                "prefill": {
                    "name": "Customer Name",
                    "email": "customer@example.com",
                    "contact": ""
                },
                "theme": {
                    "color": "#cf4f98"
                }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed. Reason: " + response.error.description);
            });
            rzp.open();
        });
    });
});