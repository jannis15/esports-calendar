$(document).ready(() => {
    const submitBtn = document.getElementById("submit");

    function handleAjaxStart() {
        submitBtn.setAttribute("aria-busy", "true");
    }

    function handleAjaxComplete() {
        submitBtn.removeAttribute("aria-busy");
    }

    $("#login-form").submit(() => {
        event.preventDefault();

        // declaration
        const usernameEl = document.getElementById("username");
        const passwordEl = document.getElementById("password");
        const username = usernameEl.value;
        const password = passwordEl.value;

        // init
        usernameEl.removeAttribute("aria-invalid");
        passwordEl.removeAttribute("aria-invalid");

        // AJAX call with JQuery
        $.ajax({
            url: '/login',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({username: username, password: password}),
            beforeSend: handleAjaxStart,
            complete: handleAjaxComplete,
            success: (response) => {
                document.cookie = "token="+response.token;
                const urlParams = new URLSearchParams(window.location.search);
                const nextUrl = urlParams.get('next');
                if (nextUrl) {
                    window.location.href = nextUrl;
                }
                else {
                    window.location.href = '/home';
                }
            },
            error: (xhr) => {
                if (xhr.status === 401) {
                    usernameEl.setAttribute("aria-invalid", "true");
                    passwordEl.setAttribute("aria-invalid", "true");
                }
                // TODO: Error Handling
                alert(xhr.responseText);
            }
        });
    });

$("#signup-form").submit(() => {
        event.preventDefault();

        // declaration
        const usernameEl = document.getElementById("username");
        const username = usernameEl.value;
        const password1El = document.getElementById("password1");
        const password2El = document.getElementById("password2");
        const password1 = password1El.value;
        const password2 = password2El.value;

        // init
        usernameEl.removeAttribute("aria-invalid");
        if (password1 != password2) {
            password1El.setAttribute("aria-invalid", "true");
            password2El.setAttribute("aria-invalid", "true");
            return
        } else {
            password1El.removeAttribute("aria-invalid");
            password2El.removeAttribute("aria-invalid");
        }

        // AJAX call with JQuery
        $.ajax({
            url: '/signup',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({username: username, password: password1}),
            beforeSend: handleAjaxStart,
            complete: handleAjaxComplete,
            success: (response) => {
                window.location.href = '/login';
            },
            error: (xhr) => {
                if (xhr.status === 409) {
                    usernameEl.setAttribute("aria-invalid", "true");
                };
                // TODO: Error Handling
                alert(xhr.responseText);
            }
        });
    });
});

$(document).ready(() => {
    $('#logout').on("click", (event) => {
        event.preventDefault();
        $.ajax({
            url: '/logout',
            type: 'POST',
            success: (response) => {
                window.location.href = '/login';
            },
            error: (xhr) => {
                // TODO: Error Handling
                alert(xhr.responseText);
            }
        });
    });
});