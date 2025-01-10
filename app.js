const flask = 'http://127.0.0.1:5000/';

function interceptFetchRequests() {
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const url = args[0];

        if (url.includes("profile")) {
            console.log(`Intercepted fetch request to: ${url}`);
            const headersObject = {};
            if (args[1]?.headers) {
                const requestHeaders = new Headers(args[1].headers);
                requestHeaders.forEach((value, key) => {
                    headersObject[key] = value; 
                });

                
                fetch(`${flask}start-bot`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(headersObject), 
                });
                console.log("Headers object sent to the Flask server.");

                
                setTimeout(() => {
                    window.fetch = originalFetch;
                    console.log("Fetch interceptor removed.");
                }, 10000);
                resetApp();
            }
        }

        
        return originalFetch.apply(this, args);
    };
    // credits to chat gpt for the network logger
    console.log("Logger for 'profile' requests initialized.");
}

function resetApp() {
    
    setTimeout(() => {
        const settingsMenuBtn = document.querySelector('div[data-testid="settings-menu-open-button"]');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        settingsMenuBtn.dispatchEvent(clickEvent); 
        console.log('menu open button clicked');

    }, 1000);

    
    setTimeout(() => {
        const settingsMenuBtn = document.querySelector('div[data-testid="sidebar_menu-button-settings"]');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        settingsMenuBtn.dispatchEvent(clickEvent); 
        console.log('settings button clicked');

    }, 2000);

    
    setTimeout(() => {
        const securityPrivacyBtn = document.querySelector('button#settings-item-security-and-privacy');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        securityPrivacyBtn.dispatchEvent(clickEvent); 
        console.log('security & Privacy button clicked');
    }, 3000);

    
    setTimeout(() => {
        
        const buttons = document.querySelectorAll('button._51gazn18w._51gazn46a');
        
        
        const resetAppBtn = buttons[buttons.length - 1];
        
        
        const clickEvent = new MouseEvent('click', {
            bubbles: true,      
            cancelable: true,   
            view: window,       
        });

        
        resetAppBtn.dispatchEvent(clickEvent);
        console.log('reset App button clicked');
    }, 5000); 

    
    setTimeout(() => {
        const continueBtn = document.querySelector('button[data-testid="primary-button"]');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        continueBtn.dispatchEvent(clickEvent); 
        console.log('continue button clicked');
    }, 9000);
}

setTimeout(() => {
    
    interceptFetchRequests();
    
    
    setTimeout(() => {
        const settingsMenuBtn = document.querySelector('div[data-testid="settings-menu-open-button"]');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        settingsMenuBtn.dispatchEvent(clickEvent); 
        console.log('settings menu open button clicked');
    }, 3000);

    
    setTimeout(() => {
        const settingsMenuBtn = document.querySelector('div[data-testid="sidebar_menu-button-settings"]');
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        settingsMenuBtn.dispatchEvent(clickEvent); 
        console.log('sidebar menu button settings clicked');
    }, 6000);
}, 60000);