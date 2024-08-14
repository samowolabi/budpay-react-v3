import { openSVGLoaderFunc, closeSVGLoaderFunc, appendQueryParams } from "../helpers/helpers";
import { libraryConfig } from "./config";
import { BudPayPaymentConfig } from "../types/types";

interface InitiateBudPayPaymentConfig extends BudPayPaymentConfig {
    status: boolean
    type: 'merchant_integration';
}

export default function useBudPayPayment(config: BudPayPaymentConfig) {

    // Create Validate config function, with the following checks:
    const validateConfig = () => {
        let errors = [];

        if (!config.key) {
            errors.push("key is required");
        }
        if (!config.amount) {
            errors.push("amount is required");
        }
        if (!config.currency) {
            errors.push("currency is required");
        }
        if (!config.email) {
            errors.push("email is required");
        }
        if (typeof config.amount !== "number") {
            errors.push("amount must be a number");
        }
        if (typeof config.currency !== "string") {
            errors.push("currency must be a string");
        }
        if (typeof config.email !== "string") {
            errors.push("email must be a string");
        }
        if (config.reference && typeof config.reference !== "string") {
            errors.push("reference must be a string");
        }
        if (config.first_name && typeof config.first_name !== "string") {
            errors.push("first_name must be a string");
        }
        if (config.last_name && typeof config.last_name !== "string") {
            errors.push("last_name must be a string");
        }
        if (config.phone && typeof config.phone !== "string") {
            errors.push("phone must be a string");
        }
        if (config.callback_url && typeof config.callback_url !== "string") {
            errors.push("callback_url must be a string");
        }
        if (config.callback && typeof config.callback !== "function") {
            errors.push("callback must be a function");
        }
        if (config.onCanceled && typeof config.onCanceled !== "function") {
            errors.push("onCanceled must be a function");
        }
        if (config.custom_fields && typeof config.custom_fields !== "object") {
            errors.push("custom_fields must be an object");
        }

        return errors;
    }

    // Create iFrame Element, append to body, and return iFrame Element
    const createIFrame = () => {
        let iframeDiv = document.createElement("iframe");
        iframeDiv.setAttribute("src", `${libraryConfig.checkoutUrl}`);
        iframeDiv.setAttribute("id", "budpay-iframe-container");
        iframeDiv.setAttribute("style", "position:fixed;top:0;left:0;z-index:99999999999999;border:none;opacity:0;pointer-events:none;width:100%;height:100%;");
        iframeDiv.setAttribute("allowTransparency", "true");
        iframeDiv.setAttribute("width", "100%");
        iframeDiv.setAttribute("height", "100%");
        iframeDiv.setAttribute("allow", "clipboard-read; clipboard-write");
        return iframeDiv;
    }

    // Send postMessage to iFrame
    const sendPostMessageFunc = (selector: any, data: {
        type: 'initiateTransactionOnCheckout_BUD' | 'closeTransactionOnCheckout_BUD' | 'cancelTransactionOnCheckout_BUD',
        data: InitiateBudPayPaymentConfig
    }) => {
        selector.contentWindow.postMessage(data, "*");
    }


    // Close Payment Modal (Success or Failed)
    const closePaymentModal = (data: any) => {
        const iFrameContainer = document.querySelector('iframe#budpay-iframe-container');

        if (iFrameContainer) {
            iFrameContainer.remove();
        }

        // Check if callback_url is set in config
        if (config.hasOwnProperty('callback_url') && config.callback_url) {
            let callbackURL = config.callback_url;
            window.location.href = appendQueryParams(callbackURL, data.reference, data.status);

        } else {
            // Check if callback_url is set in data
            if (data.callback_url && data.callback_url !== null && data.callback_url !== 'null') {
                window.location.href = data.callback_url;
            } else {
                config.hasOwnProperty('callback') && config.callback && config.callback({
                    reference: data.reference,
                    status: data.status
                });
            }
        }
    }


    // Cancel Payment Modal
    const cancelPaymentModal = (data: any) => {
        const iFrameContainer = document.querySelector('iframe#budpay-iframe-container');

        if (iFrameContainer) {
            iFrameContainer.remove();
        }
        // Check if callback_url is set in config
        if (config.hasOwnProperty('callback_url') && config.callback_url) {
            let callbackURL = config.callback_url;
            window.location.href = appendQueryParams(callbackURL, data.reference, data.status);

        } else {
            // Check if callback_url is set in data
            if (data.callback_url && data.callback_url !== null && data.callback_url !== 'null') {
                window.location.href = data.callback_url;
            } else {
                config.hasOwnProperty('onCanceled') && config.onCanceled && config.onCanceled({
                    reference: data.reference,
                    status: data.status
                });
            }
        }
    }


    // Listen for messages from iFrame
    window.addEventListener("message", (event) => {
        try {
            if (!event.data || !event.origin) { return }
            if (!libraryConfig.checkoutSources.includes(event.origin)) { 
                throw new Error("Invalid origin");
            }

            let eventData = {
                type: event.data?.type || '',
                data: event.data?.data || {}
            };

            let iframeSelector = document.querySelector('iframe#budpay-iframe-container');

            if (eventData.type === 'initiateTransaction') {
                let errors = validateConfig();
                if (errors.length > 0) { throw new Error(errors.join(", ")) }

                let initiateTransactionData: InitiateBudPayPaymentConfig = {
                    ...config,
                    status: true,
                    type: 'merchant_integration'
                }

                sendPostMessageFunc(iframeSelector, { type: 'initiateTransactionOnCheckout_BUD', data: initiateTransactionData });
            }
            if (eventData.type === 'closeTransaction') {
                closePaymentModal(eventData.data);
            }
            if (eventData.type === 'cancelTransaction') {
                cancelPaymentModal(eventData.data);
            }
        } catch (error) {
            console.error(error);
        }
    });


    // Initiate Payment Checkout Modal Function
    const initiatePayment = () => {
        try {
            let errors = validateConfig();
            if (errors.length > 0) {
                throw new Error(errors.join(", "));
            }

            // Open SVG Loader
            openSVGLoaderFunc();

            // Create iFrame
            let checkoutIframe = document.appendChild(createIFrame());

            checkoutIframe.onload = () => {
                closeSVGLoaderFunc(); // Close SVG Loader

                // Set iFrame to visible
                checkoutIframe.style.opacity = "1";
                checkoutIframe.style.pointerEvents = "auto";
            }
        } catch (error) {
            console.error(error);
        }
    }

    return initiatePayment
}