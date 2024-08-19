// Create SVG Loader Function
export const openSVGLoaderFunc = () => {
    let svgLoaderDiv = document.createElement("div");
    svgLoaderDiv.setAttribute("id", "budpay-svg-loader-container");
    svgLoaderDiv.setAttribute("style", "position:fixed;top:0;left:0;z-index:99999999999999;border:none;pointer-events:none;width:100%;height:100%;background:rgba(0,0,0,0.65);display:flex;justify-content:center;align-items:center;");
    svgLoaderDiv.innerHTML = `
                    <svg version="1.1" id="L9" width="80" height="80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                        <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                        <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="0.7s" from="0 50 50" to="360 50 50" repeatCount="indefinite"></animateTransform>
                        </path>
                    </svg>
                `;
    document.body.appendChild(svgLoaderDiv);
}

// Remove SVG Loader Function
export const closeSVGLoaderFunc = () => {
    let svgLoaderDiv = document.getElementById("budpay-svg-loader-container");
    if (svgLoaderDiv) {
        svgLoaderDiv.remove();
    }
}


// Create Debug Screen Overlay
export const createDebugScreen = (errors: string[]) => {

    // Add span to the first word of the error message
    let configErrors = errors.map((error) => {
        let words = error.split(" ");
        let firstWord = words[0];
        let restOfWords = words.slice(1).join(" ");
        return `<li><span style="border: 1px solid #dedee4;padding: 0.25rem 0.35rem;border-radius: 6px;background-color: #ffffff;font-weight: 400;">${firstWord}</span> ${restOfWords}</li>`;
    }).join("");


    let debugScreenDiv = document.createElement("div");
    debugScreenDiv.setAttribute("id", "budpay-debug-screen-container");
    debugScreenDiv.setAttribute("style", "position:fixed;top:0;left:0;z-index:99999999999999;border:none;width:100%;height:100%;background:rgba(0,0,0,0.65);display:flex;justify-content:center;align-items:center;padding:6px 3px;");
    debugScreenDiv.innerHTML = `
                <div style="border:1.5px solid #cf7488;background:#FFF1F2;padding:16px;border-radius:8px;min-width:380px;max-width:380px;">
                    <h3 style="font-size:1rem;font-weight:500">Kindly review the following configuration issues</h3>
                    
                    <ul style="display:flex;flex-direction: column;row-gap: 0.75rem;margin-top:1rem;font-size:12px;list-style:disc;margin-left:1.15rem;">
                        ${configErrors}
                    </ul>

                    <div style="display:flex;justify-content:center;">
                        <button style="font-size:13px;border:none;outline:none;background:#E11D48;color:#ffffff;padding:0.6rem 1.5rem;border-radius:6px;margin-top:1.5rem;cursor:pointer;" onclick="document.getElementById('budpay-debug-screen-container').remove()">Close</button>
                    </div>

                    <p style="color:#4d4d4d;text-align:center;font-size:10px;margin-top:1rem;">Debug mode is active. Remember to set debug to <strong>false</strong> or remove it in the production environment. <br /><br /> If you need help, please contact <a href="mailto:hi@budpay.com" style="text-decoration:underline;font-weight:600">BudPay Support</a></p>
                    <p style="color:#4d4d4d;text-align:center;font-size:10px;">Powered by <a href="https://budpay.com" target="_blank" style="text-decoration:underline;font-weight:600">BudPay</a></p>
                </div>
            `;
    document.body.prepend(debugScreenDiv);
}

// Add reference and status to callback_url
export const appendQueryParams = (url: string, reference: string, status: string) => {
    let urlObject = new URL(url);
    urlObject.searchParams.append('reference', reference);
    urlObject.searchParams.append('status', status);
    return urlObject.href;
}