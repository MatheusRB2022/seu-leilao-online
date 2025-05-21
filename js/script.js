// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Toggle mobile menu
    mobileMenuBtn?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });

    // Sample featured auctions data
    const featuredAuctions = [
        {
            title: 'Veículo Premium',
            description: 'BMW X5 2022 - Excelente Estado',
            image: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            currentBid: 'R$ 180.000'
        },
        {
            title: 'Imóvel Residencial',
            description: 'Apartamento 120m² - Zona Sul',
            image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            currentBid: 'R$ 450.000'
        },
        {
            title: 'Veículo Executivo',
            description: 'Mercedes C200 2021 - Seminovo',
            image: 'https://images.pexels.com/photos/193021/pexels-photo-193021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            currentBid: 'R$ 220.000'
        },
        {
            title: 'Casa de Alto Padrão',
            description: 'Residência 300m² - Condomínio Fechado',
            image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            currentBid: 'R$ 1.200.000'
        }
    ];

    // Sample upcoming auctions data
    const upcomingAuctions = [
        {
            title: 'Grande Leilão de Veículos',
            description: 'Mais de 50 veículos premium',
            date: '15 de Junho, 2024',
            time: '14:00',
            image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Leilão de Imóveis Comerciais',
            description: 'Salas e Lojas no Centro',
            date: '20 de Junho, 2024',
            time: '10:00',
            image: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        },
        {
            title: 'Leilão de Máquinas Industriais',
            description: 'Equipamentos Seminovos',
            date: '25 de Junho, 2024',
            time: '15:30',
            image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
    ];

    // Populate featured auction cards
    const cardsGrid = document.querySelector('.cards-grid');
    if (cardsGrid) {
        featuredAuctions.forEach(auction => {
            const card = document.createElement('div');
            card.className = 'auction-card';
            card.innerHTML = `
                <div class="auction-image">
                    <img src="${auction.image}" alt="${auction.title}">
                </div>
                <div class="auction-content">
                    <h3>${auction.title}</h3>
                    <p>${auction.description}</p>
                    <div class="auction-bid">
                        <span>Lance Atual:</span>
                        <strong>${auction.currentBid}</strong>
                    </div>
                    <button class="btn btn-primary">Dar Lance</button>
                </div>
            `;
            cardsGrid.appendChild(card);
        });
    }

    // Populate upcoming auctions
    const agendaGrid = document.querySelector('.agenda-grid');
    if (agendaGrid) {
        upcomingAuctions.forEach(auction => {
            const card = document.createElement('div');
            card.className = 'auction-card upcoming-auction';
            card.innerHTML = `
                <div class="auction-image">
                    <img src="${auction.image}" alt="${auction.title}">
                </div>
                <div class="auction-content">
                    <h3>${auction.title}</h3>
                    <p>${auction.description}</p>
                    <div class="auction-date">
                        <div class="date-info">
                            <i class="fas fa-calendar"></i>
                            <span>${auction.date}</span>
                        </div>
                        <div class="time-info">
                            <i class="fas fa-clock"></i>
                            <span>${auction.time}</span>
                        </div>
                    </div>
                    <button class="btn btn-secondary">Ver Detalhes</button>
                </div>
            `;
            agendaGrid.appendChild(card);
        });
    }

    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple form validation
            const name = newsletterForm.querySelector('input[type="text"]').value;
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const category = newsletterForm.querySelector('select').value;

            if (!name || !email || !category) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Simulate form submission
            alert('Obrigado por se inscrever! Em breve você receberá nossas novidades.');
            newsletterForm.reset();
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });
});

// Add additional styles
const style = document.createElement('style');
style.textContent = `
    .auction-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        border: 1px solid rgba(0,0,0,0.1);
    }

    .auction-card:hover {
        transform: translateY(-5px);
    }

    .auction-image {
        height: 220px;
        overflow: hidden;
    }

    .auction-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .auction-content {
        padding: 24px;
    }

    .auction-content h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--primary-color);
    }

    .auction-content p {
        color: #666;
        margin-bottom: 20px;
        font-size: 15px;
    }

    .auction-bid {
        background: var(--light-gray);
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .auction-bid strong {
        font-size: 22px;
        color: var(--primary-color);
        font-weight: 700;
    }

    .upcoming-auction .auction-date {
        display: flex;
        justify-content: space-between;
        padding: 15px;
        background: var(--light-gray);
        border-radius: 6px;
        margin-bottom: 20px;
    }

    .upcoming-auction .date-info,
    .upcoming-auction .time-info {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--primary-color);
    }

    .upcoming-auction .date-info i,
    .upcoming-auction .time-info i {
        font-size: 16px;
    }
`;
document.head.appendChild(style);
