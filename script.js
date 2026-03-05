// -------------------- Global variables --------------------

let selectedFromAccount = ""; // Variável para armazenar a conta de origem selecionada
let selectedToAccount = ""; // Variável para armazenar a conta de destino selecionada
let data = localStorage.getItem("bankUsers"); // Tenta carregar os usuários do localStorage
let users = data ? JSON.parse(data) : []; // Tenta carregar do localStorage ou iniciar um array vazio
let currentDisplayedUsers = users; // Para exportação
let currentEditUser = null; // Para armazenar o usuário atualmente editado




// -------------------- Initialization --------------------

if (data === null || users.length === 0) {
    const defaultUsers = [
        {
            name: "Juliana Santos", account: "987654", balance: 1250.50
        },
        {
            name: "Ricardo Oliveira", account: "456789", balance: 820.75
        },
        {
            name: "Fernanda Costa", account: "321654", balance: 3500.00
        },
        {
            name: "Carlos Mendes", account: "789456", balance: 450.20
        },
        {
            name: "Patrícia Lima", account: "147258", balance: 2100.00
        },
        {
            name: "Bruno Ferreira", account: "369852", balance: 680.30
        },
        {
            name: "Mariana Silva", account: "852963", balance: 1575.90
        },
        {
            name: "André Rocha", account: "741852", balance: 920.00
        },
        {
            name: "Camila Alves", account: "963741", balance: 4200.50
        },
        {
            name: "Lucas Barbosa", account: "159753", balance: 1850.25
        },
        {
            name: "Beatriz Cunha", account: "258147", balance: 2850.00
        },
        {
            name: "Rafael Dias", account: "357159", balance: 1320.80
        },
        {
            name: "Amanda Martins", account: "486321", balance: 950.45
        },
        {
            name: "Thiago Moreira", account: "572648", balance: 3200.00
        },
        {
            name: "Gabriela Nunes", account: "648259", balance: 1680.30
        },
        {
            name: "Felipe Santos", account: "753951", balance: 2450.90
        },
        {
            name: "Larissa Souza", account: "825369", balance: 4100.75
        },
        {
            name: "Rodrigo Castro", account: "915738", balance: 890.20
        },
        {
            name: "Isabela Pereira", account: "136824", balance: 3750.60
        },
        {
            name: "Gustavo Ribeiro", account: "248136", balance: 1540.00
        }
    ];
    localStorage.setItem("bankUsers", JSON.stringify(defaultUsers));
    users = defaultUsers;
}

function renderUsers(users) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.account}</td>
            <td>${user.name} <img src="assets/icons/icon_Edit.svg" class="icon-edit" title="Editar" data-account="${user.account}"></td>
            <td>${user.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
        `;
        tableBody.appendChild(row);
    });
    currentDisplayedUsers = users;
}
renderUsers(users);





// -------------------- Main table --------------------

const btnMainSearch = document.getElementById("btnMainSearch");

btnMainSearch.addEventListener("click", function() {
    const searchTerm = document.getElementById("filterMainTable").value.trim().toLowerCase();
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) || user.account.toLowerCase().includes(searchTerm);
    });

    renderUsers(filteredUsers);
});

const btnClearMainFilter = document.getElementById("btnClearMainFilter");

btnClearMainFilter.addEventListener("click", function() {
    document.getElementById("filterMainTable").value = "";
    renderUsers(users);
});





// -------------------- Usability --------------------

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeTransferModal();
        closeCreateUserModal();
        closeRemoveUsersModal();
        closeEditUserModal();
    }
});

function showMessage(messageElement, message, type) {
    messageElement.textContent = message;
    messageElement.classList.remove("error", "success");
    messageElement.classList.add(type);
    messageElement.classList.remove("hidden");

    const timeout = setTimeout(() => {
        messageElement.classList.add("hidden");
        messageElement.classList.remove("error", "success");
    }, 5000);

    messageElement.addEventListener("click", () => {
        clearTimeout(timeout);
        messageElement.classList.add("hidden");
        messageElement.classList.remove("error", "success");
    });
}



// -------------------- Create user (modal and logic) --------------------

const modalCreateUser = document.getElementById("modalCreateUser");
const btnOpenCreateUser = document.getElementById("btnCreateUser");
const btnCloseCreateUser = document.getElementById("closeCreateModal");

function openCreateUserModal() {
    modalCreateUser.classList.add("open");
}

function closeCreateUserModal() {
    modalCreateUser.classList.remove("open");
    const createMessage = document.getElementById("createMessage");
    createMessage.classList.add("hidden");
    createMessage.classList.remove("error", "success");
    document.getElementById("createUserForm").reset();
}

btnOpenCreateUser.addEventListener("click", openCreateUserModal);
btnCloseCreateUser.addEventListener("click", closeCreateUserModal);

const accountInput = document.getElementById("newUserAccount");
const balanceInput = document.getElementById("newUserBalance");

accountInput.addEventListener("input", function() {
    accountInput.value = accountInput.value.replace(/\D/g, "");
});

balanceInput.addEventListener("input", function() {
    formatCurrency(balanceInput);
});

balanceInput.addEventListener("blur", function() {
    formatCurrency(balanceInput);
});

function formatCurrency(input) {
    let value = input.value.replace(/\D/g, "");
    
    // If empty or zero, clear input to show placeholder
    if (value === "" || value === "0" || value === "00" || parseInt(value) === 0) {
        input.value = "";
        return;
    }
    
    let numberValue = parseFloat(value) / 100;
    let formatted = numberValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    
    input.value = formatted;
}

function parseCurrency(value) {
    return parseFloat(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
}

function formatName(input) {
    let value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    input.value = value;
}

const nameInput = document.getElementById("newUserName");
const createUserForm = document.getElementById("createUserForm");
const createMessage = document.getElementById("createMessage");

nameInput.addEventListener("input", function() {
    formatName(nameInput);
});

createUserForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newAccountInput = accountInput.value;
    const accountExists = users.find(u => u.account === newAccountInput);

    if (accountExists) {
        showMessage(createMessage, "Usuário já cadastrado com essa conta.", "error");
        createUserForm.reset();
        return;
    }

    const userName = nameInput.value.trim();
    const userAccount = accountInput.value;
    const userBalance = parseCurrency(balanceInput.value);

    const newUser = {
        name: userName,
        account: userAccount,
        balance: userBalance
    };

    users.unshift(newUser);
    localStorage.setItem("bankUsers", JSON.stringify(users));
    renderUsers(users);
    showMessage(createMessage, "Usuário criado com sucesso!", "success");
    createUserForm.reset();
});





// -------------------- Edit user (modal and logic) --------------------

const tableBody = document.getElementById("tableBody");
const modalEditUser = document.getElementById("modalEditUser");
const btnCloseEditUser = document.getElementById("closeEditModal");
const editUserForm = document.getElementById("editUserForm");

tableBody.addEventListener("click", function(event) {
    if (event.target.classList.contains("icon-edit")) {
        const accountNumber = event.target.dataset.account;
        const user = users.find(u => u.account === accountNumber);
        openEditUserModal(user);
    }
});

function openEditUserModal(user) {
    const editNameInput = document.getElementById("editUserName");
    modalEditUser.classList.add("open");
    editNameInput.value = user.name;
    currentEditUser = user;
    editNameInput.focus();
    editNameInput.select();
}

function closeEditUserModal() {
    const editMessage = document.getElementById("editMessage");
    modalEditUser.classList.remove("open");
    editMessage.classList.add("hidden");
    editMessage.classList.remove("error", "success");
    document.getElementById("editUserForm").reset();
}

btnCloseEditUser.addEventListener("click", closeEditUserModal);

editUserForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const editNameInput = document.getElementById("editUserName");
    const newName = editNameInput.value.trim();
    const editMessage = document.getElementById("editMessage");


    if (!newName) {
        showMessage(editMessage, "O nome do usuário é obrigatório.", "error");
        return;
    }

    if (currentEditUser.name === newName) {
        showMessage(editMessage, "Cadastre um novo nome.", "error");
        return;
    }

    currentEditUser.name = newName;
    localStorage.setItem("bankUsers", JSON.stringify(users));
    renderUsers(users);
    showMessage(editMessage, "Usuário atualizado com sucesso!", "success");
});



// -------------------- Remove users (modal and logic) --------------------

const modalRemoveUsers = document.getElementById("modalRemoveUsers");
const btnOpenRemoveUsers = document.getElementById("btnRemoveUsers");
const btnCloseRemoveUsers = document.getElementById("closeRemoveModal");

function openRemoveUsersModal() {
    modalRemoveUsers.classList.add("open");
    populateRemoveTable();
    
    // Clear filter and messages
    document.getElementById("filterUsers").value = "";
    const removeUserMessage = document.getElementById("removeUserMessage");
    removeUserMessage.classList.add("hidden");
    removeUserMessage.classList.remove("error", "success");
    
    // Reset scroll position for table and modal
    const tableWrapper = document.querySelector("#modalRemoveUsers .table-wrapper");
    const modalContent = document.querySelector("#modalRemoveUsers .modal-content");
    
    if (tableWrapper) {
        tableWrapper.scrollTop = 0;
    }
    
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

function closeRemoveUsersModal() {
    modalRemoveUsers.classList.remove("open");
    const selectAllCheckbox = document.getElementById("selectAll");
    const allCheckboxes = document.querySelectorAll(".user-checkbox");
    
    selectAllCheckbox.checked = false;
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

btnOpenRemoveUsers.addEventListener("click", openRemoveUsersModal);
btnCloseRemoveUsers.addEventListener("click", closeRemoveUsersModal);

function populateRemoveTable(usersArray = users) {
    const removeTableBody = document.getElementById("removeTableBody");
    removeTableBody.innerHTML = "";

    usersArray.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="user-checkbox" value="${user.account}"></td>
            <td>${user.account}</td>
            <td>${user.name}</td>
            <td>${user.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
        `;
        removeTableBody.appendChild(row);
    });
}

function updateSelectAllState() {
    const allCheckboxes = document.querySelectorAll(".user-checkbox");
    const selectAllCheckbox = document.getElementById("selectAll");
    
    const checkedCount = Array.from(allCheckboxes).filter(cb => cb.checked).length;
    
    selectAllCheckbox.checked = (checkedCount === allCheckboxes.length && allCheckboxes.length > 0);
}

const selectAllCheckbox = document.getElementById("selectAll");
const removeTableBody = document.getElementById("removeTableBody");
const btnConfirmRemove = document.getElementById("btnConfirmRemove");

selectAllCheckbox.addEventListener("change", function() {
    const checkboxes = document.querySelectorAll(".user-checkbox");
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    updateSelectAllState();
});

removeTableBody.addEventListener("change", function(event) {
    if (event.target.classList.contains("user-checkbox")) {
        updateSelectAllState();
    }
});

btnConfirmRemove.addEventListener("click", function() {
    const selectedCheckboxes = document.querySelectorAll(".user-checkbox:checked");
    const removeUserMessage = document.getElementById("removeUserMessage");

    if (selectedCheckboxes.length === 0) {
        showMessage(removeUserMessage, "Selecione pelo menos um usuário.", "error");
        return;
    }

    const selectedAccounts = Array.from(selectedCheckboxes).map(cb => cb.value);

    users = users.filter(user => !selectedAccounts.includes(user.account));
    localStorage.setItem("bankUsers", JSON.stringify(users));
    renderUsers(users);
    populateRemoveTable();
    selectAllCheckbox.checked = false;
    showMessage(removeUserMessage, "Excluído(a) com sucesso!", "success");
});


const btnConfirmSearch = document.getElementById("btnConfirmSearch");

btnConfirmSearch.addEventListener("click", function() {
    const searchTerm = document.getElementById("filterUsers").value.trim().toLowerCase();
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) || user.account.toLowerCase().includes(searchTerm);

    });

    const removeUserMessage = document.getElementById("removeUserMessage");

    if (filteredUsers.length === 0) {
        showMessage(removeUserMessage, "Nenhum usuário encontrado.", "error");
    } else {
        removeUserMessage.classList.add("hidden");
        removeUserMessage.classList.remove("error", "success");
    }

    populateRemoveTable(filteredUsers);
});

const btnClearModalFilter = document.getElementById("btnClearModalFilter");

btnClearModalFilter.addEventListener("click", function() {
    const removeUserMessage = document.getElementById("removeUserMessage");
    
    document.getElementById("filterUsers").value = "";
    removeUserMessage.classList.add("hidden");
    removeUserMessage.classList.remove("error", "success");
    populateRemoveTable();
});



// -------------------- Transfer (modal and logic) --------------------

const modalTransfer = document.getElementById("modalTransfer");
const btnOpenTransfer = document.getElementById("btnOpenTransfer");
const btnCloseTransfer = document.getElementById("closeTransferModal");
const fromAccountTrigger = document.getElementById("fromAccount");
const toAccountTrigger = document.getElementById("toAccount");
const fromAccountOptions = document.getElementById("fromAccountOptions");
const toAccountOptions = document.getElementById("toAccountOptions");
const fromAccountWrapper = document.getElementById("fromAccountWrapper");
const toAccountWrapper = document.getElementById("toAccountWrapper");

function openTransferModal() {
    modalTransfer.classList.add("open");
    populateCustomSelect(fromAccountOptions, "from");
    populateCustomSelect(toAccountOptions, "to");
    transferMessage.classList.add("hidden");
    transferMessage.classList.remove("error", "success");
}

function closeTransferModal() {
    modalTransfer.classList.remove("open");
    transferMessage.classList.add("hidden");
    transferMessage.classList.remove("error", "success");
    transferAccountsValidate.reset();
    resetCustomSelect(fromAccountTrigger, fromAccountWrapper);
    resetCustomSelect(toAccountTrigger, toAccountWrapper);
    updateBalanceDisplay("from", document.getElementById("originBalance"));
    updateBalanceDisplay("to", document.getElementById("destinationBalance"));
}

btnOpenTransfer.addEventListener("click", openTransferModal);
btnCloseTransfer.addEventListener("click", closeTransferModal);

function populateCustomSelect(optionsContainer, type) {
    optionsContainer.innerHTML = "";
    
    // Option to clear selection
    const clearOption = document.createElement("div");
    clearOption.classList.add("custom-option");
    clearOption.dataset.value = "";
    clearOption.textContent = "———";
    clearOption.title = "Limpar seleção";
    clearOption.style.textAlign = "left";
    
    clearOption.addEventListener("click", () => {
        selectOption(clearOption, type);
    });
    
    optionsContainer.appendChild(clearOption);
    
    users.forEach(user => {
        const option = document.createElement("div");
        option.classList.add("custom-option");
        option.dataset.value = user.account;
        
        // Truncate only the name, keeping account number always visible
        const maxNameLength = 15;
        const accountText = ` (${user.account})`;
        const displayName = user.name.length > maxNameLength 
            ? user.name.substring(0, maxNameLength) + "..."
            : user.name;
        
        option.textContent = displayName + accountText;
        option.title = `${user.name} (${user.account})`;
        
        option.addEventListener("click", () => {
            selectOption(option, type);
        });
        
        optionsContainer.appendChild(option);
    });
}

function selectOption(option, type) {
    const value = option.dataset.value;
    const text = option.textContent;
    
    if (type === "from") {
        if (value === "") {
            resetCustomSelect(fromAccountTrigger, fromAccountWrapper);
            updateBalanceDisplay("from", document.getElementById("originBalance"));
            fromAccountWrapper.classList.remove("open");
            return;
        }
        
        selectedFromAccount = value;
        fromAccountTrigger.querySelector("span").textContent = text;
        fromAccountWrapper.classList.remove("open");
        
        fromAccountOptions.querySelectorAll(".custom-option").forEach(opt => {
            opt.classList.remove("selected");
        });
        option.classList.add("selected");
        
        updateBalanceDisplay("from", document.getElementById("originBalance"));
    } else {
        if (value === "") {
            resetCustomSelect(toAccountTrigger, toAccountWrapper);
            updateBalanceDisplay("to", document.getElementById("destinationBalance"));
            toAccountWrapper.classList.remove("open");
            return;
        }
        
        selectedToAccount = value;
        toAccountTrigger.querySelector("span").textContent = text;
        toAccountWrapper.classList.remove("open");
        
        toAccountOptions.querySelectorAll(".custom-option").forEach(opt => {
            opt.classList.remove("selected");
        });
        option.classList.add("selected");
        
        updateBalanceDisplay("to", document.getElementById("destinationBalance"));
    }
}

function resetCustomSelect(trigger, wrapper) {
    trigger.querySelector("span").textContent = "Selecione uma conta";
    wrapper.classList.remove("open");
    
    const optionsContainer = wrapper.querySelector(".custom-options");
    if (optionsContainer) {
        optionsContainer.querySelectorAll(".custom-option").forEach(opt => {
            opt.classList.remove("selected");
        });
    }
    
    if (wrapper.id === "fromAccountWrapper") {
        selectedFromAccount = "";
    } else {
        selectedToAccount = "";
    }
}

fromAccountTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = fromAccountWrapper.classList.contains("open");
    fromAccountWrapper.classList.toggle("open");
    toAccountWrapper.classList.remove("open");
    
    if (!wasOpen && fromAccountWrapper.classList.contains("open")) {
        requestAnimationFrame(() => {
            fromAccountOptions.scrollTop = 0;
        });
    }
});

toAccountTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const wasOpen = toAccountWrapper.classList.contains("open");
    toAccountWrapper.classList.toggle("open");
    fromAccountWrapper.classList.remove("open");
    
    if (!wasOpen && toAccountWrapper.classList.contains("open")) {
        requestAnimationFrame(() => {
            toAccountOptions.scrollTop = 0;
        });
    }
});

document.addEventListener("click", (e) => {
    if (!fromAccountWrapper.contains(e.target)) {
        fromAccountWrapper.classList.remove("open");
    }
    if (!toAccountWrapper.contains(e.target)) {
        toAccountWrapper.classList.remove("open");
    }
});

function updateBalanceDisplay(type, spanElement) {
    const accountNumber = type === "from" ? selectedFromAccount : selectedToAccount;
    const user = users.find(u => u.account === accountNumber);

    if (accountNumber === "") {
        spanElement.textContent = "R$ 0,00";
        return;
    }

    if (!user) {
        spanElement.textContent = "Usuário não encontrado";
        return;
    }

    const formattedBalance = user.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    spanElement.textContent = formattedBalance;
}

const fromBalanceSpan = document.getElementById("originBalance");
const toBalanceSpan = document.getElementById("destinationBalance");
const transferAccountsValidate = document.getElementById("transferForm");
const transferAmountInput = document.getElementById("newTransferAmount");
const transferMessage = document.getElementById("transferMessage");

transferAmountInput.addEventListener("input", function() {
    formatCurrency(transferAmountInput);
});

transferAmountInput.addEventListener("blur", function() {
    formatCurrency(transferAmountInput);
});

transferAccountsValidate.addEventListener("submit", function(event) {
    event.preventDefault();
    
    if (!selectedFromAccount || !selectedToAccount) {
        showMessage(transferMessage, "Selecione as contas de origem e destino.", "error");
        return;
    }
    
    if (selectedFromAccount === selectedToAccount) {
        showMessage(transferMessage, "Selecione contas de origem/destino diferentes.", "error");
        return;
    }

    const amount = parseCurrency(transferAmountInput.value);
    const fromUser = users.find(u => u.account === selectedFromAccount);

    if (fromUser.balance < amount) {
        showMessage(transferMessage, "Saldo insuficiente.", "error");
        return;
        
    }

    const toUser = users.find(u => u.account === selectedToAccount);

    fromUser.balance -= amount;
    toUser.balance += amount;
    localStorage.setItem("bankUsers", JSON.stringify(users));
    renderUsers(users);
    showMessage(transferMessage, "Transferência realizada com sucesso!", "success");
    
    transferAmountInput.value = "";
    resetCustomSelect(fromAccountTrigger, fromAccountWrapper);
    resetCustomSelect(toAccountTrigger, toAccountWrapper);
    updateBalanceDisplay("from", fromBalanceSpan);
    updateBalanceDisplay("to", toBalanceSpan);
});



// -------------------- Export --------------------

const btnDownloadToggle = document.getElementById("btnToggleDownload");

btnDownloadToggle.addEventListener("click", function() {
    const downloadOptions = document.querySelector(".download-options");
    downloadOptions.classList.toggle("hidden");
});

const downloadOptionsContainer = document.querySelector(".download-options");
if (downloadOptionsContainer) {
    downloadOptionsContainer.addEventListener("click", function(event) {
        if (event.target.tagName === "IMG") {
            const altText = event.target.getAttribute("alt");

            if (altText === "CSV") {
                exportToCSV();

            } else if (altText === "Excel") {
                exportToExcel();

            } else if (altText === "PDF") {
                exportToPDF();
            }
        }
    });
}

function exportToCSV() {
    // UTF-8 BOM for Excel to properly recognize special characters
    let csvContent = "\uFEFFConta,Nome,Saldo\n";
    const rows = currentDisplayedUsers.map(user => {
        return `${user.account},${user.name},${user.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
    });

    csvContent += rows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "sistema-bancario.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportToExcel() {
    // console.log(XLSX);
    const dataForExcel = currentDisplayedUsers.map(user => {
        return {
            Conta: user.account,
            Nome: user.name,
            Saldo: user.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        };
    });
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuários");
    XLSX.writeFile(workbook, "sistema-bancario.xlsx");
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    // console.log(jsPDF);
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(74, 143, 189);
    doc.text("Sistema Bancário", 105, 20, { align: "center" });
    doc.line (14, 25, 196, 25);
    doc.autoTable ({
        startY: 30,
        head: [["Conta", "Nome", "Saldo"]],
        body: currentDisplayedUsers.map(user => {
            return [
                user.account,
                user.name,
                user.balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
            ];
        }),
        headStyles: { halign: "center" },
        styles: { halign: "center" }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text("© 2026 Sistema Bancário | Todos os direitos reservados", 105, doc.internal.pageSize.height - 10, { align: "center" });
    }
    
    doc.save("sistema-bancario.pdf");
}








