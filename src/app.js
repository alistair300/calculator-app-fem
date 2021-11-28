// DOM Elements
const body = document.querySelector('body');
const themes = document.querySelectorAll('.theme');

const previousOperandText = document.querySelector('[data-previous-operand]')
const currentOperandText = document.querySelector('[data-current-operand]')
const numberBtns = document.querySelectorAll('[data-number]')
const operationBtns = document.querySelectorAll('[data-operation]')
const equalsBtn = document.querySelector('[data-equals]')
const deleteBtn = document.querySelector('[data-delete]')
const clearBtn = document.querySelector('[data-reset]')

// themes
// grab the value from local storage and add it to body
const currentTheme = localStorage.getItem('theme');
body.classList.add(currentTheme);

// loop through each input and add a click event
themes.forEach(theme => {
    theme.addEventListener('click', () => {
        // get the data attribute of the clicked input
        const themeName = theme.getAttribute('data-theme');
        // change the theme color depending on the data attribute
        switch (themeName) {
            case 'theme-light':
                body.classList.remove('theme-dark', 'theme-purple');
                body.classList.add('theme-light');
                // add to local storage
                localStorage.setItem('theme', 'theme-light');
            break;
            case 'theme-purple':
                body.classList.remove('theme-light', 'theme-dark');
                body.classList.add('theme-purple');
                // add to local storage
                localStorage.setItem('theme', 'theme-purple');
            break;
            default:
                body.classList.remove('theme-light', 'theme-purple');
                body.classList.add('theme-dark');
                // add to local storage
                localStorage.setItem('theme', 'theme-dark');
        }
    })
});

// calculator
// create a calculator class
class Calculator {
    constructor(previousOperandText, currentOperandText) {
        this.previousOperandText = previousOperandText;
        this.currentOperandText = currentOperandText;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete(){
        this.currentOperand = 
        this.currentOperand.toString()
        .slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.operation = operation;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
        return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandText.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandText.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandText.innerText = '';
        }
    }

    calculate() {
        let result;
        const prevNum = parseFloat(this.previousOperand);
        const currentNum = parseFloat(this.currentOperand);
        if (isNaN(prevNum) || isNaN(currentNum)) return;
        switch (this.operation) {
            case '+':
                result = prevNum + currentNum;
                break;
            case '-':
                result = prevNum - currentNum;
                break;
            case '*':
                result = prevNum * currentNum;
                break;
            case '/':
                result = prevNum / currentNum;
                break;
            default:
                return;
        }
        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
    }
}

// instantiate a new calculator
const calculator = new Calculator(previousOperandText, currentOperandText);

// loop through each number button and add a click event
numberBtns.forEach(btn => {
    btn.addEventListener('click', () =>{
        calculator.appendNumber(btn.innerText);
        calculator.updateDisplay();
    })
})

// loop through each operation button and add a click event
operationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.chooseOperation(btn.innerText);
        calculator.updateDisplay();
    })
})

// add an event listener to the equals button
equalsBtn.addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
})

// add an event listener to the clear button
clearBtn.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})

// add an event listener to the delete button
deleteBtn.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
})