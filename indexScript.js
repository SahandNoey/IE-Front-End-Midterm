// show an element by id
function show(id, message) {
    if(message !== "") {
        document.getElementById(id).innerHTML = message;
    }
    document.getElementById(id).style.visibility = "visible";
}


// hide an element by id
function hide(id) {
    document.getElementById(id).style.visibility = "hidden";
}

// call url on click submit button
function onClickSubmit(event) {
    event.preventDefault();
    show("gender", "Gender: -");
    show("probability", "Probability: -");
    hide("err");
    hide("saved-answer");

    let inputName = document.getElementById("box-name").value;
    // console.log(inputName)

    // validation
    let isValid = validInput(inputName);
    if(!isValid) {
        invalidMessage(inputName);
        return;
    } 
    // fetch from url
    else { 
        document.getElementById("err").style.color = getComputedStyle(document.body).getPropertyValue("--err-color");
        fetch(`https://api.genderize.io/?name=${inputName}`)
        .then(response => {
            if(!response.ok) {
                show("err", "Error: Network error")
                return; 
            }
            return response.json();
        })
        .then(data => {
            if(data.gender === null) {
                hide("probability");
                show("gender", "Gender: I don't know :(");
                show("err", "Error: This name doesn't exist in database!")
            } else {
                console.log(data.gender, data.probability);
                show("gender", `Gender: ${data.gender}`);
                show("probability", `Probability: ${data.probability}`);
            }
        })

        showSavedAnswer(inputName);
    }
}

// show saved answer if exist
function showSavedAnswer(inputName) {
    inputName = inputName.toLowerCase();
    savedGender = localStorage.getItem(inputName);
    if(savedGender !== null) {
        savedGender = savedGender.toUpperCase();
        document.getElementById("saved-gender").style.color = getComputedStyle(document.body).getPropertyValue("--success-color");
        show("saved-gender", `Saved: ${savedGender}`);
        show("clear", "");
    }
}

function onClickClear() {
    console.log("here clear")
    let savedName = document.getElementById("box-name").value;
    savedName = savedName.toLowerCase();
    localStorage.removeItem(savedName);
    hide("saved-gender");
    hide("clear")
}

// show invalid message
function invalidMessage(inputName) {
    let errMessage = "";
    if(inputName.length < 1 || inputName.length > 255) {
        errMessage = "Error: Number of letters should be between 1 to 255";
    } else {
        errMessage = "Error: Input name can only include English letters and spaces.";
    }

    show("err", errMessage)
    return;
}

// save button on click
function onClickSave(event) {
    event.preventDefault();
    document.getElementById("err").style.color = getComputedStyle(document.body).getPropertyValue("--err-color");
    let inputName = document.getElementById("box-name").value;
    let isValid = validInput(inputName);
    if(!isValid) {
        invalidMessage(inputName);
        return;
    } else {
       let gender = document.querySelector('input[name = "gender"]:checked')
       if(gender === null) {
            show("err", "Error: First choose one gender!")
            return;
       } else {
            if(localStorage.getItem(inputName) !== null) {
                localStorage.removeItem(inputName);
            }
            inputName = inputName.toLowerCase();
            gender = gender.value;
            localStorage.setItem(inputName, gender);
            document.getElementById("err").style.color = getComputedStyle(document.body).getPropertyValue("--success-color");
            show("err", "Name gender saved successfully.");
       }
    }
}

// regex
function validInput(inputName) {
    let pattern = /^[a-zA-Z\s]{1,255}$/;
    // let t = pattern.test(inputName);
    // console.log(t);
    return pattern.test(inputName);
}

hide("saved-answer")
hide("err")
document.getElementById("submit").onclick = onClickSubmit;
document.getElementById("save").onclick = onClickSave;
document.getElementById("clear").onclick = onClickClear;

