// Auth state management
const checkAuth = () => {
    const token = localStorage.getItem('token');
    const authButtons = document.querySelectorAll('.auth-buttons');
    const userMenu = document.querySelectorAll('.user-menu');
    
    if (token) {
        authButtons.forEach(el => el.style.display = 'none');
        userMenu.forEach(el => el.style.display = 'flex');
        document.querySelector('.announce-product')?.classList.remove('hidden');
    } else {
        authButtons.forEach(el => el.style.display = 'flex');
        userMenu.forEach(el => el.style.display = 'none');
        document.querySelector('.announce-product')?.classList.add('hidden');
    }
};

// Hamburger menu
const initHamburgerMenu = () => {
    const menuBtn = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');
    
    menuBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.sidebar') && !e.target.closest('.hamburger-menu')) {
            sidebar.classList.remove('active');
        }
    });
};

// Load categories
const loadCategories = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/categories');
        const categories = await response.json();
        
        const sidebar = document.querySelector('.sidebar-categories');
        sidebar.innerHTML = categories.map(cat => `
            <a href="/?category=${cat.slug}" class="category-item">
                ${cat.name}
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
};

// Load products
const loadProducts = async (category = null) => {
    try {
        const url = category 
            ? `http://localhost:3001/api/products?category=${category}`
            : 'http://localhost:3001/api/products';
            
        const response = await fetch(url);
        const products = await response.json();
        
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                </div>
                <div class="product-price">
                    <span>Lance Atual:</span>
                    <strong>R$ ${product.current_price}</strong>
                </div>
                <div class="product-timer" data-end="${product.end_time}">
                    Carregando...
                </div>
                <button class="bid-button" onclick="openBidModal(${product.id}, ${product.current_price})">
                    Dar Lance
                </button>
            </div>
        `).join('');
        
        // Start countdown timers
        updateCountdowns();
    } catch (error) {
        console.error('Error loading products:', error);
    }
};

// Countdown timer
const updateCountdowns = () => {
    const timers = document.querySelectorAll('.product-timer');
    
    timers.forEach(timer => {
        const endTime = new Date(timer.dataset.end);
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            timer.innerHTML = 'Leilão encerrado';
            timer.closest('.product-card').querySelector('.bid-button').disabled = true;
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timer.innerHTML = `
            ${days}d ${hours}h ${minutes}m ${seconds}s
        `;
    });
};

// Bid modal
const openBidModal = (productId, currentPrice) => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/login.html';
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'bid-modal';
    modal.innerHTML = `
        <div class="bid-modal-content">
            <h2>Dar Lance</h2>
            <p>Lance atual: R$ ${currentPrice}</p>
            <input type="number" id="bidAmount" min="${currentPrice + 1}" step="1" value="${currentPrice + 1}">
            <div class="bid-modal-buttons">
                <button onclick="submitBid(${productId})">Confirmar</button>
                <button onclick="closeBidModal()">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
};

const closeBidModal = () => {
    document.querySelector('.bid-modal')?.remove();
};

const submitBid = async (productId) => {
    const amount = document.getElementById('bidAmount').value;
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3001/api/bids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: productId, amount: Number(amount) })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Lance realizado com sucesso!');
            closeBidModal();
            loadProducts(); // Reload products to show updated price
        } else {
            alert(data.error || 'Erro ao dar lance');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initHamburgerMenu();
    loadCategories();
    loadProducts();
    
    // Update countdowns every second
    setInterval(updateCountdowns, 1000);
    
    // Handle category filter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        loadProducts(category);
    }
});
