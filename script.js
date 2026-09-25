const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function scrollToSection(selector) {
  const target = $(selector);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
}

$$("[data-scroll]").forEach(button => {
  button.addEventListener("click", () => scrollToSection(button.dataset.scroll));
});

// Mobile navigation
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

$$(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Blog filtering + search
const filterButtons = $$(".filter");
const blogCards = $$(".blog-card");
const searchInput = $("#blogSearch");
const emptyState = $("#emptyState");
let currentFilter = "all";

function filterPosts() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  blogCards.forEach(card => {
    const category = card.dataset.category;
    const title = card.dataset.title.toLowerCase();
    const matchesFilter = currentFilter === "all" || category === currentFilter;
    const matchesSearch = !query || title.includes(query);

    if (matchesFilter && matchesSearch) {
      card.classList.remove("hidden");
      visible++;
    } else {
      card.classList.add("hidden");
    }
  });

  emptyState.style.display = visible ? "none" : "block";
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    filterPosts();
  });
});

searchInput.addEventListener("input", filterPosts);

// Modal system
const posts = {
  campus: {
    eyebrow: "DESIGN • HCI",
    title: "15 Bad Designs I Found Around Our Campus",
    text: "This article shares observations about facilities, signs, furniture, and spaces around campus. Looking at these examples helped me understand that design is not only about appearance; it is also about how easy, safe, and comfortable something is for the people who use it."
  },
  logo: {
    eyebrow: "DESIGN • PERSONAL BRANDING",
    title: "The Meaning Behind My Logo",
    text: "I created my KS logo for my personal website and blog. The design uses simple initials, a circular shape, leaves, and small decorative details to represent growth, learning, and creativity."
  },
  wix: {
    eyebrow: "WEB • LEARNING",
    title: "My Experience Using Wix as a Blogging Platform",
    text: "When I started the activity, I explored different blogging and website-building options. Using a visual builder helped me understand page structure, spacing, images, navigation, and how design choices affect the experience of visitors."
  },
  learning: {
    eyebrow: "LEARNING • REFLECTION",
    title: "What I Learned From Building My First Website",
    text: "Building a website taught me that small details matter. I learned to organize content, use consistent spacing, test buttons and links, and improve the design based on what feels clear and easy to use."
  }
};

function openModal(id) {
  const modal = $("#" + id);
  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const modal = $("#" + id);
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

$$(".read-more").forEach(button => {
  button.addEventListener("click", () => {
    const post = posts[button.dataset.post];
    $("#modalEyebrow").textContent = post.eyebrow;
    $("#modalTitle").textContent = post.title;
    $("#modalText").textContent = post.text;
    openModal("articleModal");
  });
});

$$("[data-modal]").forEach(button => {
  button.addEventListener("click", () => openModal(button.dataset.modal));
});

$$("[data-close]").forEach(button => {
  button.addEventListener("click", () => closeModal(button.dataset.close));
});

$$(".modal").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModal(modal.id);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    $$(".modal.open").forEach(modal => closeModal(modal.id));
  }
});

$("#modalScrollContact").addEventListener("click", () => {
  closeModal("articleModal");
  setTimeout(() => scrollToSection("#contact"), 100);
});

// Newsletter
$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#emailInput").value.trim();

  if (!email) return;
  showToast("Thanks for subscribing!");
  event.target.reset();
});

// Contact form
$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#name").value.trim();

  if (!name) return;
  $("#contactStatus").textContent = "Message ready! Thank you, " + name + ".";
  showToast("Your message was submitted.");
  event.target.reset();
});

// Back to top
$("#backTop").addEventListener("click", () => scrollToSection("#home"));

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
