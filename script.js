document.addEventListener('DOMContentLoaded', () => {

    const lightboxModal = document.createElement('div');
    lightboxModal.id = 'lightbox-modal';
    lightboxModal.style.cssText = `
        display: none;
        position: fixed;
        z-index: 10000;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.85);
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `;
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = 'max-width: 90%; max-height: 80%; border-radius: 8px; border: 3px solid #fff;';
    lightboxModal.appendChild(lightboxImg);
    document.body.appendChild(lightboxModal);

    document.querySelectorAll('.menu-card img, .branch-card img, section#about img, section#home img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxModal.style.display = 'flex';
        });
    });

    lightboxModal.addEventListener('click', () => {
        lightboxModal.style.display = 'none';
    });



    const menuSearchInput = document.getElementById('menu-search-input');
    const menuSortSelect = document.getElementById('menu-sort-select');
    const menuContainer = document.querySelector('.menu-container');

    if (menuSearchInput && menuContainer) {
        menuSearchInput.addEventListener('input', filterAndSortMenu);
    }
    if (menuSortSelect && menuContainer) {
        menuSortSelect.addEventListener('change', filterAndSortMenu);
    }

    function filterAndSortMenu() {
        const query = menuSearchInput ? menuSearchInput.value.toLowerCase().trim() : '';
        const sortVal = menuSortSelect ? menuSortSelect.value : 'default';
        let cards = Array.from(document.querySelectorAll('.menu-card'));

        cards.forEach(card => {
            const title = card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '';
            if (title.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        if (sortVal !== 'default') {
            cards.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('p')?.textContent.replace(/[^0-9.]/g, '') || 0);
                const priceB = parseFloat(b.querySelector('p')?.textContent.replace(/[^0-9.]/g, '') || 0);
                return sortVal === 'low-high' ? priceA - priceB : priceB - priceA;
            });
              cards.forEach(card => menuContainer.appendChild(card));
        }
    }

    const siteSearchInput = document.getElementById('site-search');
    if (siteSearchInput) {
        siteSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const sections = document.querySelectorAll('main > section');

            sections.forEach(section => {
                const text = section.textContent.toLowerCase();
                if (!query || text.includes(query)) {
                    section.style.display = 'block';
                    section.style.opacity = '1';
                } else {
                    section.style.opacity = '0.2';
                }
            });
        });
    }

    function showNotification(msg, isError = false) {
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            background: ${isError ? '#d9534f' : '#28a745'}; color: #fff;
            padding: 12px 24px; border-radius: 25px; font-weight: bold;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 10000;
            transition: opacity 0.5s ease; text-align: center;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    function handleFormSubmit(formId, validateCallback, getSuccessMessage) {
        const formElement = document.getElementById(formId);
        if (!formElement) return;

        formElement.addEventListener('submit', (e) => {
            e.preventDefault();

            const errorMessage = validateCallback();
            if (errorMessage) {
                showNotification(errorMessage, true); // Error handling notification[cite: 12]
                return;
            }

            const successMessage = getSuccessMessage();
            showNotification(successMessage, false);
            formElement.reset();
        });
    }

    handleFormSubmit('signin-form', () => {
        const email = document.getElementById('signin-email')?.value.trim();
        const pass = document.getElementById('signin-password')?.value.trim();
        if (!email || !pass) return 'Please complete both Email and Password fields.';
        return null;
    }, () => {
        const email = document.getElementById('signin-email')?.value.trim() || '';
        const username = email.split('@')[0] || 'User';
        return `Hello, ${username.charAt(0).toUpperCase() + username.slice(1)}! Signed in successfully.`;
    });

    handleFormSubmit('register-form', () => {
        const name = document.getElementById('reg-name')?.value.trim();
        const surname = document.getElementById('reg-surname')?.value.trim();
        const email = document.getElementById('reg-email')?.value.trim();
        const pass = document.getElementById('reg-password')?.value.trim();
        const verify = document.getElementById('verify-check')?.checked;

        if (!name || !surname || !email || !pass) return 'Please fill in all registration fields.';
        if (!verify) return 'Please check the identity verification box.';
        return null;
    }, () => {
        const name = document.getElementById('reg-name')?.value.trim() || 'User';
        return `Hello, ${name}! Registration successful. Welcome to Kota Joe!`;
    });

    handleFormSubmit('order-form', () => {
        const agree = document.getElementById('agree-check')?.checked;
        const holder = document.getElementById('card-holder')?.value.trim();
        const number = document.getElementById('card-number')?.value.trim();
        const expiry = document.getElementById('expiry')?.value.trim();
        const cvv = document.getElementById('cvv')?.value.trim();
        const pass = document.getElementById('verify-password')?.value.trim();

        if (!agree) return 'You must check "I agree to Continue" before ordering.';
        if (!holder || !number || !expiry || !cvv || !pass) return 'Please complete all card details and password fields.';
        if (number.length !== 16 || isNaN(number)) return 'Card number must be exactly 16 digits.';
        if (cvv.length !== 3 || isNaN(cvv)) return 'CVV must be 3 digits.';
        return null;
    }, () => {
        const holder = document.getElementById('card-holder')?.value.trim() || 'Customer';
        return `Thank you, ${holder}! Card details validated and order placed successfully.`;
    });

    document.querySelectorAll('nav a[href^="#"], a[href="#menu"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});