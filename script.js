
const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const errorMessage = document.getElementById("errorMessage");
const tableBody = document.getElementById("expenseTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const totalSpent = document.getElementById("totalSpent");
const categoryFilter = document.getElementById("categoryFilter");

// Summary card extra details
const expenseCountBadge = document.getElementById("expenseCountBadge");
const summaryFilterContext = document.getElementById("summaryFilterContext");

// Analytics elements
const donutSegmentsGroup = document.getElementById("donutSegmentsGroup");
const chartCenterTotal = document.getElementById("chartCenterTotal");
const analyticsLegend = document.getElementById("analyticsLegend");
const chartEmptyMessage = document.getElementById("chartEmptyMessage");
const analyticsContainer = document.querySelector(".analytics-container");

// Category definitions with refined financial palette:
// Emerald green, muted amber, slate, soft violet, and muted coral
const CATEGORY_CONFIG = {
    "Food": { color: "#D97706", badgeClass: "badge-food" },       // Muted Amber
    "Travel": { color: "#475569", badgeClass: "badge-travel" },    // Slate
    "Shopping": { color: "#7C3AED", badgeClass: "badge-shopping" },// Soft Violet
    "Bills": { color: "#DC2626", badgeClass: "badge-bills" },      // Muted Coral / Red
    "Other": { color: "#16845B", badgeClass: "badge-other" }       // Sophisticated Emerald
};

let expenses = [];
let nextId = 1;

// Save expenses in browser storage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update the circular SVG donut chart and legend
function updateSpendingAnalytics(filteredExpenses, total) {
    // Calculate category spending sums
    const categoryTotals = {
        "Food": 0,
        "Travel": 0,
        "Shopping": 0,
        "Bills": 0,
        "Other": 0
    };

    filteredExpenses.forEach(function (expense) {
        if (categoryTotals.hasOwnProperty(expense.category)) {
            categoryTotals[expense.category] += expense.amount;
        } else {
            categoryTotals["Other"] += expense.amount;
        }
    });

    // Update center total
    if (chartCenterTotal) {
        chartCenterTotal.textContent = "₹" + total.toFixed(2);
    }

    // Handle empty state gracefully
    if (total <= 0 || filteredExpenses.length === 0) {
        if (donutSegmentsGroup) donutSegmentsGroup.innerHTML = "";
        if (analyticsLegend) analyticsLegend.innerHTML = "";
        if (chartEmptyMessage) chartEmptyMessage.style.display = "block";
        if (analyticsContainer) analyticsContainer.style.opacity = "0.45";
        return;
    }

    if (chartEmptyMessage) chartEmptyMessage.style.display = "none";
    if (analyticsContainer) analyticsContainer.style.opacity = "1";

    // Geometry of the SVG Donut: radius = 75, circumference = 2 * pi * 75 ~= 471.2389
    const radius = 75;
    const circumference = 2 * Math.PI * radius;

    if (donutSegmentsGroup) {
        donutSegmentsGroup.innerHTML = "";
    }
    if (analyticsLegend) {
        analyticsLegend.innerHTML = "";
    }

    let accumulatedPercentage = 0;

    Object.keys(CATEGORY_CONFIG).forEach(function (cat) {
        const catAmount = categoryTotals[cat];
        const percentage = total > 0 ? (catAmount / total) * 100 : 0;
        const config = CATEGORY_CONFIG[cat];

        // 1. Draw SVG donut segment if amount > 0
        if (catAmount > 0 && donutSegmentsGroup) {
            const segment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            segment.setAttribute("class", "donut-segment");
            segment.setAttribute("cx", "100");
            segment.setAttribute("cy", "100");
            segment.setAttribute("r", radius.toString());
            segment.setAttribute("stroke", config.color);

            const segmentLength = (percentage / 100) * circumference;
            const strokeDasharray = `${segmentLength.toFixed(2)} ${(circumference - segmentLength).toFixed(2)}`;
            const strokeDashoffset = (-((accumulatedPercentage / 100) * circumference)).toFixed(2);

            segment.setAttribute("stroke-dasharray", strokeDasharray);
            segment.setAttribute("stroke-dashoffset", strokeDashoffset);

            // Add tooltip title for accessibility
            const titleElem = document.createElementNS("http://www.w3.org/2000/svg", "title");
            titleElem.textContent = `${cat}: ₹${catAmount.toFixed(2)} (${percentage.toFixed(1)}%)`;
            segment.appendChild(titleElem);

            donutSegmentsGroup.appendChild(segment);
            accumulatedPercentage += percentage;
        }

        // 2. Build Legend Item
        if (catAmount > 0 && analyticsLegend) {
            const li = document.createElement("li");
            li.className = "legend-item";

            // Left side: dot + name
            const leftDiv = document.createElement("div");
            leftDiv.className = "legend-left";

            const dot = document.createElement("span");
            dot.className = "legend-color-dot";
            dot.style.backgroundColor = config.color;

            const name = document.createElement("span");
            name.className = "legend-category-name";
            name.textContent = cat;

            leftDiv.append(dot, name);

            // Right side: amount + percentage
            const rightDiv = document.createElement("div");
            rightDiv.className = "legend-right";

            const amountSpan = document.createElement("span");
            amountSpan.className = "legend-amount";
            amountSpan.textContent = "₹" + catAmount.toFixed(2);

            const pctSpan = document.createElement("span");
            pctSpan.className = "legend-percentage";
            pctSpan.textContent = percentage.toFixed(1) + "%";

            rightDiv.append(amountSpan, pctSpan);

            li.append(leftDiv, rightDiv);
            analyticsLegend.appendChild(li);
        }
    });
}

// Display expenses in the table and sync analytics
function displayExpenses() {
    tableBody.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    const filteredExpenses = expenses.filter(function (expense) {
        return selectedCategory === "All" ||
            expense.category === selectedCategory;
    });

    let total = 0;

    filteredExpenses.forEach(function (expense) {
        total += expense.amount;

        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;

        const categoryCell = document.createElement("td");
        const categoryBadge = document.createElement("span");
        categoryBadge.className = "badge-category badge-" + expense.category.toLowerCase();
        categoryBadge.textContent = expense.category;
        categoryCell.appendChild(categoryBadge);

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;

        const amountCell = document.createElement("td");
        amountCell.className = "td-amount text-right";
        amountCell.textContent = "₹" + expense.amount.toFixed(2);

        const actionCell = document.createElement("td");
        actionCell.className = "text-center";
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.setAttribute("aria-label", "Delete " + expense.title);

        deleteButton.addEventListener("click", function () {
            expenses = expenses.filter(function (item) {
                return item.id !== expense.id;
            });

            saveExpenses();
            displayExpenses();
        });

        actionCell.appendChild(deleteButton);

        // Required columns: Title, Category, Date, Amount, Actions
        row.append(
            titleCell,
            categoryCell,
            dateCell,
            amountCell,
            actionCell
        );

        tableBody.appendChild(row);
    });

    totalSpent.textContent = "₹" + total.toFixed(2);

    // Update transaction count badge and filter context
    if (expenseCountBadge) {
        const count = filteredExpenses.length;
        expenseCountBadge.textContent = count === 1 ? "1 transaction" : count + " transactions";
    }

    if (summaryFilterContext) {
        summaryFilterContext.textContent = selectedCategory === "All"
            ? "Across all categories"
            : `Filtered by ${selectedCategory}`;
    }

    emptyMessage.style.display =
        filteredExpenses.length === 0 ? "block" : "none";

    // Synchronize spending analytics donut chart and legend
    updateSpendingAnalytics(filteredExpenses, total);
}

// Load saved expenses
function loadExpenses() {
    try {
        const savedExpenses = localStorage.getItem("expenses");

        if (savedExpenses) {
            const parsedExpenses = JSON.parse(savedExpenses);

            if (Array.isArray(parsedExpenses)) {
                expenses = parsedExpenses.filter(function (expense) {
                    return expense &&
                        Number.isSafeInteger(expense.id) &&
                        typeof expense.title === "string" &&
                        typeof expense.amount === "number" &&
                        Number.isFinite(expense.amount) &&
                        expense.amount > 0 &&
                        typeof expense.category === "string" &&
                        typeof expense.date === "string";
                });
            }
        }
    } catch (error) {
        expenses = [];
    }

    nextId = expenses.reduce(function (maximum, expense) {
        return Math.max(maximum, expense.id);
    }, 0) + 1;

    displayExpenses();
}

// Add a new expense
expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const amountText = amountInput.value.trim();
    const amount = Number(amountText);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (title === "") {
        errorMessage.textContent =
            "Please enter an expense title.";
        return;
    }

    if (
        amountText === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        errorMessage.textContent =
            "Please enter an amount greater than zero.";
        return;
    }

    if (date === "") {
        errorMessage.textContent =
            "Please select a date.";
        return;
    }

    const validCategories = [
        "Food", "Travel", "Shopping", "Bills", "Other"
    ];

    if (!validCategories.includes(category)) {
        errorMessage.textContent =
            "Please select a valid category.";
        return;
    }

    errorMessage.textContent = "";

    const expense = {
        id: nextId++,
        title: title,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);

    saveExpenses();
    displayExpenses();

    expenseForm.reset();
});

// Filter expenses by category
categoryFilter.addEventListener("change", function () {
    displayExpenses();
});

// Start the application
loadExpenses();
