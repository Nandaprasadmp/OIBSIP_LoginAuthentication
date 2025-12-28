const getDB = () => JSON.parse(localStorage.getItem('pro_vault_db')) || [];

function notify(msg, type) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.className = `toast show ${type}`;
    setTimeout(() => t.className = "toast", 3000);
}

function toggle() {
    const l = document.getElementById('login-side');
    const r = document.getElementById('reg-side');
    const t = document.getElementById('main-title');
    l.classList.toggle('hidden');
    r.classList.toggle('hidden');
    t.innerText = l.classList.contains('hidden') ? 'IDENTITY CREATION' : 'VAULT ACCESS';
}

function handleRegister(e) {
    e.preventDefault();
    const user = document.getElementById('r-user').value.trim();
    const pass = document.getElementById('r-pass').value;
    const db = getDB();

    if (pass.length < 6) return notify("KEY TOO WEAK (MIN 6)", "error");
    if (db.find(u => u.username === user)) return notify("ID ALREADY TAKEN", "error");

    db.push({ username: user, password: btoa(pass) });
    localStorage.setItem('pro_vault_db', JSON.stringify(db));
    notify("IDENTITY ENCRYPTED", "success");
    setTimeout(toggle, 1000);
}

function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('l-user').value.trim();
    const pass = btoa(document.getElementById('l-pass').value);
    const db = getDB();

    const account = db.find(u => u.username === user && u.password === pass);
    if (account) {
        sessionStorage.setItem('vault_token', btoa(user));
        notify("AUTHORIZATION GRANTED", "success");
        setTimeout(() => window.location.href = "secured.html", 1000);
    } else {
        notify("INVALID CREDENTIALS", "error");
    }
}

function handleDelete() {
    const user = document.getElementById('l-user').value.trim();
    const pass = btoa(document.getElementById('l-pass').value);
    let db = getDB();

    const index = db.findIndex(u => u.username === user && u.password === pass);
    if (index !== -1) {
        if (confirm("WARNING: PERMANENTLY PURGE THIS IDENTITY?")) {
            db.splice(index, 1);
            localStorage.setItem('pro_vault_db', JSON.stringify(db));
            notify("IDENTITY PURGED", "success");
            location.reload();
        }
    } else {
        notify("ID NOT FOUND FOR PURGE", "error");
    }
}