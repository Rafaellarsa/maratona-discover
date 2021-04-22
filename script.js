const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  }
};

const transactions = [
  {
    id: 1,
    description: "Luz",
    amount: -50000,
    date: "23/01/2021"
  },
  {
    id: 2,
    description: "Website",
    amount: 500000,
    date: "23/01/2021"
  },
  {
    id: 3,
    description: "Internet",
    amount: -20000,
    date: "23/01/2021"
  }
];

const DOM = {
  transactionContainer: document.querySelector("#transactions-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.transactionInnerHTML(transaction);
    DOM.transactionContainer.appendChild(tr);
  },

  transactionInnerHTML(transaction) {
    const amountClass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
            <td class="description">${transaction.description}</td>
             <td class="${amountClass}">${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Remover transação"></td>
        `;

    return html;
  }
};

const Utils = {
  formatCurrency(value) {
    const minusSignal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(",", ".");

    console.log(minusSignal);
  }
};

const Balance = {
  incomes() {},
  expenses() {},
  total() {}
};

transactions.forEach(transaction => DOM.addTransaction(transaction));
