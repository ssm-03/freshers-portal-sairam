import { auth, signOut, onAuthStateChanged } from "./config.js";

const loading = document.querySelector(".loading");
const userBtn = document.querySelector(".user-btn");
const userMenu = document.querySelector(".user-menu");
const chevronIcon = document.querySelector(".chevron-down");
const signOutBtn = document.querySelector(".sign-out");
const userBtnName = document.querySelector(".user-btn-name");
const modal = document.querySelector(".popup-overlay");
const modalInner = document.querySelector(".popup");
const updateStatusWrapper = document.querySelector(".update-status-wrapper");
const showStudentLink = document.querySelector(".show-student");
const showScheduleLink = document.querySelector(".show-schedule");
const studentDetails = document.querySelector(".student-container");
const scheduleDetails = document.querySelector(".schedule-container");

var data;

onAuthStateChanged(auth, (user) => {
    if (user && user.uid === "nW2xockgUwdXcSpBZTOCoWSsc1h1") userBtnName.innerHTML = `Welcome, ${user.email.split("@")[0]}`;
    else location.href='/';
});

const showStudents = (e) => {
    if (studentDetails.classList.contains("hidden")) studentDetails.classList.remove("hidden");
    if (!scheduleDetails.classList.contains("hidden")) scheduleDetails.classList.add("hidden");
    if (!showStudentLink.classList.contains("fw-600")) showStudentLink.classList.add("fw-600");
    if (showScheduleLink.classList.contains("fw-600")) showScheduleLink.classList.remove("fw-600");
}

const showSchedule = (e) => {
    if (!studentDetails.classList.contains("hidden")) studentDetails.classList.add("hidden");
    if (scheduleDetails.classList.contains("hidden")) scheduleDetails.classList.remove("hidden");
    if (showStudentLink.classList.contains("fw-600")) showStudentLink.classList.remove("fw-600");
    if (!showScheduleLink.classList.contains("fw-600")) showScheduleLink.classList.add("fw-600");
}

showStudentLink.onclick = showStudents;
showScheduleLink.onclick = showSchedule;

const obtainData = async () => {
    try {
        const request = await fetch("/schedule");
        data = await request.json();
        return data;
    } catch (error) {
        return err;
    }
}

const populateData = async (domElem) => {

    try{
        data = await obtainData();

        // console.log(data);

        var dataMarkup = '';

        for(let key in data) {
            const meeting = data[key];
            dataMarkup += `
            <li>
                <div class="schedule-item-admin" data-key="${key}">
                    <h3 class="schedule-title">Title: ${meeting.title}</h3>
                    <p class="ff-inter fs-2s">Time: ${meeting.time} </p>
                    <p class="ff-inter fs-2s">Link: ${meeting.link}</p>
                    <p class="ff-inter fs-2s">Duration: ${meeting.duration} hours</p>
                    <br>
                    <div>
                        <a href="#" class="admin-edit admin-cta ff-inter fs-2s">Edit</a>
                        <a href="#" class="admin-delete admin-cta ff-inter fs-2s">Delete</a>
                    </div>
                    <br>
                </div>
            </li>
            `
        };
        
        // console.log(dataMarkup);
        domElem.innerHTML = dataMarkup;
        const adminEditBtns = document.querySelectorAll(".admin-edit");
        const adminDelBtns = document.querySelectorAll(".admin-delete");

        adminEditBtns.forEach((btn) => btn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleModal(e);
        }));
        adminDelBtns.forEach((btn) => btn.addEventListener("click", (e) => {
            e.preventDefault();
            deleteData(e);
        }));

    }catch(err){
        domElem.innerHTML = `
        Unable to fetch data. Try refreshing the page.
        `;
        console.log(err);
    }
}

const toggleModal = (e) => {
    e.preventDefault();
   
    modal.classList.toggle("popup-hidden");
    if (e.target.parentNode.parentNode.dataset.key) {
        const meetingTitle = document.querySelector(".meeting-title");
        const meetingTime = document.querySelector(".meeting-time");
        const meetingLink = document.querySelector(".meeting-link");
        const meetingDuration = document.querySelector(".meeting-duration");

        var dataId = e.target.parentNode.parentNode.dataset.key;
        console.log(dataId);

        const formInputValue = data[dataId];
        console.log(formInputValue, dataId);

        meetingTitle.value = formInputValue.title;
        meetingTime.value = formInputValue.time;
        meetingLink.value = formInputValue.link;
        meetingDuration.value = formInputValue.duration;

        const saveEditBtn = document.querySelector(".save-edit");
        saveEditBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log("event listadded")
            updateData(dataId);
        }, {once: true});
        // saveEditBtn.removeEventListener("click", (e) => {
        //     e.preventDefault();
        //     e.stopImmediatePropagation();
        //     console.log("event listadded")
        //     updateData(dataId);
        // });
    }
    // meetingTitle.value = 
    // modal.classList.toggle("popup-hidden");
}

const showStatus = (text, status) => {
    updateStatusWrapper.innerHTML = `${status === 0? `<p style="color: red">${text}</p>`:`<p style="color: green">${text}</p>`}`
    updateStatusWrapper.classList.toggle("update-status-hidden");
    setTimeout(() => {
        updateStatusWrapper.classList.toggle("update-status-hidden");
    }, 2000);
}

const deleteData = async (e) => {
    e.preventDefault();

    data = await obtainData();
    //console.log(data.data.filter((values) => values.id === e.target.parentNode.parentNode.dataset.key)[0])

    try {
        await fetch("/delete-schedule", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: e.target.parentNode.parentNode.dataset.key
            })
        });
        showStatus("Deletion successful!", 1);
        populateData(document.querySelector(".admin-container ol"));
        
    } catch(err) {
        console.log(err);
    }
}

const updateData = async (id) => {
    
    const formData = document.querySelector(".data-edit");
    const modifiedData = Object.fromEntries(new FormData(formData).entries());
    modifiedData.id = id;

    console.log(modifiedData);

    try {
        await fetch("/edit-schedule", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifiedData)
        });
        showStatus("Edit successful!", 1);
        populateData(document.querySelector(".admin-container ol"));
        modal.classList.toggle("popup-hidden");
        
    } catch(err) {
        console.log(err);
    }

}

const addData = async (e) => {
    e.preventDefault();
    modal.classList.toggle("popup-hidden");

    document.querySelector(".data-edit").reset();
    const saveEditBtn = document.querySelector(".save-edit");

    const result = await obtainData();

    console.log("addData() called here");

    var formData;
    var newData;

    const handleAddClick = async (e) => {
        
        e.preventDefault();
        e.stopImmediatePropagation();
        formData = document.querySelector(".data-edit");
        newData = Object.fromEntries(new FormData(formData).entries());
        newData.id = crypto.randomUUID();

        console.log("addData() called inside click eventlistener before POST request");

        try {
            await fetch("/add-schedule", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });
            showStatus("Added successfully!", 1);
            populateData(document.querySelector(".admin-container ol"));
            modal.classList.toggle("popup-hidden");
            formData = {};
            newData = {};
            console.log("addData() called inside click eventlistener after POST request");
        } catch(err) {
            console.log(err);
        }
    }

    saveEditBtn.addEventListener("click", (e) => handleAddClick(e), { once: true});
    formData = {};
    newData = {};
    console.log("addData() called outside click but cleared formData and newData", formData);
    // saveEditBtn.removeEventListener("click", handleAddClick);
}

window.onload = async (e) => {
    loading.classList.add("loaded");
    setTimeout(() => {
        loading.style.display = "none";
    }, 300);

    const olList = document.querySelector(".schedule-container ol");
    const addSchedule = document.querySelector(".admin-add");

    addSchedule.addEventListener("click", addData);

    await populateData(olList);

    const cancelEditBtn = document.querySelector(".cancel-edit");
    
    cancelEditBtn.addEventListener("click", toggleModal);
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