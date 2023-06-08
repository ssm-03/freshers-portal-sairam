import { auth, signOut, onAuthStateChanged, db, doc, getDoc, collection, getDocs, setDoc } from "./config.js";

// const loading = document.querySelector(".loading");
const userBtn = document.querySelector(".user-btn");
const userMenu = document.querySelector(".user-menu");
const chevronIcon = document.querySelector(".chevron-down");
const signOutBtn = document.querySelector(".sign-out");
const userBtnName = document.querySelector(".user-btn-name");
const contentH1 = document.querySelector(".content h1");
const submitBtn = document.querySelector(".submit-form");
const reqBtn = document.querySelector(".request-edit");
const pdfbtn = document.querySelector(".pdf-btn");

const slugify = str => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

onAuthStateChanged(auth, (user) => {
    if (!user) location.href = '/';
    else {
        userBtnName.innerHTML = `Welcome, ${user.displayName.split(" ")[0]}`;
        contentH1.innerHTML = `Hello, ${user.displayName}`;
    };
    checkForm();
    reqBtn.onclick = async (e) => {
        try {
            const docRef = await doc(db, "requests", user.email.split("@")[0]);
            console.log(docRef)
            const reqRef = await getDocs(collection(db, "requests"));
            console.log(reqRef)
            if (reqRef.docs.some(elem => elem.id !== user.email.split("@")[0])){
                await setDoc(docRef, {
                    req: true
                });
                alert("Edit request sent successfully!");
            }
        } catch (error) {
            console.log(error)
            alert("There was an error in requesting edit. Please try again");
        }
    }
});

const handleForm = async () => {

    const personalDetails = document.querySelectorAll(".personal-details input");
    const personalDetailsData = {};
    personalDetails.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        personalDetailsData[key] = entry.value;
    });
    personalDetailsData.hostel = document.querySelector('input[type = radio]:checked').value;
    console.log(personalDetailsData);
    
    const currentResidential = document.querySelectorAll(".current-residential-address input");
    const currentResidentialDetails = {};
    currentResidential.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        currentResidentialDetails[key] = entry.value;
    });
    console.log(currentResidentialDetails);
    
    const permanentAddress = document.querySelectorAll(".permanent-residential-address input");
    const permanentAddressDetails = {};
    permanentAddress.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        permanentAddressDetails[key] = entry.value;
    });
    console.log(permanentAddressDetails);
    
    const educationDetails = document.querySelectorAll(".education-details input");
    const educationDetailsData = {};
    educationDetails.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        educationDetailsData[key] = entry.value;
    });
    console.log(educationDetailsData);
    
    const schoolCollegeAddress = document.querySelectorAll(".school input");
    const schoolCollegeAddressData = {};
    schoolCollegeAddress.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        schoolCollegeAddressData[key] = entry.value;
    });
    console.log(schoolCollegeAddressData);

    const familyDetails = document.querySelectorAll(".family-details input");
    const familyDetailsData = {};
    familyDetails.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        familyDetailsData[key] = entry.value;
    });
    console.log(familyDetailsData);

    const fatherDetails = document.querySelectorAll(".father-details input");
    const fatherDetailsData = {};
    fatherDetails.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        fatherDetailsData[key] = entry.value;
    });
    console.log(fatherDetailsData);

    const motherDetails = document.querySelectorAll(".mother-details input");
    const motherDetailsData = {};
    motherDetails.forEach((entry) => {
        let key = slugify(entry.parentNode.parentNode.children[0].innerText);
        motherDetailsData[key] = entry.value;
    });
    console.log(motherDetailsData);

    const detailsData = {
        personalDetails: personalDetailsData,
        currentResidential: currentResidentialDetails,
        permanentAddress: permanentAddressDetails,
        educationDetails: educationDetailsData,
        schoolCollegeAddress: schoolCollegeAddressData,
        familyDetails: familyDetailsData,
        fatherDetails: fatherDetailsData,
        motherDetails: motherDetailsData,
        place: document.querySelector("#place").value,
        date: document.querySelector("#date").value
    }

    const reqBody = {
        id: auth.currentUser.email.split("@")[0],
        data: detailsData
    }

    try{
        
        submitBtn.innerHTML = `<span class="loader"></span>`;
        submitBtn.classList.add("sign-in-disabled");    

        await fetch("/save-info", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        });
        alert("saved data successfully");
        location.href = '/profile';

    } catch (err) {
        alert("Error in saving data, try again");
    }
}

const checkForm = async () => {
    const docRef = doc(db, "students", auth.currentUser.email.split("@")[0]);

    try{
        const docSnap = await getDoc(docRef);
    
        if (docSnap.data().hasSet === true){
            submitBtn.classList.add("hidden");
            reqBtn.classList.remove("hidden");
            pdfbtn.classList.remove("hidden");  

            const docData = docSnap.data();
            console.log(docData);
    
            const personalDetails = document.querySelectorAll(".personal-details input");
            const personalDetailsData = docData.personalDetails;
            personalDetails.forEach((entry) => {
                entry.value = personalDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(personalDetailsData);
            
            const currentResidential = document.querySelectorAll(".current-residential-address input");
            const currentResidentialDetails = docData.currentResidential;
            currentResidential.forEach((entry) => {
                entry.value = currentResidentialDetails[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(currentResidentialDetails);
            
            const permanentAddress = document.querySelectorAll(".permanent-residential-address input");
            const permanentAddressDetails = docData.permanentAddress;
            permanentAddress.forEach((entry) => {
                entry.value = permanentAddressDetails[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(permanentAddressDetails);
            
            const educationDetails = document.querySelectorAll(".education-details input");
            const educationDetailsData = docData.educationDetails;
            educationDetails.forEach((entry) => {
                entry.value = educationDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(educationDetailsData);
            
            const schoolCollegeAddress = document.querySelectorAll(".school input");
            const schoolCollegeAddressData = docData.schoolCollegeAddress;
            schoolCollegeAddress.forEach((entry) => {
                entry.value = schoolCollegeAddressData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(schoolCollegeAddressData);
    
            const familyDetails = document.querySelectorAll(".family-details input");
            const familyDetailsData = docData.familyDetails;
            familyDetails.forEach((entry) => {
                entry.value = familyDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(familyDetailsData);
    
            const fatherDetails = document.querySelectorAll(".father-details input");
            const fatherDetailsData = docData.fatherDetails;
            fatherDetails.forEach((entry) => {
                entry.value = fatherDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(fatherDetailsData);
    
            const motherDetails = document.querySelectorAll(".mother-details input");
            const motherDetailsData = docData.motherDetails;
            motherDetails.forEach((entry) => {
                entry.value = motherDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                entry.setAttribute("disabled", true);
            });
            console.log(motherDetailsData);

            

        } else {
            const docData = docSnap.data();
            console.log(docData);
            
            if (docData.personalDetails === undefined) return;

            const personalDetails = document.querySelectorAll(".personal-details input");
            const personalDetailsData = docData.personalDetails;
            personalDetails.forEach((entry) => {
                entry.value = personalDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(personalDetailsData);
            
            const currentResidential = document.querySelectorAll(".current-residential-address input");
            const currentResidentialDetails = docData.currentResidential;
            currentResidential.forEach((entry) => {
                entry.value = currentResidentialDetails[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(currentResidentialDetails);
            
            const permanentAddress = document.querySelectorAll(".permanent-residential-address input");
            const permanentAddressDetails = docData.permanentAddress;
            permanentAddress.forEach((entry) => {
                entry.value = permanentAddressDetails[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(permanentAddressDetails);
            
            const educationDetails = document.querySelectorAll(".education-details input");
            const educationDetailsData = docData.educationDetails;
            educationDetails.forEach((entry) => {
                entry.value = educationDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(educationDetailsData);
            
            const schoolCollegeAddress = document.querySelectorAll(".school input");
            const schoolCollegeAddressData = docData.schoolCollegeAddress;
            schoolCollegeAddress.forEach((entry) => {
                entry.value = schoolCollegeAddressData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(schoolCollegeAddressData);
    
            const familyDetails = document.querySelectorAll(".family-details input");
            const familyDetailsData = docData.familyDetails;
            familyDetails.forEach((entry) => {
                entry.value = familyDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(familyDetailsData);
    
            const fatherDetails = document.querySelectorAll(".father-details input");
            const fatherDetailsData = docData.fatherDetails;
            fatherDetails.forEach((entry) => {
                entry.value = fatherDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(fatherDetailsData);
    
            const motherDetails = document.querySelectorAll(".mother-details input");
            const motherDetailsData = docData.motherDetails;
            motherDetails.forEach((entry) => {
                entry.value = motherDetailsData[slugify(entry.parentNode.parentNode.children[0].innerText)];
                // entry.setAttribute("disabled", true);
            });
            console.log(motherDetailsData);            
        }

    } catch(err) {
        console.log(err);
        alert("Some error displaying data. Please refresh.")
    }
}


window.onload = (e) => {
    // loading.classList.add("loaded");
    // setTimeout(() => {
    //     loading.style.display = "none";
    // }, 300);
    document.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        handleForm();
    });
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

