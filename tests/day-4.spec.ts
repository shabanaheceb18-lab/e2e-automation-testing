import {test, expect} from '@playwright/test';

test('intercept post API method heroku app', async ({request}) => {
    const requestBody: any = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    }
    const response = await request.post('https://restful-booker.herokuapp.com/booking',
        {headers: {'Content-Type': 'application/json'},
        data: requestBody})
    console.log(await response.status());
});
test('intercept post API method myStore app', async ({request}) => {
    const params = new URLSearchParams({
    type: 'card',
    "card[number]" : "4111111111111111",
    "card[exp_month]" : "12",
    "card[exp_year]" : "30",
    "card[cvc]" : "123",
    "billing_details[name]" : "adam",
    "billing_details[email]" : "adam@gmail.com",
    "billing_details[address][line1]" : "123 west lane",
    "billing_details[address][city]" : "iwana",
    "billing_details[address][postal_code]" : "12345",
    "billing_details[address][state]" : "Abra",
    "billing_details[address][country]" : "IN",
    "guid":"60526223-f861-464a-8c46-d4d80539c0798296d7",
    "muid":"e238ef06-8c0a-4df5-9c09-f3dc3bfa18315b52b6",
    "sid":"79ffe56d-5fcc-4fa2-9b90-4a0d76ecf02a27259a",
    "key":"pk_test_51No9HkSEbzj26ICpC5LD4VhE4Y4eVZiYo4HwjMlitEnQAptAxJWazvYJ9EWWrwwS29xKGWMu3ajuUWZAlHTgnelw00booOCeAV",
    "payment_user_agent":"stripe.js%2F334e88f07c%3B+stripe-js-v3%2F334e88f07c%3B+checkout",
    "client_attribution_metadata[client_session_id]":"2d679a86-8431-4e95-836f-7954825bb174",
    "client_attribution_metadata[checkout_session_id]":"cs_test_a03cJRnbstiCkvcFVKAr5IKlMX81sNkMBwfdb8wbOWZquOAhiScD4UQbv3",
    "client_attribution_metadata[merchant_integration_source]":"checkout",
    "client_attribution_metadata[merchant_integration_version]":"hosted_checkout",
    "client_attribution_metadata[payment_method_selection_flow]":"merchant_specified",
    "client_attribution_metadata[checkout_config_id]":"3fcbe02b-820f-4706-8a08-65d4d8ae93b6"
    })
    const response = await request.post('https://api.stripe.com/v1/payment_methods',
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: params.toString()})
    console.log(await response.status());
    console.log('Response:', await response.json());
});