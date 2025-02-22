let expenses = [];
let totalAmount = 0;
let chartInstance = null;

// Elements
const mainSection = document.getElementById("main-section");
const expensesSection = document.getElementById("expenses-section");
const visualSection = document.getElementById("visual-section");
const balanceSection = document.getElementById("balance-section");

const mainBtn = document.getElementById("main-btn");
const expensesBtn = document.getElementById("expenses-btn");
const visualBtn = document.getElementById("visual-btn");
const balanceBtn = document.getElementById("balance-btn");
const themeBtn = document.getElementById("theme-btn");

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
const dateFilter = document.getElementById("date-filter");

// Function to show only the selected section with fade-in effect
function showSection(sectionToShow) {
    // Hide all sections
    [mainSection, expensesSection, visualSection, balanceSection].forEach(section => {
        section.style.display = "none"; // Hide section
        section.style.opacity = "0"; // Reset opacity for fade-in effect
    });

    // Show the selected section
    sectionToShow.style.display = "block";

    // Fade-in effect
    setTimeout(() => {
        sectionToShow.style.opacity = "1";
    }, 50);
}

// Button Event Listeners
mainBtn.addEventListener("click", () => showSection(mainSection));
expensesBtn.addEventListener("click", () => showSection(expensesSection));
visualBtn.addEventListener("click", () => {
    showSection(visualSection);
    generateChart();
});
balanceBtn.addEventListener("click", () => showSection(balanceSection));

// Function to add expense
addBtn.addEventListener("click", function () {
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    if (!category || isNaN(amount) || amount <= 0 || !date) {
        showStatusMessage("Please enter valid details", "red");
        return;
    }

    // Add new expense
    expenses.push({ category, amount, date });
    updateTable();

    // Show success message
    showStatusMessage("Successfully Added", "green");

    // Clear input fields
    amountInput.value = "";
    dateInput.value = "";
});

// Function to update table
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

// Function to delete expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateTable();
}

// Function to generate Pie Chart
function generateChart() {
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
            datasets: [
                {
                    data: data,
                    backgroundColor: ["#4CAF50", "#f44336", "#FFC107", "#2196F3"],
                },
            ],
        },
    });
}

// Function to calculate balance
calculateBalanceBtn.addEventListener("click", function () {
    const income = parseFloat(incomeInput.value) || 0;
    const balance = income - totalAmount;
    remainingBalance.textContent = `$${balance.toFixed(2)}`;
});

// Function to show status messages
function showStatusMessage(message, color) {
    statusText.textContent = message;
    statusText.style.color = color;
    statusText.classList.remove("hidden");

    setTimeout(() => {
        statusText.classList.add("hidden");
    }, 2000);
}

// Function to toggle theme
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    // Save theme preference in local storage
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
});

// Apply saved theme on page load & Ensure "Main" is visible by default
window.onload = () => {
    showSection(mainSection); // Show the main section initially

    // Apply saved theme preference
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }
};
dateFilter.addEventListener("change", updateChart);
