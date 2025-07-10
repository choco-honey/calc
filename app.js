const resultInput = document.getElementById('result');
let currentInput = ''; // 現在入力されている文字列
let operator = '';       // 選択されている演算子
let firstOperand = null; // 最初のオペランド

// 数字や小数点ボタンが押された時
function appendNumber(number) {
    // 最初の数字が'0'で、次に押されたのが'0'の場合、何もしない
    // ただし、小数点の場合は許容する
    if (currentInput === '0' && number === '0' && !currentInput.includes('.')) {
        return;
    }
    // 小数点が既に含まれている場合、再度小数点追加はしない
    if (number === '.' && currentInput.includes('.')) {
        return;
    }

    currentInput += number;
    resultInput.value = currentInput;
}

// 演算子ボタンが押された時
function appendOperator(op) {
    if (currentInput === '' && firstOperand === null) {
        // 何も入力されていない状態で演算子を押した場合、何もしない
        return;
    }

    if (firstOperand === null) {
        // 最初の演算子
        firstOperand = parseFloat(currentInput);
        operator = op;
        currentInput = ''; // 次の数字の入力を準備
    } else if (currentInput !== '') {
        // 連続して演算子を適用する場合
        calculateResultInternal(); // 現在の結果を計算
        operator = op;
    } else {
        // 演算子だけを変更する場合 (例: 10 + から 10 - へ変更)
        operator = op;
    }
    // 画面表示は、入力中の数字か、計算結果
    resultInput.value = firstOperand !== null ? firstOperand : currentInput;
}

// =ボタンが押された時 (計算実行)
function calculateResult() {
    if (firstOperand === null || currentInput === '') {
        return; // 計算に必要な情報が不足している場合
    }
    calculateResultInternal();
    operator = ''; // 計算が終わったので演算子をリセット
}

// 実際の計算ロジック
function calculateResultInternal() {
    let secondOperand = parseFloat(currentInput);
    let result = 0;

    switch (operator) {
        case '+':
            result = firstOperand + secondOperand;
            break;
        case '-':
            result = firstOperand - secondOperand;
            break;
        case '*':
            result = firstOperand * secondOperand;
            break;
        case '/':
            if (secondOperand === 0) {
                resultInput.value = 'Error'; // 0で割るエラー
                clearAllState(); // 全ての状態をリセット
                return;
            }
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    // 浮動小数点数の誤差を考慮して、結果を適切な桁数に丸める（例: 10桁）
    result = parseFloat(result.toPrecision(10));

    resultInput.value = result;
    firstOperand = result; // 次の計算のために結果を最初のオペランドに設定
    currentInput = '';      // 現在の入力をリセット
}

// C (クリア) ボタンが押された時
function clearResult() {
    clearAllState();
    resultInput.value = '';
}

// 全ての状態をリセットするヘルパー関数
function clearAllState() {
    currentInput = '';
    operator = '';
    firstOperand = null;
}

// DEL (デリート) ボタンが押された時
function deleteLast() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        resultInput.value = currentInput;
    } else if (firstOperand !== null && operator === '') {
        // 計算結果が表示されている状態でDELを押した場合、結果をクリア
        clearAllState();
        resultInput.value = '';
    }
}
