const buttons = Array.from(document.querySelectorAll('button'));
const display = document.querySelector('.interface_current');

let currentValue = '0';
let lastElement = '';
let operationStore = [];

buttons.forEach((btn) => {
    let action = btn.getAttribute('action')
    btn.addEventListener('click', () => {
        switch (action) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                mathNumberOperations(action);
                break;
            case 'AC':
                clearInterface();
                break;
            case '=':
                equals();
                break;
            case '+':
            case '÷':
            case 'x':
            case '-':
                operatorsMath(action);
                break;
            case '%':
                rounded();
                break;
            case '.':
                addComma(action);
                break;
            case 'c':
                deleteFromValue();
                break;
            case '∓':
                changeToOpposite();
                break;
        }
    })
})


function plus(firstNum, secondNum) {
    return roundNum((firstNum + secondNum), 8);
}

function minus(firstNum, secondNum) {
    return roundNum((firstNum - secondNum), 8);
}

function multiply(firstNum, secondNum) {
    return roundNum((firstNum * secondNum), 8);
}

function divide(firstNum, secondNum) {
    return secondNum != 0 ? roundNum((firstNum / secondNum), 8) : 'Not a number';
}


function operate(firstNum, secondNum, operator) {
    switch (operator) {
        case '+':
            return plus(firstNum, secondNum);
        case '-':
            return minus(firstNum, secondNum);
        case 'x':
            return multiply(firstNum, secondNum);
        case '÷':
            return divide(firstNum, secondNum);
        default:
            break;
    }
}

function mathOperation(firstOperator, secondOperator) {
    while (operationStore.some(element => element == firstOperator || element == secondOperator)) {
        operationStore.map((element, index, array) => {
            if (element == firstOperator || element == secondOperator) {
                array.splice(index - 1, 3, operate(array[index - 1], array[index + 1], element));
            }
        });
    }
}

function populateDisplay() {
    display.value = currentValue;
}

function mathNumberOperations(value) {
    if (currentValue == '0' || operationStore.length == 1) {
        operationFinished = false;
        operationStore = [];
        currentValue = value;
        lastElement = value;
    } else {
        currentValue += value;
        lastElement += value;
    }
    populateDisplay();
}

function rounded() {
    if (/[÷x+-]/.test(currentValue)) {
        equals();
    }

    currentValue = String(parseFloat(currentValue) / 100);
    
    if (currentValue.includes('.')) {
        currentValue = String(roundNum(+currentValue, 8))
    }

    populateDisplay();
}

function clearInterface() {
    currentValue = '0';
    lastElement = '';
    operationStore = [];
    populateDisplay();
}

function isExistLastElement() {
    if (lastElement != '') operationStore.push(parseFloat(lastElement));
}

function isExistZeroAfterDevide() {
    if (operationStore.some(element => element == 'Not a number')) operationStore = ['Not a number'];
}

function roundNum(number, precision) {
    let factor = Math.pow(10, precision);
    let n = precision < 0 ? number : 0.01 / factor + number;
    return Math.round(n * factor) / factor;
}

function equals() {
    if (currentValue.match(/[÷x+-]*$/g) == "" && currentValue != '0') {
        isExistLastElement();
        mathOperation('÷', 'x');
        isExistZeroAfterDevide();
        mathOperation('+', '-');
        currentValue = operationStore.toString();
        lastElement = '';
        populateDisplay();
    }
}

function operatorsMath(value) {
    if (currentValue.match(/[÷x+-]*$/g) == "" && currentValue != '0' && currentValue != 'Not a number') {
        isExistLastElement();
        operationStore.push(value);
        currentValue += value;
        lastElement = '';
        populateDisplay();
    }
}

function addComma(value) {
    if (lastElement.match(/[.]/gi) == null) {
        currentValue += value;
        console.log(currentValue)
        lastElement += value;
        populateDisplay();
    }
} 

function deleteLastValue() {
    let lastElement = operationStore.pop().toString();
    if (lastElement.length != 1) {
        operationStore.push(parseFloat(lastElement.substring(0, lastElement.length - 1)));
    }
}

function deleteFromValue() {
    isExistLastElement();
    lastElement = '';
    if (currentValue.length == 1 || currentValue == 'Not a number') {
        currentValue = '0';
        lastElement = '';
        operationStore.pop();
    } else {
        lastElement = lastElement.substring(0, lastElement.length - 1);
        currentValue = currentValue.substring(0, currentValue.length - 1);
        deleteLastValue();
    }
    populateDisplay();
}

function changeToOpposite() {
    let operatorLastElement = operationStore[operationStore.length - 1];
    if (operatorLastElement == '') {
        return;
    }
    if (operatorLastElement == '+') {
        changeOperation('-');
    }
    if (operatorLastElement == '-') {
        changeOperation('+');
    }
    if (operatorLastElement == '÷' || operatorLastElement == 'x') {
        lastElement = (parseFloat(lastElement) * -1).toString();
        currentValue = currentValue.replace(/([0-9]|[-]+[0-9])+$/g, lastElement);
    }
    if (currentValue.length >= 1 && currentValue.length <= 2 && currentValue != '0') {
        lastElement = (parseFloat(lastElement) * -1).toString();
        currentValue = lastElement;
    }
    populateDisplay();
}

function changeOperation(to) {
    operationStore.pop();
    operationStore.push(to);
    currentValue = currentValue.replace(/[+-]+[0-9]*$/g, to + lastElement);
}