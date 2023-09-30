//  slideshow javascript
document.addEventListener("DOMContentLoaded", function () {
    let slideIndex = 0;
    showSlides();

    function showSlides() {
        const slides = document.querySelectorAll('.slide');

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }

        slideIndex++;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        slides[slideIndex - 1].style.display = 'block';
        setTimeout(showSlides, 4000); // Change slide every 5 seconds (adjust as needed)
    }
});



// Function to display the popup
function displayPopup() {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
        <h2>Register or Login</h2>
        <h3>New user?</h3>
        <div class="popup-content">
            <button id="register-button">Register</button>
            <h3> Already have an Account? </h3>
            <button id="login-button">Login</button>
        </div>
    `;

    document.body.appendChild(popup);

    // Handle Register button click
    document.getElementById("register-button").addEventListener("click", function () {
        // Redirect to register.html
        window.location.href = "register.html";
    });

    // Handle Login button click
    document.getElementById("login-button").addEventListener("click", function () {
        // Redirect to login.html
        window.location.href = "login.html";
    });

    // Close the popup when clicking outside of it
    window.addEventListener("click", function (e) {
        if (e.target === popup) {
            document.body.removeChild(popup);
        }
    });
}

// Add click event listener to the "Book a Table" link
document.getElementById("book-table-link").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior
    displayPopup(); // Display the popup
});


// Add click event listener to the "Book a Table" button
document.getElementById("book-table-button").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default button behavior (form submission or link navigation)

    // Display the popup
    displayPopup();
});


const loginForm = document.getElementById("login-form");

// Add submit event listener to the login form
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Extract form data (username and password)
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
        // Send a POST request to your server for login
        const response = await fetch("/login", {
            method: "POST",
            body: formData,
        });

        if (response.status === 200) {
            // Login successful, redirect to booking.html
            window.location.href = "booking.html";
        } else {
            // Display an error message to the user (you can modify this part)
            console.error("Login failed. Please try again.");
        }
    } catch (error) {
        console.error(error);
        // Handle other potential errors here
    }
}); 
// Add click event listener to the "Subscribe" button
document.getElementById("subscribe-button").addEventListener("click", async () => {
    const email = document.getElementById("email-input").value;

    try {
        // Send a POST request to your server for email subscription
        const response = await fetch("/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (response.status === 200) {
            // Subscription successful
            alert("Subscription successful.");
            // Clear the email input field
            document.getElementById("email-input").value = "";
        } else if (response.status === 400) {
            // Email already subscribed
            alert("Email already subscribed.");
        } else {
            // Display an error message to the user
            console.error("Subscription failed. Please try again.");
        }
    } catch (error) {
        console.error(error);
        // Handle other potential errors here
    }
});
