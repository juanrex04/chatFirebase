const nameUser = document.getElementById("nameUser");
const btnLogin = document.getElementById("btnLogin");
const btnSignOff = document.getElementById("btnSignOff");
const chat = document.getElementById("chat");
const form = document.getElementById("form");
const text = document.getElementById("text");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    chat.innerHTML = "";
    actionSignOff();
    nameUser.innerHTML = user.displayName;
    contentChat(user);
  } else {
    actionLogin();
    nameUser.innerHTML = `BChat`;
    chat.innerHTML = `<p class="Lead mt-5 text-center"> Please Log-in to use this app!</p>`;
  }
});

const contentChat = (user) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(text.value);

    if (!text.value.trim()) {
      console.log("Empty");
      return;
    }

    firebase
      .firestore()
      .collection("chat")
      .add({
        textWrite: text.value,
        uid: user.uid,
        dateText: Date.now(),
      })
      .then((res) => {
        console.log("correct!");
      });

    text.value = "";
  });

  firebase
    .firestore()
    .collection("chat")
    .orderBy("dateText")
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("Chat added: ", change.doc.data());

          if (user.uid === change.doc.data().uid) {
            chat.innerHTML += `
            <div class="text-end">
                <span class="badge bg-primary">${
                  change.doc.data().textWrite
                }</span>
            </div>
            `;
          } else {
            chat.innerHTML += `
              <div class="text-start">
                <span class="badge bg-success">${
                  change.doc.data().textWrite
                }</span>
              </div>
              `;
          }

          chat.scrollTop = chat.scrollHeight
        }
      });
    });
};

const actionLogin = () => {
  console.log("User without register 😥");
  form.classList.add("d-none");

  btnLogin.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  });
};

const actionSignOff = () => {
  console.log("User register!");
  form.classList.remove("d-none");
  btnSignOff.addEventListener("click", () => {
    firebase.auth().signOut();
  });
};
