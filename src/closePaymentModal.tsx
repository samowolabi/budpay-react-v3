export default function closePaymentModal() {
    // Remove iFrame
    const iFrameContainer = document.querySelectorAll('iframe#budpay-payment-iframe-container');

    if (iFrameContainer) {
        iFrameContainer.forEach((iframe) => {
            iframe.remove();
        });
    }


    // Remove iFrame
    const iFrameAccessContainer = document.querySelectorAll('iframe#budpay-access-iframe-container');

    if (iFrameAccessContainer) {
        iFrameAccessContainer.forEach((iframe) => {
            iframe.remove();
        });
    }


    // Remove SVG Loader
    let svgLoaderDivContainer = document.querySelectorAll("#budpay-svg-loader-container");
    if (svgLoaderDivContainer) {
        svgLoaderDivContainer.forEach((svgLoaderDiv) => {
            svgLoaderDiv.remove();
        });
    }

    // Remove Debug Screen
    let debugScreenDivContainer = document.querySelectorAll("#budpay-debug-screen-container");
    if (debugScreenDivContainer) {
        debugScreenDivContainer.forEach((debugScreenDiv) => {
            debugScreenDiv.remove();
        });
    }
}