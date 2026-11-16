
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test('execute login flow', async ({ page }) => {
    const userName = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;

    if (!userName || !password) {
        throw new Error('user name and password must be entered.');
    }
    await page.goto('https://mern-e-commerce-front-end.vercel.app/login');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(userName);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL('https://mern-e-commerce-front-end.vercel.app/');
    
});

test.describe('API Request - Interception', () => {

    test('Verify complete billing address in first payment request', async ({ page }) => {

        const userName = process.env.TEST_USERNAME;
        const password = process.env.TEST_PASSWORD;
        const cardNumber = process.env.TEST_CARD;
        const mmyy = process.env.TEST_MMYY;
        const cvv = process.env.TEST_CVC;

        if (!userName || !password || !cardNumber || !mmyy || !cvv) {
            throw new Error('All environment variables are required');
        }

        // 1. Login
        await page.goto(
            'https://mern-e-commerce-front-end.vercel.app/login'
        );

        await page.getByRole('textbox', { name: 'Email' }).fill(userName);
        await page.getByRole('textbox', { name: 'Password' }).fill(password);

        await page.getByRole('button', { name: 'Login' }).click();

        await expect(page).toHaveURL(
            'https://mern-e-commerce-front-end.vercel.app/'
        );

        // 2. Select product
        await page.getByRole('button', { name: 'View More' }).nth(1).click();

        await expect(page).toHaveURL(/\/product\/.+/);

        // 3. Add product to cart
        await page.getByRole('button', { name: 'Add to Cart' }).click();

        await page.getByRole('button', { name: 'Go to Cart' }).click();
        await page.getByRole('button', { name: 'Checkout' }).click();

        // 4. Enter payment details
        await page.getByRole('textbox', { name: 'Email' }).fill(userName);

        await page.getByRole('textbox', { name: 'Card number' }).fill(cardNumber);

        await page.getByRole('textbox', { name: 'Expiration' }).fill(mmyy);

        await page.getByRole('textbox', {
            name: 'Credit or debit card CVC/CVV'
        }).fill(cvv);

        await page.getByRole('textbox', {
            name: 'Cardholder name'
        }).fill('adam');
    
        await page.route('https://api.stripe.com/v1/payment_methods', async (route) => {
            const request = route.request();

            const originalBody = request.postData() ?? '';

            const params = new URLSearchParams(originalBody);

        // Modify only the billing address fields
        params.set('billing_details[address][line1]', '23 random street');
        params.set('billing_details[address][city]', 'chennai');
        params.set('billing_details[address][postal_code]', '600015');
        params.set('billing_details[address][state]', 'TN');
        params.set('billing_details[address][country]', 'IN');

        // Forward the modified request to Stripe
        await route.continue({
            headers: {
                    ...request.headers(),
                    'Content-Type': 'application/x-www-form-urlencoded' 
            },
            postData: params.toString()
        });
    });
        await page.getByLabel('Country or region').selectOption('PH');
        await page.getByTestId('hosted-payment-submit-button').click();
        // 1. Wait for Stripe API response
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('https://api.stripe.com/v1/payment_methods') &&
            response.request().method() === 'POST'
        );

        // 2. Capture response
        const response = await responsePromise;
        expect(response.status()).toBe(200);

        await page.waitForTimeout(9000);
        await expect(page).toHaveURL('https://mern-e-commerce-front-end.vercel.app/dashboard/user/success');
    });

});
