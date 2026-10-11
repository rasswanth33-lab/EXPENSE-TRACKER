import csv

filename = "expenses.csv"

total = 0.0
category_totals = {}
highest_expense = None
expense_count = 0

try:
    with open(filename, "r", newline="", encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)

        for row_number, row in enumerate(reader, start=2):
            try:
                amount = float(row["amount"])
                title = row["title"].strip()
                category = row["category"].strip()

                if not title or amount <= 0:
                    raise ValueError

            except (ValueError, TypeError, KeyError):
                print(f"Skipped invalid row {row_number}.")
                continue

            total += amount
            expense_count += 1

            category_totals[category] = (
                category_totals.get(category, 0) + amount
            )

            if highest_expense is None or amount > highest_expense["amount"]:
                highest_expense = {
                    "title": title,
                    "amount": amount
                }

    if expense_count == 0:
        summary = "No expenses found."
    else:
        lines = [
            f"Total amount spent: {total:.2f}",
            "",
            "Spending by category:"
        ]

        for category, amount in category_totals.items():
            lines.append(f"{category}: {amount:.2f}")

        lines.extend([
            "",
            f"Highest expense: {highest_expense['title']} - {highest_expense['amount']:.2f}",
            f"Number of expenses: {expense_count}"
        ])

        summary = "\n".join(lines)

    print(summary)

    with open("summary.txt", "w", encoding="utf-8") as output_file:
        output_file.write(summary + "\n")

except FileNotFoundError:
    print("Error: expenses.csv was not found. Please check the file location.")
