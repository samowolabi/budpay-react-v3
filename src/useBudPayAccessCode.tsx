import { useEffect, useRef } from "react";
import { openSVGLoaderFunc, closeSVGLoaderFunc, createDebugScreen, closePaymentModal, cancelPaymentModal } from "../helpers/helpers";
import { libraryConfig } from "./config";
import { BudPayAccessCodeConfig } from "../types/types";


export default function useBudPayAccessCode(config: BudPayAccessCodeConfig) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    const validateConfig = (): string[] => {
        let errors: string[] = [];

        if (!config.access_code || typeof config.access_code !== "string") {
            errors.push("access_code is required and must be a string");
        }
        if (!config.reference || typeof config.reference !== "string") {
            errors.push("reference is required and must be a string");
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

        return errors;
    }

    // Create iFrame Element, append to body, and return iFrame Element
    const createIFrame = () => {
        let iframeDiv = document.createElement("iframe");
        iframeDiv.setAttribute("src", `${libraryConfig.checkoutUrl}/pay/api?reference=${config.reference}`);
        iframeDiv.setAttribute("id", "budpay-access-iframe-container");
        iframeDiv.setAttribute("style", "position:fixed;top:0;left:0;z-index:99999999999999;border:none;opacity:0;pointer-events:none;width:100%;height:100%;");
        iframeDiv.setAttribute("allowTransparency", "true");
        iframeDiv.setAttribute("width", "100%");
        iframeDiv.setAttribute("height", "100%");
        iframeDiv.setAttribute("allow", "clipboard-read; clipboard-write");
        iframeRef.current = iframeDiv;
        return iframeDiv;
    }


    // Receive Data from Parent
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

                switch (eventData.type) {
                    case 'closeTransaction':
                        closePaymentModal('iframe#budpay-access-iframe-container', eventData.data, config);
                        break;

                    case 'cancelTransaction':
                        cancelPaymentModal('iframe#budpay-access-iframe-container', eventData.data, config);
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
    }, [config]); // Adjust dependencies if necessary




    // Initiate Payment
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