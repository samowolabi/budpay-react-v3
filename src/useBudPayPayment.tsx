import { useEffect, useRef } from "react";
import { openSVGLoaderFunc, closeSVGLoaderFunc, createDebugScreen, closePaymentModal, cancelPaymentModal } from "../helpers/helpers";
import { libraryConfig } from "./config";
import { BudPayPaymentConfig, BudPayPaymentAPIConfig } from "../types/types";


export default function useBudPayPayment(config: BudPayPaymentConfig) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    // Create Validate config function, with the following checks:
    const validateConfig = (): string[] => {
        let errors: string[] = [];

        if (!config.api_key) {
            errors.push("api_key is required");
        }
        if (!config.amount || typeof config.amount !== "number") {
            errors.push("amount is required and must be a number");
        }
        if (!config.currency || typeof config.currency !== "string") {
            errors.push("currency is required and must be a string");
        }
        if (config.reference && typeof config.reference !== "string") {
            errors.push("reference must be a string");
        }
        if (!config.customer) {
            errors.push("customer is required");
        } else {
            if (!config.customer.email || typeof config.customer.email !== "string") {
                errors.push("customer.email is required and must be a string");
            }
            if (config.customer.first_name && typeof config.customer.first_name !== "string") {
                errors.push("customer.first_name must be a string");
            }
            if (config.customer.last_name && typeof config.customer.last_name !== "string") {
                errors.push("customer.last_name must be a string");
            }
            if (config.customer.phone && typeof config.customer.phone !== "string") {
                errors.push("customer.phone must be a string");
            }
        }
        if (config.callback_url && typeof config.callback_url !== "string") {
            errors.push("callback_url must be a string");
        }
        if (config.onComplete && typeof config.onComplete !== "function") {
            errors.push("onComplete must be a function");
        }
        if (config.onCancel && typeof config.onCancel !== "function") {
            errors.push("onCancel must be a function");
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
        iframeDiv.setAttribute("id", "budpay-payment-iframe-container");
        iframeDiv.setAttribute("style", "position:fixed;top:0;left:0;z-index:99999999999999;border:none;opacity:0;pointer-events:none;width:100%;height:100%;");
        iframeDiv.setAttribute("allowTransparency", "true");
        iframeDiv.setAttribute("width", "100%");
        iframeDiv.setAttribute("height", "100%");
        iframeDiv.setAttribute("allow", "clipboard-read; clipboard-write");
        iframeRef.current = iframeDiv;
        return iframeDiv;
    }

    // Send postMessage to iFrame
    const sendPostMessageFunc = (data: {
        type: 'initiateTransactionOnCheckout_BUD' | 'closeTransactionOnCheckout_BUD' | 'cancelTransactionOnCheckout_BUD',
        data: BudPayPaymentAPIConfig
    }) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(data, libraryConfig.checkoutUrl);
        }
    }


    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            try {
                if (!event.data || !event.origin || event.source !== iframeRef.current?.contentWindow) { return }

                if (!libraryConfig.checkoutSources.includes(event.origin)) {
                    console.warn("Invalid origin");
                    return;
                }

                let eventData = {
                    type: event.data?.type || '',
                    data: event.data?.data || {}
                };

                // let iframeSelector = document.querySelector('iframe#budpay-payment-iframe-container');

                switch (eventData.type) {
                    case 'initiateTransaction':
                        let errors = validateConfig();
                        if (errors.length > 0) {
                            console.error(errors.join(", "));
                            return;
                        }

                        let initiateTransactionData: BudPayPaymentAPIConfig = {
                            status: true,
                            type: 'merchant_integration',
                            key: config.api_key,
                            amount: config.amount.toString(),
                            currency: config.currency,
                            reference: config.reference || 'BUD_' + Math.floor((Math.random() * 1000000000) + 1) + new Date().getMilliseconds() + new Date().getSeconds(),
                            email: config.customer.email,
                            first_name: config.customer?.first_name || '',
                            last_name: config.customer?.last_name || '',
                            phone: config.customer?.phone || '',
                            callback_url: config.callback_url || '',
                            custom_fields: config.custom_fields || {}
                        }

                        sendPostMessageFunc({ type: 'initiateTransactionOnCheckout_BUD', data: initiateTransactionData });
                        break;

                    case 'closeTransaction':
                        closePaymentModal('iframe#budpay-payment-iframe-container', eventData.data, config);
                        break;

                    case 'cancelTransaction':
                        cancelPaymentModal('iframe#budpay-payment-iframe-container', eventData.data, config);
                        break;

                    default:
                        console.warn("Unknown event type");
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        };

        window.addEventListener('message', handleMessage);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [config]); // Dependencies can be adjusted as needed




    // Initiate Payment Checkout Modal Function
    const initiatePayment = () => {
        try {
            let errors = validateConfig();
            if (errors.length > 0) {
                console.error(errors.join(", "));

                // Create Debug Screen if debug is set to true
                if (config.debug && config.debug === true) {
                    createDebugScreen(errors);
                }

                return;
            }

            // Open SVG Loader
            openSVGLoaderFunc();

            // Create iFrame
            let checkoutIframe = document.body.appendChild(createIFrame());

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