// PayU Configuration
// NOTE: For security reasons, NEVER expose production Salt on client-side JS.
// Always use dynamic server generation. Since this is a static GitHub Pages example,
// we are using sandbox credentials intended for testing ONLY.

// Sandbox Credentials (replace with your own if needed)
const PAYU_MERCHANT_KEY = '2tDOZI';
const PAYU_SALT = '3SyyMLG8xgypOWXYyjb3GpWbH3hxMq33';

// State for Math Captcha
let expectedCaptchaResult = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Generate Initial Captcha
    generateCaptcha();

    // Attach Event Listeners
    const form = document.getElementById('uiPaymentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Clear errors on input
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', function () {
            this.closest('.form-group').classList.remove('has-error');
        });
    });
});

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    expectedCaptchaResult = num1 + num2;
    const qElement = document.getElementById('captchaQuestion');
    if (qElement) qElement.textContent = `${num1} + ${num2} =`;
    const aElement = document.getElementById('captchaAnswer');
    if (aElement) aElement.value = '';
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // Fields
    const nameInput = document.getElementById('fullName');
    const mobileInput = document.getElementById('mobileNumber');
    const amountInput = document.getElementById('amount');
    const captchaInput = document.getElementById('captchaAnswer');

    let isValid = true;

    // 1. Validate Form Fields
    if (!nameInput.value.trim()) {
        showError(nameInput);
        isValid = false;
    }

    if (!/^[0-9]{10}$/.test(mobileInput.value.trim())) {
        showError(mobileInput);
        isValid = false;
    }

    if (parseFloat(amountInput.value) < 1 || isNaN(amountInput.value)) {
        showError(amountInput);
        isValid = false;
    }

    if (parseInt(captchaInput.value, 10) !== expectedCaptchaResult) {
        showError(captchaInput);
        generateCaptcha(); // Regenerate on failure
        isValid = false;
    }

    if (!isValid) return;

    // 2. Prepare Data for PayU
    setLoading(true);

    try {
        const txnid = generateTxnId();
        const amount = parseFloat(amountInput.value).toFixed(2);
        const firstname = nameInput.value.trim();
        const phone = mobileInput.value.trim();
        const productinfo = "Payment Collection";
        const email = `dummy_${phone}@example.com`; // Generate dummy if not requested by user

        // Calculate dynamic URLs based on current location (handles GitHub pages properly)
        // Ensure URLs end smoothly
        let baseUrl = window.location.href.split('/').slice(0, -1).join('/');
        if (!baseUrl) baseUrl = window.location.origin; // fallback

        const surl = `${baseUrl}/success.html`;
        const furl = `${baseUrl}/failure.html`;

        // The hash sequence required by PayU:
        // key|txnid|amount|productinfo|firstname|email|||||||||||salt
        const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;

        // Calculate SHA-512 Hash
        const hash = await calculateSHA512(hashString);

        // Populate hidden form
        document.getElementById('payu_key').value = PAYU_MERCHANT_KEY;
        document.getElementById('payu_txnid').value = txnid;
        document.getElementById('payu_amount').value = amount;
        document.getElementById('payu_productinfo').value = productinfo;
        document.getElementById('payu_firstname').value = firstname;
        document.getElementById('payu_email').value = email;
        document.getElementById('payu_phone').value = phone;
        document.getElementById('payu_surl').value = surl;
        document.getElementById('payu_furl').value = furl;
        document.getElementById('payu_hash').value = hash;

        // Auto Submit the hidden form to PayU gateway
        document.getElementById('payuForm').submit();

    } catch (error) {
        console.error("Payment preparation failed: ", error);
        alert("An error occurred preparing your payment. Please try again.");
        setLoading(false);
    }
}

function showError(inputElement) {
    inputElement.closest('.form-group').classList.add('has-error');
}

function setLoading(isLoading) {
    const btnText = document.querySelector('.btn-text');
    const spinner = document.querySelector('.spinner');
    const btn = document.getElementById('submitBtn');

    if (isLoading) {
        btnText.textContent = "Processing...";
        spinner.style.display = "block";
        btn.disabled = true;
    } else {
        btnText.textContent = "Proceed to Pay";
        spinner.style.display = "none";
        btn.disabled = false;
    }
}

function generateTxnId() {
    // Generate unique transaction ID, max 25 chars.
    const dateStr = new Date().getTime().toString();
    const randomStr = Math.floor(Math.random() * 10000).toString();
    return 'TXN' + dateStr + randomStr;
}

// Cryptographic hash function using Web Crypto API
async function calculateSHA512(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert bytes to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
