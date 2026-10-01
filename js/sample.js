
let publicKey;
let privateKey;

const cryptoAlgorithm = {
    name: "RSA-OAEP",
    hash: "SHA-256"
};

function showMessage(text, color = "black") {
    const message = document.getElementById("message");
    message.textContent = text;
    message.style.color = color;
}

//SIGN UP FUNCTIONS
async function signUp() {
    const fullname = document.getElementById("full_name").value.trim();
    const username = document.getElementById("uname").value;
    const birthday = document.getElementById("bday").value;
    const password = document.getElementById("pword").value;

    if (!fullname || !username || !birthday || !password) {
        showMessage("Please fill out all the information needed.", "red");
        return;
    }

    const existingUser = localStorage.getItem("rsaUser");

      if (existingUser) {
        showMessage("A demo account already exists.", "red");
        return;
      }

    const user = {
        fullname: fullname,
        username: username,
        birthday: birthday,
        password: password
    };

    localStorage.setItem("rsaUser", JSON.stringify(user));

    showMessage("Sign-up successful. You may now log in.", "green");

    document.getElementById("full_name").value = "";
    document.getElementById("uname").value = "";
    document.getElementById("bday").value = "";
    document.getElementById("pword").value = "";
}

//LOGIN FUNCTIONS
async function login() {
    const username = document.getElementById("login_uname").value.trim();
    const password = document.getElementById("login_pword").value;

    const storedUser = localStorage.getItem("rsaUser");

    if (!storedUser) {
        showMessage("No account found. Please sign up first.", "red");
        return;
    }

    const user = JSON.parse(storedUser);

    if (username !== user.username || password !== user.password) {
        showMessage("Incorrect username or password.", "red");
        return;
    }

    await generateRSAKeys();

    document.getElementById("authPanel").classList.add("hidden");
    document.getElementById("welcomePanel").classList.remove("hidden");
    document.getElementById("currentUser").textContent = username;
    
    await showEncryptionExample();
}

//RSA
async function generateRSAKeys() {
    const keyPair = await crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
    },
    false,["encrypt", "decrypt"]);

    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;
}

//RSA ENCRYPTION AND DECRYPTION
async function showEncryptionExample() {
    const originalText = "Welcome to the RSA encryption demo.";

    const encoder = new TextEncoder();
    const originalData = encoder.encode(originalText);

    const encryptedData = await crypto.subtle.encrypt(cryptoAlgorithm,publicKey,originalData);
    const decryptedData = await crypto.subtle.decrypt(cryptoAlgorithm,privateKey,encryptedData);

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    document.getElementById("originalMessage").textContent = originalText;

    document.getElementById("encryptedMessage").textContent = arrayBufferToBase64(encryptedData);

    document.getElementById("decryptedMessage").textContent = decryptedText;
}

function arrayBufferToBase64(buffer) {const bytes = new Uint8Array(buffer);
        let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

      return btoa(binary);
}

//FOR POSTING MESSAGE
async function postMessage() {
    const postText = document.getElementById("postText").value.trim();

    if (!postText) {
        showMessage("Please enter a message to post.", "red");
        return;
    }

    const encoder = new TextEncoder();
    const originalData = encoder.encode(postText);

    const encryptedData = await crypto.subtle.encrypt(cryptoAlgorithm,publicKey,originalData);
    const decryptedData = await crypto.subtle.decrypt(cryptoAlgorithm,privateKey,encryptedData);

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedData);

    document.getElementById("originalMessage2").textContent = postText;
    document.getElementById("encryptedMessage2").textContent = arrayBufferToBase64(encryptedData);
    document.getElementById("decryptedMessage2").textContent = decryptedText;

    document.getElementById("postText").value = "";
}


function arrayBufferToBase64(buffer) {const bytes = new Uint8Array(buffer);
        let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

      return btoa(binary);
}

//LOGOUT FUNCTION
function logout() {
    publicKey = null;
    privateKey = null;

    document.getElementById("authPanel").classList.remove("hidden");
    document.getElementById("welcomePanel").classList.add("hidden");

    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";

    showMessage("You have logged out.", "green");
}
