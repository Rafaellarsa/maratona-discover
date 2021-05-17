const DOM = {
  transactionContainer: document.querySelector("#transactions-table tbody"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.transactionInnerHTML(transaction, index);
    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr);
  },

  transactionInnerHTML(transaction, index) {
    const amountClass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
            <td class="description">${transaction.description}</td>
             <td class="${amountClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Balance.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
        `;

    return html;
  },

  updateBalance() {
    document.getElementById("incomesTotal").innerHTML = Utils.formatCurrency(
      Balance.getIncomes()
    );
    document.getElementById("expensesTotal").innerHTML = Utils.formatCurrency(
      Balance.getExpenses()
    );
    document.getElementById("totalBalance").innerHTML = Utils.formatCurrency(
      Balance.getTotal()
    );
  },

  clearBalance() {
    DOM.transactionContainer.innerHTML = "";
  }
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
};

const Balance = {
  all: Storage.get(),

  add(transaction) {
    Balance.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Balance.all.splice(index, 1);

    App.reload();
  },

  getIncomes() {
    let incomes = 0;

    Balance.all.forEach(transaction => {
      if (transaction.amount > 0) {
        incomes += transaction.amount;
      }
    });

    return incomes;
  },

  getExpenses() {
    let expenses = 0;

    Balance.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    return expenses;
  },

  getTotal() {
    return Balance.getIncomes() + Balance.getExpenses();
  }
};

const Modal = {
  open() {
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  }
};

const Form = {
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();

      Balance.add(transaction);

      Form.clearFields();
      Modal.close();
    } catch (error) {
      alert(error);
    }
  },

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    };
  },

  validateFields() {
    const { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return { description, amount, date };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  }
};

const Utils = {
  formatAmount(amount) {
    return amount * 100;
  },

  formatDate(date) {
    const splittedDate = date.split("-");

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    return value;
  }
};

const App = {
  init() {
    Balance.all.forEach(DOM.addTransaction);
    DOM.updateBalance();

    Storage.set(Balance.all);
  },
  reload() {
    DOM.clearBalance();
    App.init();
  }
};

App.init();
