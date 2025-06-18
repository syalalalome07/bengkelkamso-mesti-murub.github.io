const initialServices = [
    {
        id: 'SRV001',
        name: 'Ganti Oli',
        category: 'Maintenance',
        price: 150000,
        description: 'Penggantian oli mesin dengan oli berkualitas tinggi.',
        image: 'images/service_icon.png'
    },
    {
        id: 'SRV002',
        name: 'Servis Ringan',
        category: 'Maintenance',
        price: 250000,
        description: 'Pengecekan umum, pembersihan filter udara, dan pengecekan cairan.',
        image: 'images/service_icon.png'
    },
    {
        id: 'SRV003',
        name: 'Tune Up',
        category: 'Maintenance',
        price: 350000,
        description: 'Penyetelan mesin untuk performa optimal, termasuk busi dan filter.',
        image: 'images/service_icon.png'
    },
    {
        id: 'SRV004',
        name: 'Ban Bocor',
        category: 'Emergency',
        price: 100000,
        description: 'Penambalan ban di lokasi atau penggantian ban darurat.',
        image: 'images/emergency_icon.png'
    },
    {
        id: 'SRV005',
        name: 'Jump Start',
        category: 'Emergency',
        price: 120000,
        description: 'Bantuan jump start untuk aki mobil yang soak.',
        image: 'images/emergency_icon.png'
    },
    {
        id: 'SRV006',
        name: 'Montir ke Lokasi',
        category: 'Emergency',
        price: 200000,
        description: 'Panggilan montir untuk perbaikan ringan di lokasi.',
        image: 'images/emergency_icon.png'
    }
];

const initialAdminUser = {
    username: 'admin',
    password: 'admin123'
};

// Function to initialize data in localStorage if not already present
function initializeData() {
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify(initialServices));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('emergencyCalls')) {
        localStorage.setItem('emergencyCalls', JSON.stringify([]));
    }
    if (!localStorage.getItem('adminUser')) {
        localStorage.setItem('adminUser', JSON.stringify(initialAdminUser));
    }
}

initializeData();


