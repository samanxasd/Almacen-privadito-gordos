let currentSection = '';

// Crear efecto de nieve
function createSnowflakes() {
    const snowflakes = ['❄', '❅', '❆', '✺', '✵'];
    setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animation = `snowfall ${Math.random() * 3 + 2}s linear forwards`;
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        document.body.appendChild(snowflake);
        
        setTimeout(() => snowflake.remove(), 5000);
    }, 200);
}

// Detector de dispositivo
const isMobile = () => window.innerWidth <= 768;

// Mostrar modal
function showModal(section) {
    currentSection = section;
    const modal = document.getElementById('modal');
    modal.classList.add('active');
    document.getElementById('modalServiceName').value = '';
    document.getElementById('modalServiceContent').value = '';
    document.getElementById('modalServiceName').focus();
}

// Cerrar modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Cambiar entre secciones
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        const sectionId = this.dataset.section;
        const sidebar = document.getElementById('sidebar');
        const selectedSection = document.getElementById(sectionId);
        
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        if (isMobile()) {
            sidebar.style.transform = 'translateY(-100%)';
        } else {
            sidebar.style.transform = 'translateX(-100%)';
        }
        
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        selectedSection.classList.add('active');
    });
});

// Función para volver
function goBack() {
    const sidebar = document.getElementById('sidebar');
    
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    if (isMobile()) {
        sidebar.style.transform = 'translateY(0)';
    } else {
        sidebar.style.transform = 'translateX(0)';
    }
}

// Guardar datos del modal
function saveModalData() {
    const serviceName = document.getElementById('modalServiceName').value.trim();
    const serviceContent = document.getElementById('modalServiceContent').value.trim();
    
    if (serviceName) {
        const list = document.getElementById(`${currentSection}List`);
        
        const item = document.createElement('li');
        item.className = 'item';
        
        const itemContainer = document.createElement('div');
        itemContainer.className = 'item-content';
        
        const title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = serviceName;
        
        const content = document.createElement('div');
        content.className = 'item-description';
        content.textContent = serviceContent;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.onclick = () => {
            item.style.transform = isMobile() ? 'translateX(50px)' : 'translateX(100px)';
            item.style.opacity = '0';
            setTimeout(() => item.remove(), 300);
            updateEmptyState(currentSection);
            saveItems(currentSection);
        };
        
        itemContainer.appendChild(title);
        if (serviceContent) {
            itemContainer.appendChild(content);
        }
        
        item.appendChild(itemContainer);
        item.appendChild(deleteBtn);
        list.appendChild(item);
        
        updateEmptyState(currentSection);
        closeModal();
        saveItems(currentSection);
    }
}

// Actualizar estado vacío
function updateEmptyState(section) {
    const list = document.getElementById(`${section}List`);
    const emptyState = list.nextElementSibling;
    emptyState.style.display = list.children.length === 0 ? 'block' : 'none';
}

// Guardar en localStorage
function saveItems(section) {
    const list = document.getElementById(`${section}List`);
    const items = Array.from(list.children).map(item => ({
        name: item.querySelector('.item-title').textContent,
        content: item.querySelector('.item-description')?.textContent || ''
    }));
    localStorage.setItem(`${section}Items`, JSON.stringify(items));
}

// Cargar desde localStorage
function loadItems(section) {
    const items = JSON.parse(localStorage.getItem(`${section}Items`) || '[]');
    items.forEach(item => {
        currentSection = section;
        document.getElementById('modalServiceName').value = item.name;
        document.getElementById('modalServiceContent').value = item.content;
        saveModalData();
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    createSnowflakes();
    ['bins', 'tools', 'accounts', 'settings'].forEach(section => {
        loadItems(section);
        updateEmptyState(section);
    });
});

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        closeModal();
    }
});

window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    if (!document.querySelector('.section.active')) {
        sidebar.style.transform = 'translateX(0)';
    }
});

// Soporte para teclas
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('modal').classList.contains('active')) {
        closeModal();
    }
});

// Animación suave al scroll
document.querySelectorAll('.section').forEach(section => {
    section.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const items = section.querySelectorAll('.item');
            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }
            });
        });
    });
});
