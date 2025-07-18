const memberList = ['U', 'W', 'S', 'A', 'J', 'U2', 'U3'];
let balances = {};
let paymentsToday = {};
let today = new Date();

// Format date for display
function formatDate(d) {
  return d.toLocaleDateString('en-IN');
}

// Initialize data
function init() {
  memberList.forEach(m => {
    balances[m] = 0;
    paymentsToday[m] = false;
  });
  document.getElementById('currentDate').innerText = formatDate(today);
  renderMembers();
  renderBalances();
}

// Mark member as paid for the day
function markPaid(member) {
  if (!paymentsToday[member]) {
    paymentsToday[member] = true;
    logPayment(member, 1000);
  }
  renderBalances();
}

function logPayment(member, amount) {
  const logs = JSON.parse(localStorage.getItem('commettePayments') || '[]');
  logs.push({
    member,
    amount,
    date: formatDate(today)
  });
  localStorage.setItem('commettePayments', JSON.stringify(logs));
}


// Trigger new day logic
function newDay() {
  memberList.forEach(m => {
    if (!paymentsToday[m]) {
      balances[m] += 1000; // Add only if not paid
    }
    paymentsToday[m] = false; // Reset for next day
  });

  today.setDate(today.getDate() + 1);
  document.getElementById('currentDate').innerText = formatDate(today);
  renderBalances();
}

// Render member buttons
function renderMembers() {
  const container = document.getElementById('members');
  container.innerHTML = '';
  memberList.forEach(m => {
    const btn = document.createElement('button');
    btn.innerText = m;
    btn.className = 'member-btn';
    btn.onclick = () => markPaid(m);
    container.appendChild(btn);
  });
}

// Render balance table
function renderBalances() {
  const tbody = document.getElementById('balanceTable');
  tbody.innerHTML = '';
  memberList.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m}</td>
      <td>₹${balances[m]}</td>
      <td><button class="action-btn" onclick="openModal('${m}')">Clear</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// Modal handling
let modalMember = null;

function openModal(member) {
  modalMember = member;
  document.getElementById('modalMember').innerText = member;
  document.getElementById('modalBalance').innerText = balances[member];
  document.getElementById('payAmount').value = '';
  document.getElementById('modal').style.display = 'block';
}

document.getElementById('closeModal').onclick = () => {
  document.getElementById('modal').style.display = 'none';
};

document.getElementById('confirmPay').onclick = () => {
  const amt = parseInt(document.getElementById('payAmount').value);
  if (!isNaN(amt) && amt > 0) {
    balances[modalMember] -= amt;
    logPayment(modalMember, amt);

    if (balances[modalMember] < 0) balances[modalMember] = 0;
    renderBalances();
    document.getElementById('modal').style.display = 'none';
  }
};

// Simulate new day using 'n' key
document.addEventListener('keydown', (e) => {
  if (e.key === 'n') {
    newDay();
  }
});

// Initialize on load
init();
