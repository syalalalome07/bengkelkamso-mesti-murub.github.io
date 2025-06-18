// Car Workshop Website - JavaScript Only Implementation
// All functionality using localStorage for data persistence

class CarWorkshopApp {
    constructor() {
        this.services = [];
        this.bookings = [];
        this.emergencyCalls = [];
        this.trackingData = [];
        this.currentMessage = '';
        
        this.init();
    }

    init() {
        this.loadData();
        this.initializeServices();
        this.bindEvents();
        this.populateServices();
        this.populateServiceOptions();
        this.setMinDate();
    }

    // Data Management
    loadData() {
        this.services = JSON.parse(localStorage.getItem('carWorkshop_services')) || [];
        this.bookings = JSON.parse(localStorage.getItem('carWorkshop_bookings')) || [];
        this.emergencyCalls = JSON.parse(localStorage.getItem('carWorkshop_emergencyCalls')) || [];
        this.trackingData = JSON.parse(localStorage.getItem('carWorkshop_trackingData')) || [];
    }

    saveData() {
        localStorage.setItem('carWorkshop_services', JSON.stringify(this.services));
        localStorage.setItem('carWorkshop_bookings', JSON.stringify(this.bookings));
        localStorage.setItem('carWorkshop_emergencyCalls', JSON.stringify(this.emergencyCalls));
        localStorage.setItem('carWorkshop_trackingData', JSON.stringify(this.trackingData));
    }

    initializeServices() {
        if (this.services.length === 0) {
            this.services = [
                {
                    id: 1,
                    name: 'Ganti Oli Mesin',
                    description: 'Penggantian oli mesin berkualitas dengan filter oli baru. Termasuk pemeriksaan level cairan lainnya.',
                    price: 150000,
                    category: 'maintenance',
                    icon: 'fas fa-oil-can',
                    features: ['Oli berkualitas tinggi', 'Filter oli baru', 'Pemeriksaan cairan', 'Garansi 3 bulan']
                },
                {
                    id: 2,
                    name: 'Servis Rutin',
                    description: 'Pemeriksaan menyeluruh kondisi kendaraan meliputi mesin, rem, suspensi, dan sistem kelistrikan.',
                    price: 200000,
                    category: 'maintenance',
                    icon: 'fas fa-tools',
                    features: ['Pemeriksaan 50 poin', 'Laporan kondisi', 'Saran perbaikan', 'Garansi kerja']
                },
                {
                    id: 3,
                    name: 'Tune Up Mesin',
                    description: 'Optimalisasi performa mesin dengan pembersihan injector, ganti busi, dan setting ulang ECU.',
                    price: 350000,
                    category: 'maintenance',
                    icon: 'fas fa-cog',
                    features: ['Pembersihan injector', 'Ganti busi premium', 'Setting ECU', 'Test drive']
                },
                {
                    id: 4,
                    name: 'Service AC Mobil',
                    description: 'Perawatan sistem AC meliputi pembersihan evaporator, isi freon, dan pemeriksaan komponen.',
                    price: 250000,
                    category: 'repair',
                    icon: 'fas fa-snowflake',
                    features: ['Pembersihan evaporator', 'Isi freon R134a', 'Cek kompresor', 'Garansi dingin']
                },
                {
                    id: 5,
                    name: 'Service Rem',
                    description: 'Pemeriksaan dan perawatan sistem rem meliputi kampas rem, minyak rem, dan kalibrasi.',
                    price: 180000,
                    category: 'safety',
                    icon: 'fas fa-stop-circle',
                    features: ['Cek kampas rem', 'Ganti minyak rem', 'Kalibrasi sistem', 'Test pengereman']
                },
                {
                    id: 6,
                    name: 'Ban & Velg',
                    description: 'Pemasangan ban baru, balancing, spooring, dan pemeriksaan kondisi velg.',
                    price: 100000,
                    category: 'maintenance',
                    icon: 'fas fa-circle',
                    features: ['Balancing roda', 'Spooring', 'Cek tekanan', 'Rotasi ban']
                }
            ];
            this.saveData();
        }
    }

    // Event Binding
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.scrollToSection(target);
            });
        });

        // Emergency Form
        const emergencyForm = document.getElementById('emergencyForm');
        if (emergencyForm) {
            emergencyForm.addEventListener('submit', (e) => this.handleEmergencySubmit(e));
        }

        // Booking Form
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
            
            // Service selection change
            const serviceSelect = document.getElementById('bookingService');
            if (serviceSelect) {
                serviceSelect.addEventListener('change', () => this.updatePriceDisplay());
            }
        }

        // Tracking Form
        const trackingForm = document.getElementById('trackingForm');
        if (trackingForm) {
            trackingForm.addEventListener('submit', (e) => this.handleTrackingSubmit(e));
        }

        // WhatsApp Chat
        this.initWhatsAppChat();

        // Modals
        this.initModals();

        // Mobile Menu
        this.initMobileMenu();
    }

    // Navigation
    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }

    // Services Management
    populateServices() {
        const servicesList = document.getElementById('servicesList');
        if (!servicesList) return;

        servicesList.innerHTML = '';

        this.services.forEach(service => {
            const serviceCard = this.createServiceCard(service);
            servicesList.appendChild(serviceCard);
        });
    }

    createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card fade-in-up';
        
        card.innerHTML = `
            <div class="service-header">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3 class="service-title">${service.name}</h3>
            </div>
            <p class="service-description">${service.description}</p>
            <div class="service-price">Rp ${this.formatPrice(service.price)}</div>
            <ul class="service-features">
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn btn-primary" onclick="app.selectServiceForBooking(${service.id})">
                Booking Sekarang
            </button>
        `;

        return card;
    }

    populateServiceOptions() {
        const serviceSelect = document.getElementById('bookingService');
        if (!serviceSelect) return;

        // Clear existing options except the first one
        serviceSelect.innerHTML = '<option value="">Pilih layanan</option>';

        this.services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = `${service.name} - Rp ${this.formatPrice(service.price)}`;
            serviceSelect.appendChild(option);
        });
    }

    selectServiceForBooking(serviceId) {
        const serviceSelect = document.getElementById('bookingService');
        if (serviceSelect) {
            serviceSelect.value = serviceId;
            this.updatePriceDisplay();
        }
        this.scrollToSection('#booking');
    }

    updatePriceDisplay() {
        const serviceSelect = document.getElementById('bookingService');
        const priceDisplay = document.getElementById('priceDisplay');
        const totalPrice = document.getElementById('totalPrice');

        if (!serviceSelect || !priceDisplay || !totalPrice) return;

        const selectedServiceId = parseInt(serviceSelect.value);
        
        if (selectedServiceId) {
            const service = this.services.find(s => s.id === selectedServiceId);
            if (service) {
                totalPrice.textContent = `Rp ${this.formatPrice(service.price)}`;
                priceDisplay.style.display = 'block';
            }
        } else {
            priceDisplay.style.display = 'none';
        }
    }

    // Form Handlers
    handleEmergencySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const emergencyData = {
            id: this.generateTrackingId('EM'),
            name: formData.get('name'),
            phone: formData.get('phone'),
            location: formData.get('location'),
            problem: formData.get('problem'),
            description: formData.get('description'),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.showLoading();

        // Simulate processing time
        setTimeout(() => {
            this.emergencyCalls.push(emergencyData);
            this.addToTracking(emergencyData.id, 'emergency', emergencyData);
            this.saveData();
            
            this.hideLoading();
            this.showSuccessModal(
                'Panggilan darurat berhasil dikirim!',
                `Montir akan segera menghubungi Anda di ${emergencyData.phone}`,
                emergencyData.id
            );

            // Generate WhatsApp message
            this.currentMessage = this.generateEmergencyWhatsAppMessage(emergencyData);
            
            e.target.reset();
        }, 2000);
    }

    handleBookingSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const selectedServiceId = parseInt(formData.get('service'));
        const service = this.services.find(s => s.id === selectedServiceId);
        
        if (!service) {
            alert('Silakan pilih layanan terlebih dahulu');
            return;
        }

        const bookingData = {
            id: this.generateTrackingId('BK'),
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            date: formData.get('date'),
            time: formData.get('time'),
            service: service,
            vehicle: {
                brand: formData.get('vehicleBrand'),
                model: formData.get('vehicleModel'),
                year: formData.get('vehicleYear')
            },
            notes: formData.get('notes'),
            paymentMethod: formData.get('paymentMethod'),
            timestamp: new Date().toISOString(),
            status: 'confirmed'
        };

        // Handle payment method
        if (bookingData.paymentMethod === 'qris') {
            this.showQRISPayment(service.price, bookingData);
        } else {
            this.processBooking(bookingData);
        }
    }

    processBooking(bookingData) {
        this.showLoading();

        setTimeout(() => {
            this.bookings.push(bookingData);
            this.addToTracking(bookingData.id, 'booking', bookingData);
            this.saveData();
            
            this.hideLoading();
            this.showSuccessModal(
                'Booking berhasil dikonfirmasi!',
                `Kami akan menghubungi Anda untuk konfirmasi jadwal di ${bookingData.phone}`,
                bookingData.id
            );

            // Generate WhatsApp message
            this.currentMessage = this.generateBookingWhatsAppMessage(bookingData);
            
            document.getElementById('bookingForm').reset();
            document.getElementById('priceDisplay').style.display = 'none';
        }, 2000);
    }

    handleTrackingSubmit(e) {
        e.preventDefault();
        
        const trackingId = document.getElementById('trackingId').value.trim().toUpperCase();
        const trackingResults = document.getElementById('trackingResults');
        const trackingError = document.getElementById('trackingError');

        if (!trackingId) return;

        this.showLoading();

        setTimeout(() => {
            const trackingInfo = this.trackingData.find(item => item.id === trackingId);
            
            this.hideLoading();
            
            if (trackingInfo) {
                this.displayTrackingResults(trackingInfo);
                trackingResults.style.display = 'block';
                trackingError.style.display = 'none';
            } else {
                trackingResults.style.display = 'none';
                trackingError.style.display = 'block';
            }
        }, 1000);
    }

    // Tracking System
    generateTrackingId(prefix) {
        const date = new Date();
        const dateStr = date.getFullYear().toString() + 
                       (date.getMonth() + 1).toString().padStart(2, '0') + 
                       date.getDate().toString().padStart(2, '0');
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}${dateStr}${randomStr}`;
    }

    addToTracking(id, type, data) {
        const trackingItem = {
            id: id,
            type: type,
            data: data,
            timeline: this.generateTimeline(type, data.status),
            lastUpdated: new Date().toISOString()
        };

        this.trackingData.push(trackingItem);
    }

    generateTimeline(type, status) {
        const baseTimeline = {
            emergency: [
                { title: 'Panggilan Diterima', description: 'Permintaan darurat telah diterima', status: 'completed' },
                { title: 'Montir Dikirim', description: 'Montir sedang dalam perjalanan ke lokasi', status: 'current' },
                { title: 'Tiba di Lokasi', description: 'Montir telah tiba dan memulai pemeriksaan', status: 'pending' },
                { title: 'Selesai', description: 'Masalah telah diselesaikan', status: 'pending' }
            ],
            booking: [
                { title: 'Booking Dikonfirmasi', description: 'Jadwal servis telah dikonfirmasi', status: 'completed' },
                { title: 'Persiapan', description: 'Tim sedang mempersiapkan peralatan dan suku cadang', status: 'current' },
                { title: 'Servis Berlangsung', description: 'Kendaraan sedang dalam proses servis', status: 'pending' },
                { title: 'Quality Check', description: 'Pemeriksaan kualitas hasil servis', status: 'pending' },
                { title: 'Selesai', description: 'Kendaraan siap diambil', status: 'pending' }
            ]
        };

        return baseTimeline[type] || [];
    }

    displayTrackingResults(trackingInfo) {
        const trackingResults = document.getElementById('trackingResults');
        
        const statusClass = this.getStatusClass(trackingInfo.data.status);
        const statusText = this.getStatusText(trackingInfo.data.status);
        
        trackingResults.innerHTML = `
            <div class="tracking-header">
                <div>
                    <h3>Tracking ID: <span class="tracking-id">${trackingInfo.id}</span></h3>
                    <p><strong>Jenis:</strong> ${trackingInfo.type === 'emergency' ? 'Panggilan Darurat' : 'Booking Layanan'}</p>
                </div>
                <div class="tracking-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="tracking-timeline">
                ${trackingInfo.timeline.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-icon ${item.status}">
                            <i class="fas ${this.getTimelineIcon(item.status)}"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-title">${item.title}</div>
                            <div class="timeline-description">${item.description}</div>
                            <div class="timeline-time">${item.status === 'completed' ? 'Selesai' : item.status === 'current' ? 'Sedang Berlangsung' : 'Menunggu'}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="tracking-info">
                <p><strong>Terakhir diupdate:</strong> ${this.formatDateTime(trackingInfo.lastUpdated)}</p>
                ${trackingInfo.type === 'booking' ? `<p><strong>Layanan:</strong> ${trackingInfo.data.service.name}</p>` : ''}
                ${trackingInfo.type === 'emergency' ? `<p><strong>Masalah:</strong> ${trackingInfo.data.problem}</p>` : ''}
            </div>
        `;
    }

    getStatusClass(status) {
        const statusMap = {
            'pending': 'status-pending',
            'confirmed': 'status-progress',
            'in-progress': 'status-progress',
            'completed': 'status-completed'
        };
        return statusMap[status] || 'status-pending';
    }

    getStatusText(status) {
        const statusMap = {
            'pending': 'Menunggu',
            'confirmed': 'Dikonfirmasi',
            'in-progress': 'Sedang Berlangsung',
            'completed': 'Selesai'
        };
        return statusMap[status] || 'Tidak Diketahui';
    }

    getTimelineIcon(status) {
        const iconMap = {
            'completed': 'fa-check',
            'current': 'fa-clock',
            'pending': 'fa-circle'
        };
        return iconMap[status] || 'fa-circle';
    }

    // Payment System
    showQRISPayment(amount, bookingData) {
        const paymentModal = document.getElementById('paymentModal');
        const paymentAmount = document.getElementById('paymentAmount');
        
        paymentAmount.textContent = `Rp ${this.formatPrice(amount)}`;
        paymentModal.style.display = 'flex';

        // Handle payment confirmation
        document.getElementById('paymentConfirmBtn').onclick = () => {
            paymentModal.style.display = 'none';
            bookingData.paymentStatus = 'paid';
            this.processBooking(bookingData);
        };

        document.getElementById('paymentCancelBtn').onclick = () => {
            paymentModal.style.display = 'none';
        };
    }

    // WhatsApp Integration
    initWhatsAppChat() {
        const whatsappButton = document.getElementById('whatsappButton');
        const whatsappWidget = document.getElementById('whatsappWidget');
        const whatsappClose = document.getElementById('whatsappClose');
        const whatsappSend = document.getElementById('whatsappSend');

        whatsappButton.addEventListener('click', () => {
            whatsappWidget.style.display = whatsappWidget.style.display === 'none' ? 'block' : 'none';
        });

        whatsappClose.addEventListener('click', () => {
            whatsappWidget.style.display = 'none';
        });

        whatsappSend.addEventListener('click', () => {
            this.openWhatsApp(this.currentMessage || 'Halo, saya ingin bertanya tentang layanan bengkel.');
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        let message = '';
        
        switch (action) {
            case 'emergency':
                message = '🚨 PANGGILAN DARURAT\n\nSaya membutuhkan bantuan montir segera!\n\nLokasi: [Isi lokasi Anda]\nMasalah: [Jelaskan masalah kendaraan]\nNomor HP: [Nomor yang bisa dihubungi]';
                break;
            case 'booking':
                message = '📅 BOOKING LAYANAN\n\nSaya ingin booking layanan servis:\n\nLayanan: [Pilih layanan]\nTanggal: [Tanggal yang diinginkan]\nKendaraan: [Merk dan model]\nNomor HP: [Nomor yang bisa dihubungi]';
                break;
            case 'price':
                message = '💰 TANYA HARGA\n\nSaya ingin menanyakan harga untuk:\n\n[Jelaskan layanan yang dibutuhkan]\n\nKendaraan: [Merk dan model]\nTahun: [Tahun kendaraan]';
                break;
            case 'tracking':
                message = '📍 CEK STATUS\n\nSaya ingin mengecek status layanan:\n\nTracking ID: [Masukkan tracking ID Anda]\n\nAtau bisa juga cek di website: [URL tracking]';
                break;
        }

        this.openWhatsApp(message);
    }

    generateEmergencyWhatsAppMessage(data) {
        return `🚨 PANGGILAN DARURAT 🚨

Nama: ${data.name}
Telepon: ${data.phone}
Lokasi: ${data.location}
Masalah: ${data.problem}
${data.description ? `Detail: ${data.description}` : ''}

Tracking ID: ${data.id}

Mohon segera kirim montir ke lokasi. Terima kasih!`;
    }

    generateBookingWhatsAppMessage(data) {
        return `📅 KONFIRMASI BOOKING

Nama: ${data.name}
Telepon: ${data.phone}
Email: ${data.email}
Tanggal: ${data.date} (${data.time})
Layanan: ${data.service.name}
Harga: Rp ${this.formatPrice(data.service.price)}
Kendaraan: ${data.vehicle.brand} ${data.vehicle.model} (${data.vehicle.year})
${data.notes ? `Catatan: ${data.notes}` : ''}
Pembayaran: ${data.paymentMethod === 'cod' ? 'COD (Bayar di Tempat)' : 'QRIS (Transfer Digital)'}

Tracking ID: ${data.id}

Mohon konfirmasi jadwal. Terima kasih!`;
    }

    openWhatsApp(message) {
        const phoneNumber = '62895386294546'; // Format internasional tanpa +
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        
        // Hide widget after opening WhatsApp
        document.getElementById('whatsappWidget').style.display = 'none';
    }

    // Modal Management
    initModals() {
        // Close modals when clicking outside or on close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                this.hideAllModals();
            }
        });

        // Modal OK button
        document.getElementById('modalOkBtn').addEventListener('click', () => {
            this.hideAllModals();
        });
    }

    showSuccessModal(title, message, trackingId = null) {
        const modal = document.getElementById('successModal');
        const messageElement = document.getElementById('successMessage');
        const trackingInfo = document.getElementById('trackingInfo');
        const trackingIdElement = document.getElementById('generatedTrackingId');

        messageElement.textContent = message;
        
        if (trackingId) {
            trackingIdElement.textContent = trackingId;
            trackingInfo.style.display = 'block';
        } else {
            trackingInfo.style.display = 'none';
        }

        modal.style.display = 'flex';
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Loading Management
    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    // Mobile Menu
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');

        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-active');
                mobileToggle.classList.toggle('active');
            });
        }
    }

    // Utility Functions
    formatPrice(price) {
        return new Intl.NumberFormat('id-ID').format(price);
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    setMinDate() {
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const minDate = tomorrow.toISOString().split('T')[0];
            dateInput.setAttribute('min', minDate);
        }
    }

    // Admin Functions (for admin dashboard)
    getServices() {
        return this.services;
    }

    updateService(serviceId, updatedData) {
        const index = this.services.findIndex(s => s.id === serviceId);
        if (index !== -1) {
            this.services[index] = { ...this.services[index], ...updatedData };
            this.saveData();
            this.populateServices();
            this.populateServiceOptions();
            return true;
        }
        return false;
    }

    addService(serviceData) {
        const newId = Math.max(...this.services.map(s => s.id)) + 1;
        const newService = {
            id: newId,
            ...serviceData,
            features: serviceData.features || []
        };
        this.services.push(newService);
        this.saveData();
        this.populateServices();
        this.populateServiceOptions();
        return newService;
    }

    deleteService(serviceId) {
        const index = this.services.findIndex(s => s.id === serviceId);
        if (index !== -1) {
            this.services.splice(index, 1);
            this.saveData();
            this.populateServices();
            this.populateServiceOptions();
            return true;
        }
        return false;
    }

    getBookings() {
        return this.bookings;
    }

    getEmergencyCalls() {
        return this.emergencyCalls;
    }

    updateTrackingStatus(trackingId, newStatus, newTimeline = null) {
        const trackingIndex = this.trackingData.findIndex(item => item.id === trackingId);
        if (trackingIndex !== -1) {
            this.trackingData[trackingIndex].data.status = newStatus;
            this.trackingData[trackingIndex].lastUpdated = new Date().toISOString();
            
            if (newTimeline) {
                this.trackingData[trackingIndex].timeline = newTimeline;
            }

            // Update in bookings or emergency calls
            const bookingIndex = this.bookings.findIndex(b => b.id === trackingId);
            if (bookingIndex !== -1) {
                this.bookings[bookingIndex].status = newStatus;
            }

            const emergencyIndex = this.emergencyCalls.findIndex(e => e.id === trackingId);
            if (emergencyIndex !== -1) {
                this.emergencyCalls[emergencyIndex].status = newStatus;
            }

            this.saveData();
            return true;
        }
        return false;
    }
}

// Initialize the application
const app = new CarWorkshopApp();

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--bg-color)';
            header.style.backdropFilter = 'none';
        }
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .service-card, .section-header').forEach(el => {
        observer.observe(el);
    });
});

