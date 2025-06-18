// Admin Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAdminAuth();
    
    // Setup login form
    setupLoginForm();
    
    // Setup admin dashboard
    setupAdminDashboard();
});

// Check admin authentication
function checkAdminAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (isLoggedIn === 'true') {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadDashboardData();
    } else {
        loginScreen.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
}

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle admin login
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    // Get admin credentials from localStorage
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    
    if (username === adminUser.username && password === adminUser.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        checkAdminAuth();
    } else {
        alert('Username atau password salah!');
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    checkAdminAuth();
}

// Setup admin dashboard
function setupAdminDashboard() {
    // Setup menu navigation
    setupMenuNavigation();
    
    // Setup form handlers
    setupAdminForms();
    
    // Setup filter handlers
    setupFilterHandlers();
}

// Setup menu navigation
function setupMenuNavigation() {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.admin-section');
    
    menuButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetSection = this.dataset.section;
            
            // Update active menu
            menuButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection + 'Section') {
                    section.classList.add('active');
                }
            });
            
            // Load section data
            loadSectionData(targetSection);
        });
    });
}

// Load dashboard data
function loadDashboardData() {
    loadOverviewData();
    loadServicesData();
    loadBookingsData();
    loadEmergencyData();
}

// Load section data based on active section
function loadSectionData(section) {
    switch(section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'services':
            loadServicesData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'emergency':
            loadEmergencyData();
            break;
    }
}

// Load overview data
function loadOverviewData() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const emergencyCalls = JSON.parse(localStorage.getItem('emergencyCalls')) || [];
    const services = JSON.parse(localStorage.getItem('services')) || [];
    
    // Calculate today's data
    const today = new Date().toDateString();
    const todayBookings = bookings.filter(b => new Date(b.timestamp).toDateString() === today);
    const activeEmergencies = emergencyCalls.filter(e => e.status === 'pending' || e.status === 'dispatched');
    const todayRevenue = todayBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    
    // Update stats
    document.getElementById('todayBookings').textContent = todayBookings.length;
    document.getElementById('activeEmergencies').textContent = activeEmergencies.length;
    document.getElementById('todayRevenue').textContent = `Rp ${formatPrice(todayRevenue)}`;
    document.getElementById('totalServices').textContent = services.length;
    
    // Load recent activities
    loadRecentActivities();
}

// Load recent activities
function loadRecentActivities() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const emergencyCalls = JSON.parse(localStorage.getItem('emergencyCalls')) || [];
    
    // Combine and sort by timestamp
    const activities = [
        ...bookings.map(b => ({
            type: 'booking',
            text: `Booking baru: ${b.name} - ${b.service}`,
            timestamp: b.timestamp
        })),
        ...emergencyCalls.map(e => ({
            type: 'emergency',
            text: `Panggilan darurat: ${e.name} - ${e.problem}`,
            timestamp: e.timestamp
        }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    
    const activitiesContainer = document.getElementById('recentActivities');
    activitiesContainer.innerHTML = '';
    
    if (activities.length === 0) {
        activitiesContainer.innerHTML = '<p>Belum ada aktivitas hari ini.</p>';
        return;
    }
    
    activities.forEach(activity => {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-time">${formatDateTime(activity.timestamp)}</div>
            <div class="activity-text">${activity.text}</div>
        `;
        activitiesContainer.appendChild(activityElement);
    });
}

// Load services data
function loadServicesData() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const tableBody = document.getElementById('servicesTableBody');
    
    tableBody.innerHTML = '';
    
    services.forEach(service => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.name}</td>
            <td>${service.category}</td>
            <td>Rp ${formatPrice(service.price)}</td>
            <td>
                <button class="action-btn edit" onclick="editService('${service.id}')">Edit</button>
                <button class="action-btn delete" onclick="deleteService('${service.id}')">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load bookings data
function loadBookingsData() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const tableBody = document.getElementById('bookingsTableBody');
    const statusFilter = document.getElementById('statusFilter');
    
    let filteredBookings = bookings;
    if (statusFilter && statusFilter.value) {
        filteredBookings = bookings.filter(b => b.status === statusFilter.value);
    }
    
    tableBody.innerHTML = '';
    
    filteredBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.name}</td>
            <td>${booking.service}</td>
            <td>${formatDate(booking.date)}</td>
            <td><span class="status-badge status-${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>
                <button class="action-btn status" onclick="updateStatus('${booking.id}', 'booking')">Update Status</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Load emergency data
function loadEmergencyData() {
    const emergencyCalls = JSON.parse(localStorage.getItem('emergencyCalls')) || [];
    const tableBody = document.getElementById('emergencyTableBody');
    const statusFilter = document.getElementById('emergencyStatusFilter');
    
    let filteredCalls = emergencyCalls;
    if (statusFilter && statusFilter.value) {
        filteredCalls = emergencyCalls.filter(e => e.status === statusFilter.value);
    }
    
    tableBody.innerHTML = '';
    
    filteredCalls.forEach(call => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${call.id}</td>
            <td>${call.name}</td>
            <td>${call.location.substring(0, 30)}...</td>
            <td>${call.problem}</td>
            <td>${formatDateTime(call.timestamp)}</td>
            <td><span class="status-badge status-${call.status}">${getStatusText(call.status)}</span></td>
            <td>
                <button class="action-btn status" onclick="updateStatus('${call.id}', 'emergency')">Update Status</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Setup admin forms
function setupAdminForms() {
    // Service form
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleServiceSubmit);
    }
    
    // Status form
    const statusForm = document.getElementById('statusForm');
    if (statusForm) {
        statusForm.addEventListener('submit', handleStatusSubmit);
    }
}

// Setup filter handlers
function setupFilterHandlers() {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => loadBookingsData());
    }
    
    const emergencyStatusFilter = document.getElementById('emergencyStatusFilter');
    if (emergencyStatusFilter) {
        emergencyStatusFilter.addEventListener('change', () => loadEmergencyData());
    }
}

// Show add service modal
function showAddServiceModal() {
    document.getElementById('serviceModalTitle').textContent = 'Tambah Layanan';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceId').value = '';
    document.getElementById('serviceModal').style.display = 'block';
}

// Edit service
function editService(serviceId) {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const service = services.find(s => s.id === serviceId);
    
    if (service) {
        document.getElementById('serviceModalTitle').textContent = 'Edit Layanan';
        document.getElementById('serviceId').value = service.id;
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceCategory').value = service.category;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('serviceModal').style.display = 'block';
    }
}

// Delete service
function deleteService(serviceId) {
    if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
        let services = JSON.parse(localStorage.getItem('services')) || [];
        services = services.filter(s => s.id !== serviceId);
        localStorage.setItem('services', JSON.stringify(services));
        loadServicesData();
    }
}

// Handle service form submission
function handleServiceSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceId = formData.get('id');
    const serviceData = {
        id: serviceId || generateServiceId(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        description: formData.get('description'),
        image: 'images/service_icon.png' // Default image
    };
    
    let services = JSON.parse(localStorage.getItem('services')) || [];
    
    if (serviceId) {
        // Update existing service
        const index = services.findIndex(s => s.id === serviceId);
        if (index !== -1) {
            services[index] = serviceData;
        }
    } else {
        // Add new service
        services.push(serviceData);
    }
    
    localStorage.setItem('services', JSON.stringify(services));
    closeServiceModal();
    loadServicesData();
}

// Generate service ID
function generateServiceId() {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const maxId = services.reduce((max, service) => {
        const num = parseInt(service.id.replace('SRV', ''));
        return num > max ? num : max;
    }, 0);
    return `SRV${(maxId + 1).toString().padStart(3, '0')}`;
}

// Update status
function updateStatus(itemId, type) {
    document.getElementById('statusItemId').value = itemId;
    document.getElementById('statusItemType').value = type;
    
    // Populate status options based on type
    const statusSelect = document.getElementById('newStatus');
    statusSelect.innerHTML = '';
    
    let statusOptions = [];
    if (type === 'booking') {
        statusOptions = [
            { value: 'pending', text: 'Pending' },
            { value: 'confirmed', text: 'Dikonfirmasi' },
            { value: 'in_progress', text: 'Sedang Dikerjakan' },
            { value: 'completed', text: 'Selesai' },
            { value: 'cancelled', text: 'Dibatalkan' }
        ];
    } else if (type === 'emergency') {
        statusOptions = [
            { value: 'pending', text: 'Menunggu' },
            { value: 'dispatched', text: 'Montir Dikirim' },
            { value: 'in_progress', text: 'Sedang Ditangani' },
            { value: 'completed', text: 'Selesai' }
        ];
    }
    
    statusOptions.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        statusSelect.appendChild(optionElement);
    });
    
    document.getElementById('statusModalTitle').textContent = `Update Status ${type === 'booking' ? 'Booking' : 'Emergency'}`;
    document.getElementById('statusModal').style.display = 'block';
}

// Handle status form submission
function handleStatusSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const itemId = formData.get('id');
    const itemType = formData.get('type');
    const newStatus = formData.get('status');
    const notes = formData.get('notes');
    
    const storageKey = itemType === 'booking' ? 'bookings' : 'emergencyCalls';
    let items = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        items[itemIndex].status = newStatus;
        items[itemIndex].lastUpdate = new Date().toISOString();
        if (notes) {
            items[itemIndex].notes = notes;
        }
        
        localStorage.setItem(storageKey, JSON.stringify(items));
        closeStatusModal();
        
        // Reload appropriate data
        if (itemType === 'booking') {
            loadBookingsData();
        } else {
            loadEmergencyData();
        }
        
        // Refresh overview if it's active
        const overviewSection = document.getElementById('overviewSection');
        if (overviewSection.classList.contains('active')) {
            loadOverviewData();
        }
    }
}

// Close modals
function closeServiceModal() {
    document.getElementById('serviceModal').style.display = 'none';
}

function closeStatusModal() {
    document.getElementById('statusModal').style.display = 'none';
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID').format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('id-ID');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Dikonfirmasi',
        'in_progress': 'Sedang Dikerjakan',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan',
        'dispatched': 'Montir Dikirim'
    };
    return statusMap[status] || status;
}

// Global functions
window.logout = logout;
window.showAddServiceModal = showAddServiceModal;
window.editService = editService;
window.deleteService = deleteService;
window.updateStatus = updateStatus;
window.closeServiceModal = closeServiceModal;
window.closeStatusModal = closeStatusModal;

