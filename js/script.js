const nameUser = document.getElementById("nameUser");
const btnLogin = document.getElementById("btnLogin");
const btnSignOff = document.getElementById("btnSignOff");
const chat = document.getElementById("chat");
const form = document.getElementById("form");
const text = document.getElementById("text");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {

    actionSignOff();
    nameUser.innerHTML = user.displayName
    console.log(user.uid)
    console.log(user.displayName)
    contentChat(user)
  } else {
    actionLogin();
    nameUser.innerHTML = `BChat`
  }
});

const contentChat = user =>{
    
    form.addEventListener('submit', e =>{
        e.preventDefault()
        console.log(text.value)

        if(!text.value.trim()){
            console.log('Empty')
            return
        }

        firebase.firestore().collection('chat').add({
           textWrite: text.value,
           uid: user.uid,
           dateText: Date.now()
        }).then(res => {
            console.log('correct!')
        })

        text.value = "";
    })
}

const actionLogin = () => {
  console.log("User without register 😥");
  form.classList.add("d-none");
  chat.innerHTML = `
  <p class="Lead mt-5 text-center"> Please Log-in to use this app!</p>`;

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
    firebase.auth().signOut()
  });
};
