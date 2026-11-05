// MOBILE NAVIGATION

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
        menuToggle.classList.toggle("open");
    });
}

// PORTFOLIO FILTER

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        portfolioItems.forEach(item => {
            const shouldShow = filter === "all" || item.classList.contains(filter);
            item.style.display = shouldShow ? "block" : "none";
        });
    });
});

// LIGHTBOX

const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const galleryImages = document.querySelectorAll(".portfolio-item img");
const closeLightbox = document.querySelector(".close-lightbox");

if (lightbox && lightboxImg && closeLightbox) {
    galleryImages.forEach(image => {
        image.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
        });
    });

    closeLightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            lightbox.style.display = "none";
        }
    });
}

// TESTIMONIAL SLIDER

const testimonials = document.querySelectorAll(".testimonial");
let currentSlide = 0;

function showSlide(index) {
    testimonials.forEach(slide => slide.classList.remove("active-slide"));
    testimonials[index].classList.add("active-slide");
}

if (testimonials.length > 0) {
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 4000);
}

// QUOTE FORM

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
    quoteForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const quantity = document.getElementById("quantity").value.trim();
        const product = document.getElementById("product").value;
        const notes = document.getElementById("notes").value.trim();

        if (name === "" || email === "" || phone === "" || quantity === "") {
            alert("Please fill all required fields.");
            return;
        }

        const quoteRequests = JSON.parse(localStorage.getItem("alexxyQuoteRequests") || "[]");

        quoteRequests.unshift({
            name,
            email,
            phone,
            product,
            quantity,
            notes,
            date: new Date().toLocaleDateString()
        });

        localStorage.setItem("alexxyQuoteRequests", JSON.stringify(quoteRequests));

        const successMessage = document.createElement("div");
        successMessage.classList.add("success-popup");
        successMessage.innerText = "Quote request submitted successfully!";

        document.body.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        quoteForm.reset();
    });
}

// ADMIN DASHBOARD

const adminLogin = document.getElementById("adminLogin");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginError = document.getElementById("adminLoginError");
const adminLogout = document.getElementById("adminLogout");
const adminQuoteRows = document.getElementById("adminQuoteRows");
const adminCustomOrderRows = document.getElementById("adminCustomOrderRows");
const quoteRequestCount = document.getElementById("quoteRequestCount");
const customOrderCount = document.getElementById("customOrderCount");
const adminNoteForm = document.querySelector(".admin-note-form");

function getQuoteRequests() {
    try {
        return JSON.parse(localStorage.getItem("alexxyQuoteRequests") || "[]");
    } catch (error) {
        localStorage.removeItem("alexxyQuoteRequests");
        return [];
    }
}

function getCustomOrders() {
    try {
        return JSON.parse(localStorage.getItem("customRequests") || "[]");
    } catch (error) {
        localStorage.removeItem("customRequests");
        return [];
    }
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderAdminQuotes() {
    if (!adminQuoteRows || !quoteRequestCount) {
        return;
    }

    const quoteRequests = getQuoteRequests();
    quoteRequestCount.innerText = quoteRequests.length;

    if (quoteRequests.length === 0) {
        adminQuoteRows.innerHTML = '<tr><td colspan="5">No quote requests yet.</td></tr>';
        return;
    }

    adminQuoteRows.innerHTML = quoteRequests.map(request => `
        <tr>
            <td>${escapeHtml(request.name)}</td>
            <td>${escapeHtml(request.product)}</td>
            <td>${escapeHtml(request.quantity)}</td>
            <td>${escapeHtml(request.phone)}</td>
            <td>${escapeHtml(request.date)}</td>
        </tr>
    `).join("");
}

function renderCustomOrders() {
    if (!adminCustomOrderRows || !customOrderCount) {
        return;
    }

    const customOrders = getCustomOrders();
    customOrderCount.innerText = customOrders.length;

    if (customOrders.length === 0) {
        adminCustomOrderRows.innerHTML = '<tr><td colspan="5">No custom orders yet.</td></tr>';
        return;
    }

    adminCustomOrderRows.innerHTML = customOrders.map(order => `
        <tr>
            <td>${escapeHtml(order.product)}</td>
            <td>${escapeHtml(order.quantity)}</td>
            <td>${escapeHtml(order.printMethod)}</td>
            <td>${escapeHtml(order.notes || "—")}</td>
            <td>${escapeHtml(order.timestamp)}</td>
        </tr>
    `).join("");
}

function showAdminDashboard() {
    if (!adminLogin || !adminDashboard) {
        return;
    }

    adminLogin.hidden = true;
    adminDashboard.hidden = false;
    renderAdminQuotes();
    renderCustomOrders();
}

if (adminLoginForm) {
    if (sessionStorage.getItem("alexxyAdminLoggedIn") === "true") {
        showAdminDashboard();
    }

    adminLoginForm.addEventListener("submit", event => {
        event.preventDefault();

        const password = document.getElementById("adminPassword").value.trim();

        if (password !== "alexxy015") {
            adminLoginError.innerText = "Incorrect password.";
            return;
        }

        sessionStorage.setItem("alexxyAdminLoggedIn", "true");
        adminLoginError.innerText = "";
        showAdminDashboard();
    });
}

if (adminLogout) {
    adminLogout.addEventListener("click", () => {
        sessionStorage.removeItem("alexxyAdminLoggedIn");
        adminDashboard.hidden = true;
        adminLogin.hidden = false;
    });
}

if (adminNoteForm) {
    adminNoteForm.addEventListener("submit", event => {
        event.preventDefault();

        const note = document.getElementById("adminNote").value.trim();

        if (note === "") {
            return;
        }

        localStorage.setItem("alexxyAdminNote", note);
        alert("Admin note saved.");
        adminNoteForm.reset();
    });
}

// ADMIN SIDEBAR MOBILE TOGGLE

const adminMenuToggle = document.getElementById("adminMenuToggle");
const adminSidebar = document.getElementById("adminSidebar");
const adminMenuLinks = document.querySelectorAll(".admin-menu a");

if (adminMenuToggle && adminSidebar) {
    // Toggle sidebar on menu button click
    adminMenuToggle.addEventListener("click", () => {
        adminSidebar.classList.toggle("open");
    });

    // Close sidebar when a menu link is clicked
    adminMenuLinks.forEach(link => {
        link.addEventListener("click", () => {
            adminSidebar.classList.remove("open");
        });
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", (event) => {
        if (!adminSidebar.contains(event.target) && !adminMenuToggle.contains(event.target)) {
            adminSidebar.classList.remove("open");
        }
    });
}
