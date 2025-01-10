async function validate() {
    const res = await fetch('http://127.0.0.1:5000/next-bot');
    try {
        if (!res.ok) {
            throw new Error(f`error while fetching phrase from flask server: ${res.status}`)
        }
        const data = await res.json();
        const phrase = data['phrase']
        // click the "Restore Wallet" button
        setTimeout(() => {
            const restoreWalletBtn = document.querySelector('button.ai2qbc9.t8qixv0.t8qixv1.t8qixv6.t8qixve._51gazn18q._51gazn1b4._51gazn1ar._51gazn468._51gazn476._51gazn1hp._51gazn1lb._51gazn1j9._51gazn332._51gaznmv._51gaznnt._51gaznpp._51gaznor._51gazn1x._51gazn37._51gaznt._51gazn12t._51gazngh._51gazn129._51gazn129._51gazn1by');
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            restoreWalletBtn.dispatchEvent(clickEvent);
            console.log('Restore Wallet button clicked');
        }, 1000); 

        // click the import secret recovery phrase button
        setTimeout(() => {
            const importButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Import Secret Recovery Phrase'));
            if (importButton) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                importButton.dispatchEvent(clickEvent);
                console.log('Import Secret Recovery Phrase button clicked');
            } else {
                console.log('Import Secret Recovery Phrase button not found');
            }
        }, 2000);

        // fill phrase
        setTimeout(() => {
            phrase.forEach((word, index) => {
                const input = document.querySelector(`input[data-testid="secret-recovery-phrase-word-input-${index}"]`);
                index++;
                input.setAttribute('value', word);
                input.dispatchEvent(new Event('focus', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            })
        }, 3000);

        // click import button
        setTimeout(() => {
            const submitButton = document.querySelector('[data-testid="onboarding-form-submit-button"]');
            submitButton.click();
        }, 4000);

        // click continue button
        setTimeout(() => {
            const submitButtonTwo = document.querySelector('[data-testid="onboarding-form-submit-button"]');
            submitButtonTwo.click();
        }, 7000);

        // enter passwords
        setTimeout(() => {
            const passwordInput = document.querySelector('input[data-testid="onboarding-form-password-input"]');
            const confirmPasswordInput = document.querySelector('input[data-testid="onboarding-form-confirm-password-input"]');
            const termsCheckbox = document.querySelector('input[data-testid="onboarding-form-terms-of-service-checkbox"]');
            const password = 'asdfghjk';
            passwordInput.setAttribute('value', password);
            passwordInput.dispatchEvent(new Event('focus', { bubbles: true }));
            [...password].forEach((char) => {
                const keyEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
                passwordInput.dispatchEvent(keyEvent);
            });
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log('Password entered in the password input field.');
            confirmPasswordInput.setAttribute('value', password);
            confirmPasswordInput.dispatchEvent(new Event('focus', { bubbles: true }));
            [...password].forEach((char) => {
                const keyEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
                confirmPasswordInput.dispatchEvent(keyEvent);
            });
            confirmPasswordInput.dispatchEvent(new Event('input', { bubbles: true }));
            confirmPasswordInput.dispatchEvent(new Event('blur', { bubbles: true }));
            console.log('Password entered in the confirm password input field.');
            termsCheckbox.click();
            console.log('Terms of Service checkbox clicked.');
        }, 9000);

        // click the continue button
        setTimeout(() => {
            const continueBtn = document.querySelector('button[data-testid="onboarding-form-submit-button"]');
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window, 
            });
            continueBtn.dispatchEvent(clickEvent); // Simulate the button click
            console.log('Step 4: Continue button clicked.');
        }, 10000);

        // click the continue button
        setTimeout(() => {
            const continueBtnTwo = document.querySelector('button[data-testid="onboarding-form-submit-button"]');
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            continueBtnTwo.dispatchEvent(clickEvent);
            console.log('Step 7: Continue button clicked');
        }, 14000);
    } catch (error) {
        console.log(error.message);
    }
}
validate();