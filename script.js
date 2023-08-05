const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyButton = document.querySelector("[data-copybtn]")
const copyMsg = document.querySelector("[data-copyMsg]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const inputSlider = document.querySelector("[data-lengthSlider]")
const uppercaseCheck = document.querySelector("#uppercase")
const lowercaseCheck = document.querySelector("#lowercase")
const numbersCheck = document.querySelector("#numbers")
const symbolsCheck = document.querySelector("#symbols")
const allCheckBox = document.querySelectorAll("input[type=checkbox]")
const indicator = document.querySelector("[data-indication]")
const generateBtn = document.querySelector(".generateButton")
const symbols = "`!@#$%^&*(){}[];:'?/.>,<|\=-"


let password = ''
let passwordLength = 10
let checkCount = 1
uppercaseCheck.checked = true
handleSlider()
// set strength circle color to grey 
setIndicator("#E54B4B");

// set password length
function handleSlider(){   
    inputSlider.value = passwordLength
    lengthDisplay.innerText = passwordLength
    const min = inputSlider.min
    const max = inputSlider.max
    inputSlider.style.backgroundSize = (passwordLength*100/20) +"% 100%"
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 5px 2px ${color}`
}

function getRandomInteger(min, max){

    return Math.floor(Math.random()*(max-min) + min)
}

function generateRandomNumber(){
    return getRandomInteger(0,9)
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123))
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91))
}

function generateSymbol(){
    return symbols.charAt(getRandomInteger(0,symbols.length-1))
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6){
        setIndicator("#ff0")
    }else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied"
    }
    catch(error){
        copyMsg.innerText = "failed"
    }

    //To make the copy span visible
    copyMsg.classList.add("active")

    setTimeout(()=>{
        copyMsg.classList.remove("active")
    },1500)
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked) checkCount++
    })

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider()
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click', () => {
    if(passwordDisplay.value) copyContent()
})

generateBtn.addEventListener('click', () => {

    if(checkCount == 0)  return

    if(checkCount > passwordLength){
    passwordLength = checkCount
        handleSlider()
    }

    password = ""

    let funcArr = []

    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //Compulsory Things
    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]()
    }
    //remaining addition
    for(let i = 0; i < passwordLength-funcArr.length; i++){
        let randomIndex = getRandomInteger(0,funcArr.length)
        password += funcArr[randomIndex]()
    }

    password = shufflePassword(Array.from(password))

    passwordDisplay.value = password

    calculateStrength()

})