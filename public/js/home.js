import { auth, signOut, onAuthStateChanged } from "./config.js";

const loading = document.querySelector(".loading");
const userBtn = document.querySelector(".user-btn");
const userMenu = document.querySelector(".user-menu");
const chevronIcon = document.querySelector(".chevron-down");
const signOutBtn = document.querySelector(".sign-out");
const userBtnName = document.querySelector(".user-btn-name");
const contentH1 = document.querySelector(".content h1");

onAuthStateChanged(auth, (user) => {
    if (!user) location.href = '/';
    else {
        userBtnName.innerHTML = `Welcome, ${user.displayName.split(" ")[0]}`;
        contentH1.innerHTML = `Hello, ${user.displayName}`;
    };
});

window.onload = (e) => {
    loading.classList.add("loaded");
    setTimeout(() => {
        loading.style.display = "none";
    }, 300);
}

userBtn.addEventListener("click", (e) => {
    userMenu.classList.toggle("user-menu-open");
    chevronIcon.classList.toggle("chevron-down-open");
});

signOutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        location.href = "/";
    });
})