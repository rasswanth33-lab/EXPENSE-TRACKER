# Mini Expense Tracker

A simple and practical Expense Tracker built with HTML, CSS, JavaScript, and Python.

---

## 1. How do I run Part A and Part B?

### Part A (Web Application)
- Navigate to the project directory: `c:\Users\Dell\Desktop\EXPENSE TRACKER`
- Double-click `index.html` to open it in any web browser (Google Chrome, Firefox, Edge, etc.).
- No local server or installation is needed.
- You can add expenses, delete them, and filter by category. All expenses remain preserved on page refresh using `localStorage`.

### Part B (Python Program)
- Ensure Python 3 is installed.
- Open a terminal / command prompt in this directory.
- Run the summary script:
  ```bash
  python summary.py
  ```
- The script reads `expenses.csv`, prints the complete summary to the console, and writes the exact output into `summary.txt`.

---

## 2. What was the hardest part, and how did you solve it?

- **Handling dynamic total calculation with filtering:** Making sure the "Total Spent" dynamically matches only the filtered expenses currently visible on the screen, rather than always computing the entire unfiltered list.
- **Solving edge cases in CSV processing:** Handling corrupted rows, missing titles, non-numeric values, or an empty file cleanly in Python without crashing, while reporting which row was skipped and outputting friendly messages.

---

## 3. What did you learn that was new to you?

- Working with browser `localStorage` using `JSON.stringify` and `JSON.parse` to persist web state across refreshes.
- Using Python's built-in `csv.DictReader` with error handling (`ValueError`, `KeyError`) to read tabular data robustly and format reports cleanly.

---

## 4. If you had two more days, what would you add or improve?

- Add an **Edit** button to update existing expenses directly in the table.
- Display category-wise total spend cards / mini-chart directly on the web page.
- Add column sorting (by Date or Amount ascending/descending).
- Add an option to export web expenses directly to a downloadable CSV file.
