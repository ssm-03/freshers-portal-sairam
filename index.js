import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getFirestore, doc, getDoc, updateDoc, setDoc, deleteField } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const app = express();

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const firebaseConfig = {
    apiKey: "AIzaSyCTl3BDu7zVmy9QLqMDao31c6ZVOCeghM4",
    authDomain: "sairam-freshers.firebaseapp.com",
    projectId: "sairam-freshers",
    storageBucket: "sairam-freshers.appspot.com",
    messagingSenderId: "60215698703",
    appId: "1:60215698703:web:f33b8689373865bf5b8a7a"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

app.use("/public", express.static(path.join(__dirname, "public")));


app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/admin", async (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});

app.get("/portal", (req, res) => {
    res.sendFile(__dirname + "/portal.html");
});

app.get("/orientation", (req, res) => {
    res.sendFile(__dirname + "/orientation.html");
});

app.get("/schedule", async (req, res) => {
    const db = getFirestore(firebaseApp);
    try {
        const dbData = await getDoc(doc(db, "orientation", "meetings"));
        // console.log(dbData.data());
        res.status(200).json(dbData.data());
    } catch (err) {
        res.status(500).json({
            state: "Error loading data"
        });
    }
});

app.post("/delete-schedule", async (req, res) => {
    const meetingID = req.body.id;
    const delData = {
        [meetingID]: deleteField()
    }
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "orientation", "meetings");
    try {
        await updateDoc(docRef, delData);
        res.status(200).json({
            status: "deleted"
        });
    } catch(err) {
        console.log(err);
        res.send(err);
    }
});

app.post("/add-schedule", async (req, res) => {
    let meetingData = req.body;
    // console.log(meetingData);
    let addedData = {
        [meetingData.id]: {
            title: meetingData.title,
            link: meetingData.link,
            duration: meetingData.duration,
            time: meetingData.time
        }
    }
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "orientation", "meetings");
    try {
        // console.log(addedData);
        await updateDoc(docRef, addedData);
        res.status(200).json({
            status: "added"
        });
    } catch(err) {
        console.log(err);
        res.send(err);
    }
    meetingData = {};
    addedData  = {};
});

app.post("/edit-schedule", async (req, res) => {
    const meetingData = req.body;
    const modifiedData = {
        [meetingData.id]: {
            title: meetingData.title,
            link: meetingData.link,
            duration: meetingData.duration,
            time: meetingData.time
        }
    }
    // console.log(modifiedData);
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, "orientation", "meetings");
    try {
        await setDoc(docRef, modifiedData, { merge: true});
        res.status(200).json({
            status: "added"
        });
    } catch(err) {
        console.log(err);
        res.send(err);
    }
});

app.post("/save-info", async (req, res) => {
    const info = req.body.data;
    const id = req.body.id;

    const docRef = doc(db, "students", id);

    // console.log(docRef);
    // console.log(info);
    
    try{
        await setDoc(docRef, {
            hasSet: true,
            personalDetails: info.personalDetails,
            currentResidential: info.currentResidential,
            permanentAddress: info.permanentAddress,
            educationDetails: info.educationDetails,
            schoolCollegeAddress: info.schoolCollegeAddress,
            familyDetails: info.familyDetails,
            fatherDetails: info.fatherDetails,
            motherDetails: info.motherDetails,
            place: info.place,
            date: info.date
        });
        
        res.status(200).json({
            state: "ok"
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({
            state: "Internal Server Error"
        });
    }
});

app.get("/guide", (req, res) => {
    res.sendFile(__dirname + "/guide.html");
});

app.get("/profile", (req, res) => {
    res.sendFile(__dirname + "/profile.html");
});

app.get("/admission", (req, res) => {
    res.sendFile(__dirname + "/admission.html");
});

app.all("*", (req, res) => {
    res.status(404).send("<h1>ERROR: 404</h1><hr><h1>This path was not found</h1>");
});

app.listen(3000, () => {
    console.log(__dirname);
});
