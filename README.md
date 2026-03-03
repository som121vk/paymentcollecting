# PayU Payment Website

A simple, modern, and mobile-responsive payment collection website designed to integrate with the PayU payment gateway. This project is built using pure HTML, CSS, and vanilla JavaScript and is fully compatible with static hosting services like **GitHub Pages**.

## Features

- **Responsive Design**: Beautiful interface that works seamlessly on Desktop, Tablet, and Mobile.
- **Client-Side Validation**: Ensures inputs like Full Name, 10-digit Mobile Number, and minimum amount are respected.
- **Math CAPTCHA**: A built-in robust security check to prevent bot submissions.
- **PayU Integration**: Configured to connect to PayU sandbox environments with automated SHA-512 hash sequence generation for secure form POSTing.
- **Micro-Animations**: Clean gradient background shapes and loading spinners for excellent UX.

## Folder Structure

```
/
├── index.html            # Main payment form page
├── success.html          # Success confirmation page
├── failure.html          # Failure notification page
├── README.md             # Project documentation
└── assets/
    ├── css/
    │   └── style.css     # UI styles
    └── js/
        └── script.js     # Form validation, Captcha, and PayU integration logic
```

## How to Test Locally

Since this is a static website, you can test it locally without needing a server, although using a simple local server is recommended to avoid CORS or file protocol issues with the Web Crypto API.

1. **Option A (VS Code)**: Install the "Live Server" extension, open `index.html`, and click "Go Live".
2. **Option B (Python)**: Run `python -m http.server 8000` via your terminal inside the project folder, then navigate to `http://localhost:8000`.

## How to Deploy on GitHub Pages

This project is tailored for static hosting:

1. Create a new repository on your GitHub account.
2. Push all the files (`index.html`, `assets/`, etc.) to the `main` branch of the repository.
3. In your repository on GitHub, go to **Settings** > **Pages**.
4. Under "Build and deployment", select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then click **Save**.
6. Wait a few minutes; GitHub will provide you with a live URL (e.g., `https://yourusername.github.io/repositoryname`).

## PayU Configuration (Sandbox vs Production)

By default, the script connects to the **PayU Sandbox** (`https://test.payu.in/_payment`) using widely available test credentials for learning and debugging.

### Testing in Sandbox

- The form is pre-configured with the default test `gtKFFx` Merchant Key and `eCwWELxi` Salt.
- Input any valid dummy details and submit the form.
- Upon redirection to PayU's test checkout page, you will be able to select simulated success or failure outcomes.

### Moving to Production

When you are ready to collect real payments:
1. **Change the Action URL**: In `index.html`, locate the hidden form and change `https://test.payu.in/_payment` to the production URL (`https://secure.payu.in/_payment`).
2. **Update Credentials**: In `assets/js/script.js`, replace the `PAYU_MERCHANT_KEY` and `PAYU_SALT` constants with your live credentials provided in the PayU Merchant Dashboard.

> **🚨 SECURITY WARNING**: 
> Generating the SHA-512 PayU hash on the client side via JavaScript exposes your `SALT` key to the public. This is acceptable **only** for demonstration purposes or when using Sandbox credentials. 
> 
> For **production**, you must NEVER expose your salt in client-side code. You should implement a lightweight backend API (e.g., using Node.js, Python, or PHP) to receive the form data, securely append the salt, generate the SHA-512 hash on the server, and return the hash to the frontend before submitting to PayU.
