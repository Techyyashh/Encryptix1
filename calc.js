document.addEventListener('DOMContentLoaded', function() {
    const displayOperation = document.getElementById('operation');
    const displayResult = document.getElementById('result');
    let currentOperand = '';
    let currentOperation = '';
    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let waitForSecondOperand = false;
    let memoryValue = 0;

    function updateDisplay() {
        displayOperation.textContent = currentOperation;
        displayResult.textContent = currentInput;
    }

    function clear() {
        currentOperand = '';
        currentOperation = '';
        currentInput = '0';
        firstOperand = null;
        operator = null;
        waitForSecondOperand = false;
        updateDisplay();
    }

    function handleNumberInput(number) {
        if (waitForSecondOperand) {
            currentInput = number;
            waitForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        currentOperation += number;
        updateDisplay();
    }

    function handleOperatorInput(op) {
        const inputValue = parseFloat(currentInput);
        if (operator && waitForSecondOperand) {
            operator = op;
            currentOperation = currentOperation.slice(0, -1) + op;
            return;
        }
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation(firstOperand, inputValue, operator);
            if (result === 'Error') {
                currentInput = 'Error';
            } else {
                currentInput = result.toString();
            }
            firstOperand = parseFloat(result.toFixed(7));
        }
        waitForSecondOperand = true;
        operator = op;
        currentOperation += op;
        updateDisplay();
    }

    function performCalculation(num1, num2, op) {
        switch (op) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                if (num2 === 0) {
                    return 'Error';
                } else {
                    return num1 / num2;
                }
            case '^':
                return Math.pow(num1, num2);
            default:
                return num2;
        }
    }

    function handleEqualInput() {
        const inputValue = parseFloat(currentInput);
        if (operator && !waitForSecondOperand) {
            const result = performCalculation(firstOperand, inputValue, operator);
            if (result === 'Error') {
                currentInput = 'Error';
            } else {
                currentInput = result.toString();
            }
            firstOperand = parseFloat(result.toFixed(7));
            operator = null;
            currentOperation = currentInput;
            updateDisplay();
        }
        waitForSecondOperand = true;
    }

    function addToMemory() {
        memoryValue += parseFloat(currentInput);
        currentOperation = `M+(${memoryValue})`;
        updateDisplay();
    }

    function subtractFromMemory() {
        memoryValue -= parseFloat(currentInput);
        currentOperation = `M-(${memoryValue})`;
        updateDisplay();
    }

    function recallMemory() {
        currentInput = memoryValue.toString();
        currentOperation = `MR(${memoryValue})`;
        updateDisplay();
    }

    function clearMemory() {
        memoryValue = 0;
        currentOperation = 'MC';
        updateDisplay();
    }

    function handleScientificOperation(op) {
        const inputValue = parseFloat(currentInput);
        switch (op) {
            case 'sin':
                currentInput = Math.sin(inputValue * (Math.PI / 180)).toFixed(7);
                currentOperation = `sin(${inputValue})`;
                break;
            case 'cos':
                currentInput = Math.cos(inputValue * (Math.PI / 180)).toFixed(7);
                currentOperation = `cos(${inputValue})`;
                break;
            case 'tan':
                currentInput = Math.tan(inputValue * (Math.PI / 180)).toFixed(7);
                currentOperation = `tan(${inputValue})`;
                break;
            case 'sqrt':
                if (inputValue < 0) {
                    currentInput = 'Error';
                    currentOperation = 'sqrt';
                } else {
                    currentInput = Math.sqrt(inputValue).toFixed(7);
                    currentOperation = `√(${inputValue})`;
                }
                break;
            default:
                break;
        }
        updateDisplay();
    }

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const { value } = button;
            if (value === 'C') {
                clear();
            } else if (value === '=') {
                handleEqualInput();
            } else if (['+', '-', '*', '/'].includes(value) || value === '^') {
                handleOperatorInput(value);
            } else if (['sin', 'cos', 'tan', 'sqrt'].includes(value)) {
                handleScientificOperation(value);
            } else if (value === 'M+') {
                addToMemory();
            } else if (value === 'M-') {
                subtractFromMemory();
            } else if (value === 'MR') {
                recallMemory();
            } else if (value === 'MC') {
                clearMemory();
            } else {
                handleNumberInput(value);
            }
        });
    });

    document.addEventListener('keydown', function(event) {
        const { key } = event;
        if (/[0-9]/.test(key)) {
            handleNumberInput(key);
        } else if (['+', '-', '*', '/'].includes(key) || key === '^') {
            handleOperatorInput(key);
        } else if (key === 'Enter' || key === '=') {
            handleEqualInput();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            clear();
        } else if (['sin', 'cos', 'tan', 'sqrt'].includes(key)) {
            handleScientificOperation(key);
        } else if (key === '.') {
            if (!currentInput.includes('.')) {
                currentInput += '.';
                currentOperation += '.';
                updateDisplay();
            }
        } else if (key === 'm') {
            addToMemory();
        } else if (key === 'n') {
            subtractFromMemory();
        } else if (key === 'r') {
            recallMemory();
        } else if (key === 'Delete' || key === 'Backspace') {
            clearMemory();
        }
    });
});
