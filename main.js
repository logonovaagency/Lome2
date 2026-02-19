// --- DATA LOMÉ 2 (Menu Officiel) ---
// --- DATA LOMÉ (Menu Officiel) ---
const menuData = [
    { 
        category: "Nos Spaghettis", 
        icon: "fa-utensils", 
        items: [ 
            { name: "Spaghetti Blanc", price: 1000 }, 
            { name: "Spaghetti Rouge", price: 1000 }, 
            { name: "Spaghetti Bolognaise", price: 1500 },
            { 
                name: "Spaghetti Blanc Spécial", 
                price: 2000, 
                desc: "Choix : Crème fraîche ou Fromage",
                options: ["Crème Fraîche", "Fromage"] 
            }
        ] 
    },
    { 
        category: "Riz & Attiéké", 
        icon: "fa-seedling", 
        items: [ 
            { name: "Riz Indiennes", price: 1500 }, 
            { name: "Attiéké au Poisson", price: 1500 }, 
            { name: "Riz + Egnifoti", price: 2500 }, 
            { 
                name: "Riz au Gras + Viande", 
                price: 2500, 
                desc: "Avec accompagnement",
                options: ["Poulet", "Alloco"] 
            }
        ] 
    },
    { 
        category: "Plats du Terroir", 
        icon: "fa-mortar-pestle", 
        items: [ 
            { 
                name: "Akoumé", 
                price: 2500, 
                desc: "Choix de sauce",
                options: ["Sauce Adémè", "Sauce Ebésési"] 
            }, 
            { name: "Djekoumé au Poulet", price: 2500 }, 
            { name: "Pilon + Adokougbi", price: 2500 },
            { name: "Poisson (Tilapia) + Apkan", price: 4500 }
        ] 
    },
    { 
        category: "Grillades & Viandes", 
        icon: "fa-drumstick-bite", 
        items: [ 
            { name: "Poulet Braisé", price: 2500, desc: "À partir de 2500 F" }, 
            { name: "Steak au Poivre", price: 2000 }, 
            { 
                name: "Plat Complet", 
                price: 2500,
                desc: "Faites votre choix",
                options: ["Poulet + Frites", "Poisson + Alloco"]
            }, 
            { name: "Chat au Four", price: 2500 },
            { name: "Brochettes de Bœuf", price: 200, desc: "⚠️ Minimum 5 commandes" },
            { name: "Akpama", price: 500 }
        ] 
    },
    { 
        category: "Vite Fait & Salades", 
        icon: "fa-hamburger", 
        items: [ 
            { name: "Chawarma", price: 1200 }, 
            { name: "Sandwich", price: 1500 }, 
            { name: "Poulet Mayo", price: 2500 },
            { name: "Pepper Soupe", price: 1000, desc: "À partir de 1000 F" },
            { name: "Salade Piémontaise 🥗", price: 2000 },
            { name: "Salade Lomé 2", price: 1500 },
            { name: "Salade Verte", price: 1500 },
            { name: "Hors d'œuvres", price: 2000 }
        ] 
    }
];

let cart = [];
let currentUser = null;
let currentItemData = null; // Stocke l'item en cours de sélection

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    checkUserSession();
});

// --- RENDER MENU (NOUVELLE VERSION SANS ERREUR DE GUILLEMETS) ---
function renderMenu() {
    const container = document.getElementById('menu-container');
    let html = '';
    
    // On boucle avec l'index (i) pour identifier chaque élément précisément
    menuData.forEach((cat, catIndex) => {
        html += `<div class="category-container"><div class="category-title"><i class="fas ${cat.icon}"></i> ${cat.category}</div><div class="menu-grid">`;
        
        cat.items.forEach((item, itemIndex) => {
            const desc = item.desc ? `<div class="product-desc">${item.desc}</div>` : '';
            
            // Ici, au lieu de passer les options compliquées, on passe juste les numéros (catIndex, itemIndex)
            // C'est beaucoup plus solide !
            html += `
            <div class="product-card">
                <div class="product-header"><div class="product-name">${item.name}</div></div>
                ${desc}
                <div class="product-footer">
                    <div class="price-tag">${item.price} F</div>
                    <button class="btn-add" onclick="initAddItem(${catIndex}, ${itemIndex})">
                        <i class="fas fa-plus"></i> AJOUTER
                    </button>
                </div>
            </div>`;
        });
        html += `</div></div>`;
    });
    container.innerHTML = html;
}

// --- LOGIQUE D'AJOUT INTELLIGENTE ---
function initAddItem(catIndex, itemIndex) {
    // On va chercher l'item proprement dans la base de données
    const item = menuData[catIndex].items[itemIndex];

    if (item.options && item.options.length > 0) {
        // C'est un item avec options -> On ouvre le popup
        currentItemData = item; // On sauvegarde l'item temporairement
        openOptionModal(item);
    } else {
        // C'est un item simple -> On ajoute direct
        addToCart(item.name, item.price);
    }
}

// --- GESTION DU POPUP ---
function openOptionModal(item) {
    document.getElementById('option-title').innerText = item.name;
    const list = document.getElementById('option-list');
    list.innerHTML = ''; 

    item.options.forEach((opt, index) => {
        const checked = index === 0 ? 'checked' : ''; 
        // Création des boutons radio proprement
        list.innerHTML += `
            <label class="option-row">
                <input type="radio" name="item_option" value="${opt}" ${checked}>
                <span>${opt}</span>
            </label>
        `;
    });

    document.getElementById('option-modal').classList.add('active');
}

function closeOptionModal() {
    document.getElementById('option-modal').classList.remove('active');
    currentItemData = null;
}

function confirmOption() {
    const selected = document.querySelector('input[name="item_option"]:checked');
    if (selected && currentItemData) {
        // On combine : "Akoumé (Sauce Gombo)"
        const fullName = `${currentItemData.name} (${selected.value})`;
        addToCart(fullName, currentItemData.price);
        closeOptionModal();
    }
}

// --- CART LOGIC ---
function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) existing.qty++; else cart.push({ name, price, qty: 1 });
    updateCartUI();
    if(navigator.vibrate) navigator.vibrate(50);
}

function removeFromCart(name) {
    const idx = cart.findIndex(i => i.name === name);
    if (idx > -1) { cart[idx].qty--; if (cart[idx].qty === 0) cart.splice(idx, 1); }
    updateCartUI(); renderModalCartItems();
}

function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-total-btn').innerText = total + ' F';
    const floatBtn = document.getElementById('floating-cart');
    if (count > 0) floatBtn.classList.remove('hidden'); else { floatBtn.classList.add('hidden'); closeCartModal(); }
}

// --- MODAL CART & PROFILE ---
function openCartModal() {
    if(cart.length === 0) return;
    const now = new Date();
    document.getElementById('order-date').valueAsDate = now;
    document.getElementById('order-time').value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    if(currentUser) {
        document.getElementById('order-name').value = currentUser.name;
        document.getElementById('order-phone').value = currentUser.phone;
    }
    renderModalCartItems();
    document.getElementById('cart-modal').classList.add('active');
}

function closeCartModal() { document.getElementById('cart-modal').classList.remove('active'); }

function renderModalCartItems() {
    const list = document.getElementById('cart-items-list');
    let total = 0; let html = '';
    cart.forEach(item => {
        const t = item.price * item.qty; total += t;
        // Petit trick pour éviter les bugs avec les apostrophes dans les noms
        const safeName = item.name.replace(/'/g, "\\'"); 
        html += `
        <div class="cart-item">
            <div>
                <div style="font-weight:bold; font-size:0.95rem;">${item.name}</div>
                <div style="color:#666;font-size:0.85rem;">${item.price} x ${item.qty} = ${t} F</div>
            </div>
            <div class="item-controls">
                <button class="btn-qty" onclick="removeFromCart('${safeName}')">-</button>
                <span style="font-weight:bold;width:20px;text-align:center;">${item.qty}</span>
                <button class="btn-qty" onclick="addToCart('${safeName}', ${item.price}); renderModalCartItems();">+</button>
            </div>
        </div>`;
    });
    list.innerHTML = html;
    document.getElementById('modal-total-price').innerText = total + " FCFA";
}

// --- USER SYSTEM ---
function checkUserSession() {
    const savedUser = localStorage.getItem('lome2_user');
    if (savedUser) { currentUser = JSON.parse(savedUser); updateProfileUI(); }
}
function loginUser() {
    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    if (!name || !phone) { alert("Nom et téléphone obligatoires"); return; }
    currentUser = { name, phone };
    localStorage.setItem('lome2_user', JSON.stringify(currentUser));
    updateProfileUI();
}
function logoutUser() {
    if(confirm("Se déconnecter ?")) { currentUser = null; localStorage.removeItem('lome2_user'); updateProfileUI(); }
}
function updateProfileUI() {
    const loginView = document.getElementById('login-view');
    const userView = document.getElementById('user-view');
    const welcomeMsg = document.getElementById('welcome-msg');
    if (currentUser) {
        loginView.classList.add('hidden');
        userView.classList.remove('hidden');
        welcomeMsg.innerText = `Re-Bonjour, ${currentUser.name} !`;
        renderHistory();
    } else {
        loginView.classList.remove('hidden');
        userView.classList.add('hidden');
    }
}
function openProfileModal() { checkUserSession(); document.getElementById('profile-modal').classList.add('active'); }
function closeProfileModal() { document.getElementById('profile-modal').classList.remove('active'); }

// --- HISTORY ---
function saveOrderToHistory(cartItems, totalAmount) {
    let history = JSON.parse(localStorage.getItem('lome2_history')) || [];
    const newOrder = {
        date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}),
        items: cartItems.map(i => `${i.qty}x ${i.name}`).join(', '),
        total: totalAmount
    };
    history.unshift(newOrder);
    if(history.length > 20) history = history.slice(0, 20);
    localStorage.setItem('lome2_history', JSON.stringify(history));
}
function renderHistory() {
    const list = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('lome2_history')) || [];
    if (history.length === 0) { list.innerHTML = '<p style="color:#999; font-style:italic;">Aucune commande.</p>'; return; }
    let html = '';
    history.forEach(order => {
        html += `<div class="history-card"><div class="history-total">${order.total} F</div><div class="history-date"><i class="far fa-clock"></i> ${order.date}</div><div class="history-items">${order.items}</div></div>`;
    });
    list.innerHTML = html;
}

// --- SUBMIT ---
function submitOrder(e) {
    e.preventDefault();
    if (cart.length === 0) return;

    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const date = document.getElementById('order-date').value;
    const time = document.getElementById('order-time').value;
    const address = document.getElementById('order-address').value;
    const payment = document.getElementById('order-payment').value;
    const notes = document.getElementById('order-notes').value; 
    const gpsLink = document.getElementById('gps-link-storage').value;
    
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    saveOrderToHistory(cart, total);

    let message = `*COMMANDE LOMÉ 2*\n--------------------------------\n`;
    cart.forEach(i => { message += `${i.qty}x ${i.name} (${i.price * i.qty}F)\n`; });
    message += `--------------------------------\n*TOTAL: ${total} FCFA*\n--------------------------------\n`;
    message += `👤 ${name}\n📞 ${phone}\n📍 ${address}\n💳 ${payment}\n📅 ${date} à ${time}`;
    
    if(notes && notes.trim() !== "") { message += `\n📝 *Note:* ${notes}`; }
    if(gpsLink) { message += `\n🔗 GPS: ${gpsLink}`; }

    // METTRE LE BON NUMERO ICI
    const whatsappNumber = "22890000000"; 
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js'); }); }

// --- MAPS ---
let map = null; let marker = null;
function openMapModal() { document.getElementById('map-modal').classList.add('active'); setTimeout(() => { if (!map) initMap(); else map.invalidateSize(); }, 300); }
function closeMapModal() { document.getElementById('map-modal').classList.remove('active'); }
function initMap() {
    let lat = 6.1375; let lng = 1.2125;
    map = L.map('map-container').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);
    marker = L.marker([lat, lng], {draggable: true}).addTo(map);
    if (navigator.geolocation) { navigator.geolocation.getCurrentPosition(pos => { lat = pos.coords.latitude; lng = pos.coords.longitude; map.setView([lat, lng], 16); marker.setLatLng([lat, lng]); }); }
    map.on('click', (e) => { marker.setLatLng(e.latlng); });
}
function confirmLocation() {
    if(!marker) return; const pos = marker.getLatLng();
    const link = `http://maps.google.com/?q=${pos.lat},${pos.lng}`;
    document.getElementById('gps-link-storage').value = link;
    const addrField = document.getElementById('order-address');
    if(!addrField.value.includes("✅")) { addrField.value = (addrField.value + " (✅ GPS)").trim(); }
    closeMapModal();
}
document.querySelectorAll('.modal-overlay').forEach(overlay => { overlay.addEventListener('click', (e) => { if(e.target === overlay) { closeCartModal(); closeProfileModal(); closeOptionModal(); } }); });