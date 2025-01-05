chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes('roblox.com')) {
        console.log('Executing script on:', tab.url);
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: myCode
        });
    }
});

function myCode() {
    (function () {
        function removeElement(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.remove();
                console.log(`${selector} removed.`);
            }
        }

        function removeUnwantedElements() {
            removeElement('.terms-agreement');
            removeElement('#app-stores-container');
        }

        document.addEventListener('DOMContentLoaded', removeUnwantedElements);

        var observer = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    removeUnwantedElements();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    })();
    (function () {
        const url = window.location.href;
        if (url.startsWith("https://www.roblox.com/CreateAccount") || url === "https://www.roblox.com/") {
            let startTime = Date.now();
            let scrollInterval = setInterval(function () {
                window.scrollTo(0, document.body.scrollHeight);
                if (Date.now() - startTime > 1200) {
                    clearInterval(scrollInterval);
                }
            }, 5);
        }
    })();
    const list1 = [
        "the", "be", "and", "of", "a", "in", "to", "have", "it", "I"
    ];

    const list2 = [
        '', '', '', '_', 'x', 'z', 'q', '_x', '_z', 'xx', 'zz', 'xz', 'zx'    ];

    const list3 = [
        'hunter', 'legend', 'warrior', 'mystic', 'slayer', 'seeker', 'shadow'    ];

    const rareWords = [
        'addiqute', 'seriph', 'coruze', 'vibant', 'florux', 'zephyx', 'nirvos'    ];
    const usedUsernames = JSON.parse(localStorage.getItem('usedUsernames')) || [];

    function saveUsernameToLog(username) {
        usedUsernames.push(username);
        localStorage.setItem('usedUsernames', JSON.stringify(usedUsernames));
    }

    function isUsernameUsed(username) {
        return usedUsernames.includes(username);
    }

    function attemptClick() {
        const signUpButton = document.querySelector('#sign-up-button');
        if (signUpButton) {
            console.log("eureka!");
            signUpButton.click();
            clearInterval(intervalId);
        }
    }

    const intervalId = setInterval(attemptClick, 0);

    const inputElement = document.getElementById('signup-username');
    const hiddenTextArea = document.createElement('textarea');
    hiddenTextArea.style.position = 'fixed';
    hiddenTextArea.style.opacity = '0';
    hiddenTextArea.style.pointerEvents = 'none';
    document.body.appendChild(hiddenTextArea);

    function copyValueToClipboard() {
        const inputValue = inputElement.value;
        hiddenTextArea.value = inputValue;
        hiddenTextArea.select();
        hiddenTextArea.setSelectionRange(0, inputValue.length);

        try {
            document.execCommand('copy');
            console.log('Copied to clipboard:', inputValue);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
    setInterval(copyValueToClipboard, 100);

    function togglePasswordVisibility() {
        const targetButtonSelector = 'div[role="button"].icon-password-show-v2.icon-password-show.password-visibility-toggle[aria-label="toggle-password-visibility"]';
        const changedButtonSelector = 'div[role="button"].icon-password-hide-v2.icon-password-show.password-visibility-toggle[aria-label="toggle-password-visibility"]';

        function checkAndClickButton() {
            const button = document.querySelector(targetButtonSelector);
            if (button) {
                button.click();
                requestAnimationFrame(() => {
                    const changedButton = document.querySelector(changedButtonSelector);
                    if (!changedButton) {
                        checkAndClickButton();
                    }
                });
            }
        }
        requestAnimationFrame(checkAndClickButton);
    }

    function dispatchChangeEvent(element) {
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
    }

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value').set;
        valueSetter ? valueSetter.call(element, value) : prototypeValueSetter.call(element, value);
    }

    function simulateUserInput(inputElement, value) {
        setNativeValue(inputElement, value);
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function generateRandomText() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const useLegacySystem = Math.random() > 0.5;
        let username;

        do {
            if (useLegacySystem) {
                const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
                username = getRandomItem(list1) + getRandomItem(list2) + getRandomItem(list3);
            } else {
                const rareWord = rareWords[Math.floor(Math.random() * rareWords.length)];
                const randomLetters = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
                username = rareWord + randomLetters;
            }
        } while (isUsernameUsed(username) || username.startsWith('_') || username.length < 3 || username.length > 20);

        saveUsernameToLog(username);
        setPassword(username);
        return username;
    }

    function setPassword(username) {
        const passwordField = document.querySelector('#signup-password');
        if (passwordField) {
            const password = username + username;
            simulateUserInput(passwordField, password);
        } else {
            console.log('Password field not found');
        }
    }

    function setUsername() {
        const inputField = document.querySelector('#signup-username');
        if (inputField) {
            const username = generateRandomText();
            simulateUserInput(inputField, username);
        } else {
            console.log('Input field not found');
        }
    }

    function checkIfUsernameInUse() {
        const errorMessage = document.querySelector('#signup-usernameInputValidation');
        if (errorMessage) {
            const errorMessageText = errorMessage.textContent.trim();
            return [
                "This username is already in use.",
                "Username not appropriate for Roblox.",
                "Usernames can be 3 to 20 characters long.",
                "Usernames cannot start or end with _.",
                "Usernames can have at most one _."
            ].includes(errorMessageText);
        }
        return false;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (checkIfUsernameInUse()) {
                setUsername();
            }
        });
    });

    const validationElement = document.querySelector('#signup-usernameInputValidation');
    if (validationElement) {
        observer.observe(validationElement, { childList: true });
    }

    const usernameInput = document.querySelector('#signup-username');
    if (usernameInput) {
        usernameInput.addEventListener('input', () => {
            setPassword(usernameInput.value);
        });
    }

    const acceptBtnObserver = new MutationObserver(() => {
        const acceptBtn = document.querySelector('.btn-cta-lg.cookie-btn.btn-primary-md.btn-min-width');
        if (acceptBtn) {
            acceptBtn.click();
            acceptBtnObserver.disconnect();
        }
    });

    acceptBtnObserver.observe(document.body, { childList: true, subtree: true });

    const yearDropdown = document.querySelector('#YearDropdown');
    const monthDropdown = document.querySelector('#MonthDropdown');
    const dayDropdown = document.querySelector('#DayDropdown');

    if (yearDropdown && monthDropdown && dayDropdown) {
        yearDropdown.value = '2000';
        dispatchChangeEvent(yearDropdown);
        monthDropdown.value = 'Dec';
        dispatchChangeEvent(monthDropdown);
        dayDropdown.value = '25';
        dispatchChangeEvent(dayDropdown);
    } else {
        console.log('Could not find the birthday input fields.');
    }

    setUsername();
}