# BudPay React Library

The BudPay React Library provides three methods for integrating BudPay's payment solution into your React applications. This library allows you to initiate payment modals using any of the following integration methods:

- `BudPayButton`
- `useBudPayPayment`
- `useBudPayAccessCode`

## Installation

To install the BudPay React Library, use npm or yarn:

### Using npm

```bash
npm install budpay-react-v3
```


### 1. `BudPayButton`

The `BudPayButton` component is a ready-to-use button that triggers the BudPay payment modal when clicked.

#### Parameters

| Parameter      | Type        | Required | Description                                                                                       |
|----------------|-------------|----------|---------------------------------------------------------------------------------------------------|
| `api_key`      | `string`    | Yes      | Your BudPay API Key, e.g., `"pk_test_1234567890"`                                                  |
| `amount`       | `number`    | Yes      | Amount to charge, e.g., `1000`                                                                     |
| `currency`     | `string`    | Yes      | Currency to charge in, e.g., `"NGN"`                                                               |
| `reference`    | `string`    | No       | Unique reference for the transaction, e.g., `"BUD_1234567890"`                                     |
| `customer`     | `object`    | Yes      | Customer details including `email`, `first_name`, `last_name`, and `phone`.                        |
| `callback_url` | `string`    | No       | URL to redirect to after payment, e.g., `"https://yourwebsite.com/callback"`                       |
| `onComplete`   | `function`  | No       | Callback function to execute after payment is successful, e.g., `(response) => { console.log(response) }` |
| `onCancel`     | `function`  | No       | Callback function to execute after payment is cancelled, e.g., `(response) => { console.log(response) }`   |
| `custom_fields`| `object`    | No       | Custom fields to include in the transaction, e.g., `{ custom_field_1: "value1", custom_field_2: "value2" }` |
| `debug`        | `boolean`   | No       | Enables debug mode, e.g., `true`                                                                    |
| `text`         | `string`    | No       | The text to display on the button, e.g., `"Pay with BudPay"`                                       |
| `className`    | `string`    | No       | CSS class name for the button styling, e.g., `"btn btn-primary"`                                   |
| `disabled`     | `boolean`   | No       | Disable the button, e.g., `false`                                                                  |
| `children`     | `ReactNode` | No       | Content to be rendered within the button.                                                          |


#### Example Usage

```javascript copy
import React from 'react';
import { BudPayButton } from 'budpay-react-v3';

const config = {
    api_key: "pk_test_1234567890",
    amount: 1000,
    currency: "NGN",
    reference: "BUD_1234567890", // This is auto-generated, if not provided
    customer: {
        email: "johndoe@example.com",
        first_name: "John",
        last_name: "Doe",
        phone: "08012345678"
    },
    callback_url: "https://yourwebsite.com/callback", // If callback_url is not provided, the onComplete function is called (if provided)
    onComplete: (data) => { 
        console.log('Payment completed, Status:', data.status) 
        console.log('Payment completed, Reference:', data.reference) 
    },
    onCancel: (data) => { 
        console.log('Payment cancelled, Status:', data.status) 
        console.log('Payment cancelled, Reference:', data.reference) 
    },
    custom_fields: { custom_field_1: "value1", custom_field_2: "value2" },
    debug: true // Show the debug modal to help you pass the right config
}


const buttonConfig = {
    ...config,
    text="Pay with BudPay",
    className="btn btn-primary"
}


const App = () => (
    <BudPayButton {...buttonConfig} />
);

export default App;
```


### 2. `useBudPayPayment`

The `useBudPayPayment` hook allows you to initiate a payment modal using your BudPay API key directly within your React components.

#### Parameters

| Parameter      | Type        | Required | Description                                                                                       |
|----------------|-------------|----------|---------------------------------------------------------------------------------------------------|
| `api_key`      | `string`    | Yes      | Your BudPay API Key, e.g., `"pk_test_1234567890"`                                                  |
| `amount`       | `number`    | Yes      | Amount to charge, e.g., `1000`                                                                     |
| `currency`     | `string`    | Yes      | Currency to charge in, e.g., `"NGN"`                                                               |
| `reference`    | `string`    | No       | Unique reference for the transaction, e.g., `"BUD_1234567890"`                                     |
| `customer`     | `object`    | Yes      | Customer details including `email`, `first_name`, `last_name`, and `phone`.                        |
| `callback_url` | `string`    | No       | URL to redirect to after payment, e.g., `"https://yourwebsite.com/callback"`                       |
| `onComplete`   | `function`  | No       | Callback function to execute after payment is successful. It receives a `response` object with `reference` and `status`. Example: `(response) => { console.log(response) }` |
| `onCancel`     | `function`  | No       | Callback function to execute after payment is cancelled. It receives a `response` object with `reference` and `status`. Example: `(response) => { console.log(response) }`   |
| `custom_fields`| `object`    | No       | Custom fields to include in the transaction, e.g., `{ custom_field_1: "value1", custom_field_2: "value2" }` |
| `debug`        | `boolean`   | No       | Enables debug mode, e.g., `true`                                                                    |

#### Example Usage

```javascript copy
import React from 'react';
import { useBudPayPayment } from 'budpay-react-v3';

const initiateBudPayPayment = useBudPayPayment({
    api_key: "pk_test_1234567890",
    amount: 1000,
    currency: "NGN",
    reference: "BUD_1234567890", // This is auto-generated, if not provided
    customer: {
        email: "johndoe@example.com",
        first_name: "John",
        last_name: "Doe",
        phone: "08012345678"
    },
    callback_url: "https://yourwebsite.com/callback", // If callback_url is not provided, the onComplete function is called (if provided)
    onComplete: (data) => { 
        console.log('Payment completed, Status:', data.status) 
        console.log('Payment completed, Reference:', data.reference) 
    },
    onCancel: (data) => { 
        console.log('Payment cancelled, Status:', data.status) 
        console.log('Payment cancelled, Reference:', data.reference) 
    },
    custom_fields: { custom_field_1: "value1", custom_field_2: "value2" },
    debug: true // Show the debug modal to help you pass the right config
})

const App = () => (
    <button onClick={initiateBudPayPayment}>Pay with BudPay</button>
);

export default App;
```


### 3. `useBudPayAccessCode`

The `useBudPayAccessCode` hook allows you to initiate a payment modal using an access code and reference obtained from the BudPay API.

#### Parameters

| Parameter      | Type        | Required | Description                                                                                       |
|----------------|-------------|----------|---------------------------------------------------------------------------------------------------|
| `access_code`  | `string`    | Yes      | Your BudPay access code, obtained from the BudPay API                                              |
| `reference`    | `string`    | Yes      | Unique reference for the transaction, e.g., `"BUD_1234567890"`                                     |
| `callback_url` | `string`    | No       | URL to redirect to after payment, e.g., `"https://yourwebsite.com/callback"`                       |
| `onComplete`   | `function`  | No       | Callback function to execute after payment is successful. It receives a `response` object with `reference` and `status`. Example: `(response) => { console.log(response) }` |
| `onCancel`     | `function`  | No       | Callback function to execute after payment is cancelled. It receives a `response` object with `reference` and `status`. Example: `(response) => { console.log(response) }`   |
| `debug`        | `boolean`   | No       | Enables debug mode, e.g., `true`                                                                    |



### Obtaining Access Code and Reference

To obtain the access code and reference, make a CURL request to the BudPay API:


#### Example cURL Request

```bash copy
curl https://api.budpay.com/api/v2/transaction/initialize \
-H "Authorization: Bearer YOUR_SECRET_KEY" \
-H "Content-Type: application/json" \
-d '{ "email": "customer@email.com", "amount": "20000", "callback": "yourcallbackurl" }' \
-X POST
```


#### Example cURL Response

```json copy
{
  "status": true,
  "message": "Authorization URL created",
  "data": {
    "authorization_url": "https://www.budpay.com/checkout/wp5goiyvc1pt",
    "access_code": "wp5goiyvc1pt",
    "reference": "REF_61e469c330c2bc"
  }
}
```


#### Example Usage

```javascript copy
import React from 'react';
import { useBudPayAccessCode } from 'budpay-react-v3';

const MyComponent = () => {
    const initiatePayment = useBudPayAccessCode({
        access_code: "your-access-code",
        reference: "your-reference",
        callback_url: "https://your-callback-url.com", // if callback is not passed, in the API Endpoint, it will redirect to callback_url (if provided), else call the onComplete function
        onComplete: (data) => { 
            console.log('Payment completed, Status:', data.status) 
            console.log('Payment completed, Reference:', data.reference) 
        },
        onCancel: (data) => { 
            console.log('Payment cancelled, Status:', data.status) 
            console.log('Payment cancelled, Reference:', data.reference) 
        },
        debug: true
    });

    return (
        <button onClick={initiatePayment}>
            Pay with BudPay
        </button>
    );
};

export default MyComponent;
```


### 4. `closePaymentModal`

The `closePaymentModal` function allows you to programmatically close the BudPay payment modal if it is open.

#### Example Usage

**1. Automatic Closure After 20 Seconds**

Automatically close the payment modal after 20 seconds:

```javascript copy
import React, { useEffect } from 'react';
import { closePaymentModal } from 'budpay-react-v3';

const MyComponent = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            closePaymentModal();
        }, 20000); // 20 seconds

        return () => clearTimeout(timer);
    }, []);

    return <p>The payment modal will close automatically after 20 seconds.</p>;
};

export default MyComponent;
```


#### Another Example Usage

```javascript copy
import React from 'react';
import { useBudPayPayment, closePaymentModal } from 'budpay-react-v3';

const MyComponent = () => {
    const initiatePayment = useBudPayPayment({
        api_key: "pk_test_1234567890",
        amount: 1000,
        currency: "NGN",
        customer: {
            email: "johndoe@example.com",
            first_name: "John",
            last_name: "Doe",
            phone: "08012345678"
        },
        onComplete: () => {
            closePaymentModal();
        },
        onCancel: () => {
            closePaymentModal();
        }
    });

    return (
        <button onClick={initiatePayment}>
            Pay with BudPay
        </button>
    );
};

export default MyComponent;
```

## Last Updated
This documentation was last updated on August 20, 2024.
Version: 2.0.1