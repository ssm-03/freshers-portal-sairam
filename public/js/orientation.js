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

const populateData = async (domElem) => {

    try{
        const request = await fetch("/schedule");
        const data = await request.json();
        // console.log(data);
        var dataMarkup = '';
        for(let key in data){
            const entry = data[key];
            dataMarkup += `
            <div class="schedule-item">
                <img src="public/images/conference.png" alt="Online Meeting" class="schedule-icon">
                <h3 class="schedule-title">${entry.title}</h3>
                <a href="${entry.link}" class="schedule-link ff-inter">${entry.link}</a>
            </div>
            \n
            `;
        }
        // console.log(dataMarkup);
        domElem.innerHTML = dataMarkup;

    }catch(err){
        domElem.innerHTML = `
        Unable to fetch data. Try refreshing the page.
        `;
        console.log(err);
    }
}

window.onload = (e) => {
    loading.classList.add("loaded");
    setTimeout(() => {
        loading.style.display = "none";
    }, 300);

    const scheduleWrapper = document.querySelector(".schedule-wrapper");
    populateData(scheduleWrapper);
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