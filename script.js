/* ===========================
   GLOBAL VARIABLES
=========================== */
let currentPage = 1;
let maxPages = 100;
let walletBalance = Number(localStorage.getItem("wallet")) || 0;
let diaryData = JSON.parse(localStorage.getItem("diaryData")) || {};
let userPIN = localStorage.getItem("userPIN") || null;
let currentUser = localStorage.getItem("currentUser") || null;
let bright = 100;

/* ===========================
   ELEMENT REFERENCES
=========================== */
const bgMusic = document.getElementById("bgMusic");
bgMusic.src = "music.mp3"; // updated music file

const authCard = document.querySelector(".card");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const signupUser = document.getElementById("signupUser");
const signupPass = document.getElementById("signupPass");
const signupConfirm = document.getElementById("signupConfirm");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const loginMsg = document.getElementById("loginMsg");
const signupMsg = document.getElementById("signupMsg");

const pinScreen = document.getElementById("pinScreen");
const pinInput = document.getElementById("pinInput");
const createPinBtn = document.getElementById("createPinBtn");
const resetPinBtn = document.getElementById("resetPinBtn");

const lockerScreen = document.getElementById("lockerScreen");
const lockerVideo = document.getElementById("lockerVideo");
const lockerSound = document.getElementById("lockerSound");

const openDiaryScreen = document.getElementById("openDiaryScreen");
const openDiaryBtn = document.getElementById("openDiaryBtn");

const bookScreen = document.getElementById("bookScreen");
const bookVideo = document.getElementById("bookVideo");

const diaryScreen = document.getElementById("diaryScreen");
const walletAmount = document.getElementById("walletAmount");
const addBalanceBtn = document.getElementById("addBalanceBtn");
const diaryText = document.getElementById("diaryText");
const saveDiaryBtn = document.getElementById("saveDiaryBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const jumpPageInput = document.getElementById("jumpPageInput");
const currentPageSpan = document.getElementById("currentPage");
const totalPagesSpan = document.getElementById("totalPages");
const stopBgBtn = document.getElementById("stopBgBtn");

const accountBtn = document.getElementById("accountBtn");
const accountOverlay = document.getElementById("accountOverlay");
const accountPopup = document.getElementById("accountPopup");
const profilePhotoInput = document.getElementById("profilePhoto");
const saveAccountBtn = document.getElementById("saveAccountBtn");
const closeAccountBtn = document.getElementById("closeAccountBtn");

const brightnessBtn = document.getElementById("brightnessBtn");
const downloadBtn = document.getElementById("downloadBtn");

const paymentOverlay = document.getElementById("paymentOverlay");
const paymentPopup = document.getElementById("paymentPopup");
const addAmountInput = document.getElementById("addAmountInput");
const txnIdInput = document.getElementById("txnIdInput");
const confirmAddBtn = document.getElementById("confirmAddBtn");
const closePaymentBtn = document.getElementById("closePaymentBtn");

const limitOverlay = document.getElementById("limitOverlay");
const limitPopup = document.getElementById("limitPopup");

const logoutBtn = document.getElementById("logoutBtn");

/* ===========================
   BACKGROUND MUSIC
=========================== */
let bgMusicStarted = false;
let bgMusicPlaying = true; // music toggle flag
function startBgMusic() {
    if (!bgMusicStarted) {
        bgMusic.volume = 0.4;
        bgMusic.muted = false;
        bgMusic.play().catch(()=>{});
        bgMusicStarted = true;
        bgMusicPlaying = true;
    }
}
document.addEventListener("click", startBgMusic, { once: true });
document.addEventListener("touchstart", startBgMusic, { once: true });
loginBtn.addEventListener("click", startBgMusic);
signupBtn.addEventListener("click", startBgMusic);

/* ===========================
   LOGIN / SIGNUP SWITCH
=========================== */
loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
});
signupTab.addEventListener("click", () => {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
});

/* ===========================
   SIGNUP
=========================== */
signupBtn.addEventListener("click", () => {
    const user = signupUser.value.trim();
    const pass = signupPass.value.trim();
    const confirm = signupConfirm.value.trim();
    if(!user || !pass || !confirm){ signupMsg.innerText="Fill all fields"; return; }
    if(pass!==confirm){ signupMsg.innerText="Passwords do not match"; return; }
    localStorage.setItem("user_"+user, pass);
    signupMsg.innerText="Signup successful! Login now.";
    signupUser.value=signupPass.value=signupConfirm.value="";
});

/* ===========================
   LOGIN
=========================== */
loginBtn.addEventListener("click", () => {
    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();
    const storedPass = localStorage.getItem("user_" + user);
    if(!storedPass){ loginMsg.innerText="User does not exist. Signup first."; return; }
    if(storedPass!==pass){ loginMsg.innerText="Invalid username or password"; return; }

    currentUser=user;
    localStorage.setItem("currentUser",currentUser);
    authCard.style.display="none";

    // START MUSIC if not playing
    if(!bgMusicStarted){
        bgMusic.volume = 0.4;
        bgMusic.muted = false;
        bgMusic.play().catch(()=>{});
        bgMusicStarted = true;
        bgMusicPlaying = true;
    }else{
        bgMusic.play().catch(()=>{});
        bgMusicPlaying = true;
    }

    // Show PIN screen if PIN not set
    if(!userPIN){
        pinScreen.classList.remove("hidden");
    }else{
        playLockerSequence();
    }
});

/* ===========================
   PIN CREATION
=========================== */
createPinBtn.addEventListener("click",()=>{
    const pin=pinInput.value.trim();
    if(pin.length!==4){ alert("Enter 4 digit PIN"); return; }
    userPIN=pin;
    localStorage.setItem("userPIN",userPIN);
    alert("PIN Created Successfully!");
    pinScreen.classList.add("hidden");
    playLockerSequence();
});

// PIN RESET WITH SECURITY QUESTIONS
resetPinBtn.addEventListener("click",()=>{
    // prompt for three security questions (leave empty allowed)
    const favPlace = prompt("Security Question 1: Your Favorite Place?");
    const favFood = prompt("Security Question 2: Your Favorite Food?");
    const favPerson = prompt("Security Question 3: Your Favorite Person?");
    // Remove PIN regardless of answers
    localStorage.removeItem("userPIN");
    userPIN=null;
    alert("PIN Reset Successfully! Create New PIN");
    pinScreen.classList.remove("hidden");
});

// ===========================
// LOCKER SEQUENCE
// ===========================
function playLockerSequence(){
    lockerScreen.classList.remove("hidden");
    lockerVideo.currentTime=0;
    lockerVideo.play();
    lockerSound.currentTime=0;
    lockerSound.play();

    lockerVideo.onended = () => {
        lockerSound.pause();
        lockerScreen.classList.add("hidden");
        openDiaryScreen.classList.remove("hidden");
    };
}

/* ===========================
   OPEN DIARY
=========================== */
openDiaryBtn.addEventListener("click",()=>{
    openDiaryScreen.classList.add("hidden");
    bookScreen.classList.remove("hidden");
    bookVideo.currentTime=0;
    bookVideo.play();
});
bookVideo.addEventListener("ended",()=>{
    bookScreen.classList.add("hidden");
    diaryScreen.classList.remove("hidden");
    loadWallet();
    loadPage();
    applyDiaryButtonColors();
});

/* ===========================
   STOP/PLAY BACKGROUND MUSIC BUTTON
=========================== */
stopBgBtn.addEventListener("click", ()=>{
    if(bgMusicPlaying){
        bgMusic.pause();
        bgMusicPlaying=false;
        stopBgBtn.innerText="Play Music";
    }else{
        bgMusic.play().catch(()=>{});
        bgMusicPlaying=true;
        stopBgBtn.innerText="Stop Music";
    }
});

/* ===========================
   BUTTON COLOR IN DIARY SCREEN
=========================== */
function applyDiaryButtonColors(){
    const diaryButtons = diaryScreen.querySelectorAll("button");
    diaryButtons.forEach(btn=>{
        btn.style.backgroundColor = "#007BFF"; // blue
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
    });
}

/* ===========================
   WALLET
=========================== */
function loadWallet(){
    walletBalance=Number(localStorage.getItem("wallet"))||0;
    walletAmount.innerText=walletBalance.toFixed(2);
}
addBalanceBtn.addEventListener("click",()=>{
    paymentOverlay.classList.add("active");
    paymentPopup.classList.add("active");
});
confirmAddBtn.addEventListener("click",()=>{
    const amt=Number(addAmountInput.value);
    const txn=txnIdInput.value.trim();
    if(!amt||amt<=0){ alert("Enter valid amount"); return; }
    if(!txn){ alert("Enter transaction ID"); return; }
    walletBalance+=amt;
    localStorage.setItem("wallet",walletBalance);
    walletAmount.innerText=walletBalance.toFixed(2);
    alert("Payment Successful!\nTxn ID: "+txn);
    paymentOverlay.classList.remove("active");
    paymentPopup.classList.remove("active");
    addAmountInput.value="";
    txnIdInput.value="";
});
closePaymentBtn.addEventListener("click", ()=>{
    paymentOverlay.classList.remove("active");
    paymentPopup.classList.remove("active");
});
paymentOverlay.addEventListener("click",()=>{
    paymentOverlay.classList.remove("active");
    paymentPopup.classList.remove("active");
});

/* ===========================
   DIARY PAGES
=========================== */
function loadPage(){
    currentPageSpan.innerText=currentPage;
    totalPagesSpan.innerText=maxPages;
    diaryText.value=diaryData[currentPage]?diaryData[currentPage].text:"";
}
saveDiaryBtn.addEventListener("click",()=>{
    diaryData[currentPage]={text:diaryText.value};
    localStorage.setItem("diaryData",JSON.stringify(diaryData));
    alert("Page Saved");
});
nextPageBtn.addEventListener("click",()=>{
    if(currentPage<maxPages){ currentPage++; loadPage(); }
    else{ limitOverlay.classList.add("active"); limitPopup.classList.add("active"); }
});
prevPageBtn.addEventListener("click",()=>{
    if(currentPage>1){ currentPage--; loadPage(); }
});
jumpPageInput.addEventListener("change",()=>{
    const pg=Number(jumpPageInput.value);
    if(pg>=1&&pg<=maxPages){ currentPage=pg; loadPage(); }
    else{ alert("Invalid page number"); }
});

/* ===========================
   PURCHASE EXTRA PAGES
=========================== */
limitPopup.querySelectorAll("button").forEach(btn=>{
    btn.addEventListener("click",()=>{
        const pages=Number(btn.dataset.pages);
        const cost=Number(btn.dataset.price);
        if(walletBalance<cost){ alert("Insufficient Balance"); return; }
        walletBalance-=cost;
        maxPages+=pages;
        walletAmount.innerText=walletBalance.toFixed(2);
        limitOverlay.classList.remove("active");
        limitPopup.classList.remove("active");
        alert("Pages Added Successfully!");
    });
});

/* ===========================
   ACCOUNT POPUP
=========================== */
accountBtn.addEventListener("click",()=>{
    if(diaryScreen.classList.contains("hidden")) return;
    accountOverlay.classList.add("active");
    accountPopup.classList.add("active");
});
closeAccountBtn.addEventListener("click",()=>{
    accountOverlay.classList.remove("active");
    accountPopup.classList.remove("active");
});
saveAccountBtn.addEventListener("click",()=>{
    alert("Account Saved!");
    accountOverlay.classList.remove("active");
    accountPopup.classList.remove("active");
});
profilePhotoInput.addEventListener("change",(e)=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=()=>{
        let img=accountPopup.querySelector("img");
        if(!img){
            img=document.createElement("img");
            img.style.width="80px";
            img.style.height="80px";
            img.style.borderRadius="50%";
            accountPopup.prepend(img);
        }
        img.src=reader.result;
    };
    reader.readAsDataURL(file);
});
accountOverlay.addEventListener("click",()=>{
    accountOverlay.classList.remove("active");
    accountPopup.classList.remove("active");
});

/* ===========================
   LOGOUT
=========================== */
logoutBtn.addEventListener("click",()=>{
    if(confirm("Are you sure to logout?")){
        currentUser=null;
        userPIN=null;
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userPIN");
        authCard.style.display="block";
        diaryScreen.classList.add("hidden");
        openDiaryScreen.classList.add("hidden");
        bookScreen.classList.add("hidden");
        pinScreen.classList.add("hidden");
        lockerScreen.classList.add("hidden");
    }
});

/* ===========================
   BRIGHTNESS
=========================== */
brightnessBtn.addEventListener("click",()=>{
    bright=bright===100?50:100;
    diaryScreen.style.filter=`brightness(${bright}%)`;
});

/* ===========================
   DOWNLOAD
=========================== */
downloadBtn.addEventListener("click",()=>{
    const blob=new Blob([JSON.stringify(diaryData,null,2)],{type:"text/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`Diary_${currentUser||"User"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("Diary downloaded (demo)");
});
