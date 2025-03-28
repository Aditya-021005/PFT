let expenses = [];
let totalAmount = 0;
let chartInstance = null;

const mainSection = document.getElementById("main-section");
const expensesSection = document.getElementById("expenses-section");
const visualSection = document.getElementById("visual-section");
const balanceSection = document.getElementById("balance-section");

const mainBtn = document.getElementById("main-btn");
const expensesBtn = document.getElementById("expenses-btn");
const visualBtn = document.getElementById("visual-btn");
const balanceBtn = document.getElementById("balance-btn");
const themeBtn = document.getElementById("theme-btn");
const logoutBtn = document.getElementById("logout-btn");

const categorySelect = document.getElementById("category-select");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const statusText = document.getElementById("status-text");

const expensesTableBody = document.getElementById("expenses-table-body");
const totalAmountCell = document.getElementById("total-amount");

const incomeInput = document.getElementById("income-input");
const remainingBalance = document.getElementById("remaining-balance");
const calculateBalanceBtn = document.getElementById("calculate-balance");

const loginForm = document.getElementById("login-form");
const loginContainer = document.getElementById("login-container");
const mainContent = document.getElementById("main-content");
const captchaText = document.getElementById("captcha-text");
const captchaInput = document.getElementById("captcha-input");
const passwordField = document.getElementById("login-password");
const passwordToggle = document.querySelector(".input-box i");

document.addEventListener("DOMContentLoaded", function () {
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        captchaText.textContent = `${num1} + ${num2} = ?`;
        return num1 + num2;
    }

    let captchaAnswer = generateCaptcha();

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const id = document.getElementById("login-id").value;
        const password = passwordField.value;
        const enteredCaptcha = parseInt(captchaInput.value, 10);

        if (!id || !password) {
            alert("Email and password are required.");
            return;
        }

        if (enteredCaptcha !== captchaAnswer) {
            alert("Incorrect CAPTCHA. Try again.");
            captchaInput.value = "";
            captchaAnswer = generateCaptcha();
            return;
        }

        document.body.classList.remove("login-page");
        document.body.style.background = "url('background.jpg') no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";


        loginContainer.style.display = "none";
        mainContent.style.display = "block";
    });

    logoutBtn.addEventListener("click", function () {

        mainContent.style.display = "none";
        loginContainer.style.display = "flex"; 
    
        document.body.classList.remove("light-mode"); 
        localStorage.setItem("theme", "dark"); 
    
        document.body.classList.add("login-page");
        document.body.style.background = "url('background2.jpg') no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
    
        loginContainer.style.justifyContent = "center";
        loginContainer.style.alignItems = "center";
        loginContainer.style.height = "54vh"; 
    });
    
    passwordToggle.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            passwordToggle.classList.remove("fa-eye-slash");
            passwordToggle.classList.add("fa-eye");
        } else {
            passwordField.type = "password";
            passwordToggle.classList.remove("fa-eye");
            passwordToggle.classList.add("fa-eye-slash");
        }
    });

    showSection(mainSection);
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }
});

function showSection(sectionToShow) {
    [mainSection, expensesSection, visualSection, balanceSection].forEach(section => {
        section.style.display = "none";
        section.style.opacity = "0";
    });

    sectionToShow.style.display = "block";
    setTimeout(() => {
        sectionToShow.style.opacity = "1";
    }, 50);
}

mainBtn.addEventListener("click", () => showSection(mainSection));
expensesBtn.addEventListener("click", () => showSection(expensesSection));
visualBtn.addEventListener("click", () => {
    showSection(visualSection);
    updateChart();
});
balanceBtn.addEventListener("click", () => showSection(balanceSection));

addBtn.addEventListener("click", function () {
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (!category || isNaN(amount) || amount <= 0 || !date) {
        showStatusMessage("Please enter valid details", "red");
        return;
    }

    expenses.push({ category, amount, date });
    updateTable();
    showStatusMessage("Successfully Added", "green");

    amountInput.value = "";
    dateInput.value = "";
});

function updateTable() {
    expensesTableBody.innerHTML = "";
    totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    expenses.forEach((expense, index) => {
        const row = expensesTableBody.insertRow();
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.date}</td>
            <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
        `;
    });

    totalAmountCell.textContent = `$${totalAmount.toFixed(2)}`;
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateTable();
}
function updateChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    const categoryTotals = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ["#4CAF50", "#f44336", "#FFC107", "#2196F3"],
            }],
        }
    });
}

calculateBalanceBtn.addEventListener("click", function () {
    const income = parseFloat(incomeInput.value) || 0;
    const balance = income - totalAmount;
    remainingBalance.textContent = `$${balance.toFixed(2)}`;
});
function showStatusMessage(message, color) {
    statusText.textContent = message;
    statusText.style.color = color;
    statusText.classList.remove("hidden");

    setTimeout(() => {
        statusText.classList.add("hidden");
    }, 2000);
}
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
});