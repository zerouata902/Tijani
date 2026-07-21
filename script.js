/* ============================================================
   TIJANI PARFUMES — script.js
   ============================================================ */

// ── STATE ─────────────────────────────────────────────────────
let selectedGender = null;
let selectedSize = null;
let selectedQuantity = null;
let perfumeNames = [];

// ── PRICES (الأسعار الجديدة) ────────────────────────────────
const prices = {
    '30ml': { 1: 40, 3: 100 },
    '50ml': { 1: 70, 3: 180 }
};

// ── IMAGES (من المجلد المحلي) ──────────────────────────────
// ⚠️ غير هذه المسارات حسب مكان صورك
const genderImages = {
    'رجال': 'D1.jpg',     // ← غير هذا المسار
    'نساء': 'D2.jpg'    // ← غير هذا المسار
};

// ── FUNCTIONS ────────────────────────────────────────────────

// اختيار الجنس
function selectGender(gender) {
    selectedGender = gender;
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    document.querySelectorAll('#step1 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === gender);
    });
    
    showToast('✅ تم اختيار: ' + gender);
}

// اختيار الحجم
function selectSize(size) {
    selectedSize = size;
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    
    document.querySelectorAll('#step2 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === size);
    });
    
    showToast('✅ تم اختيار: ' + size);
}

// اختيار العدد
function selectQuantity(qty) {
    selectedQuantity = parseInt(qty);
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'block';
    
    document.querySelectorAll('#step3 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === qty);
    });
    
    // عرض صورة الفئة المختارة من المجلد المحلي
    const img = document.getElementById('perfumeSingleImage');
    img.src = genderImages[selectedGender];
    document.getElementById('perfumeSingleImageContainer').style.display = 'flex';
    
    // إنشاء خانات الإدخال
    createPerfumeInputs(qty);
    
    // عرض السعر حسب الاختيار
    const price = prices[selectedSize][selectedQuantity];
    showToast('✅ تم اختيار: ' + qty + ' عطر - السعر: ' + price + ' درهم');
}

// إنشاء خانات إدخال أسماء العطور
function createPerfumeInputs(qty) {
    const container = document.getElementById('perfumeInputs');
    container.innerHTML = '';
    perfumeNames = [];
    
    const genderLabel = selectedGender === 'رجال' ? '🔖' : '👗';
    
    for (let i = 0; i < qty; i++) {
        const div = document.createElement('div');
        div.className = 'perfume-input-group';
        div.innerHTML = `
            <span class="perfume-number">${i + 1}</span>
            <input type="text" class="perfume-input" placeholder="أدخل اسم العطر ${i + 1}" data-index="${i}" />
        `;
        container.appendChild(div);
    }
}

// جمع أسماء العطور
function getPerfumeNames() {
    const inputs = document.querySelectorAll('.perfume-input');
    const names = [];
    inputs.forEach(input => {
        if (input.value.trim()) {
            names.push(input.value.trim());
        }
    });
    return names;
}

// عرض الملخص
function showSummary() {
    const names = getPerfumeNames();
    if (names.length < selectedQuantity) {
        showToast('⚠️ الرجاء إدخال أسماء جميع العطور');
        return;
    }
    
    perfumeNames = names;
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step5').style.display = 'block';
    
    updateSummary();
}

// العودة للخطوة السابقة
function goBack(step) {
    if (step === 'step2') {
        document.getElementById('step2').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
        selectedGender = null;
    } else if (step === 'step3') {
        document.getElementById('step3').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
        selectedSize = null;
    } else if (step === 'step4') {
        document.getElementById('step4').style.display = 'none';
        document.getElementById('step3').style.display = 'block';
        selectedQuantity = null;
        document.getElementById('perfumeSingleImageContainer').style.display = 'none';
    } else if (step === 'step5') {
        document.getElementById('step5').style.display = 'none';
        document.getElementById('step4').style.display = 'block';
        createPerfumeInputs(selectedQuantity);
    }
}

// تحديث الملخص
function updateSummary() {
    const genderMap = { 'رجال': '👤 رجال', 'نساء': '👩 نساء' };
    document.getElementById('summaryGender').textContent = genderMap[selectedGender] || '-';
    document.getElementById('summarySize').textContent = selectedSize || '-';
    document.getElementById('summaryQuantity').textContent = selectedQuantity + ' عطر' || '-';
    document.getElementById('summaryPerfumes').textContent = perfumeNames.join('، ') || '-';
    
    if (selectedSize && selectedQuantity) {
        const price = prices[selectedSize][selectedQuantity];
        document.getElementById('summaryPrice').textContent = price + ' درهم';
    } else {
        document.getElementById('summaryPrice').textContent = '-';
    }
}

// إرسال الطلب عبر واتساب
function sendOrder() {
    const name = document.getElementById('clientName').value.trim();
    const city = document.getElementById('clientCity').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    
    if (!name || !city || !address || !phone) {
        showToast('⚠️ الرجاء ملء جميع الحقول');
        return;
    }
    
    if (!selectedGender || !selectedSize || !selectedQuantity) {
        showToast('⚠️ الرجاء اختيار جميع الخيارات');
        return;
    }
    
    const price = prices[selectedSize][selectedQuantity];
    const genderMap = { 'رجال': 'رجال', 'نساء': 'نساء' };
    const perfumesList = perfumeNames.join('، ');
    
    const msg = `🛍️ *طلب جديد من TIJANI PARFUMES*%0A%0A` +
        `👤 الاسم: ${name}%0A` +
        `📍 المدينة: ${city}%0A` +
        `🏠 العنوان: ${address}%0A` +
        `📱 الهاتف: ${phone}%0A%0A` +
        `📦 *تفاصيل الطلب:*%0A` +
        `👤 الفئة: ${genderMap[selectedGender]}%0A` +
        `📏 الحجم: ${selectedSize}%0A` +
        `🔢 العدد: ${selectedQuantity} عطر%0A` +
        `🌸 العطور: ${perfumesList}%0A` +
        `💰 السعر الإجمالي: ${price} درهم`;
    
    const url = `https://wa.me/212725759434?text=${msg}`;
    window.open(url, '_blank');
    
    showToast('✅ تم إرسال طلبك بنجاح! سنتواصل معك قريبًا');
    
    setTimeout(() => {
        resetForm();
    }, 3000);
}

// إعادة تعيين النموذج
function resetForm() {
    selectedGender = null;
    selectedSize = null;
    selectedQuantity = null;
    perfumeNames = [];
    
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'none';
    document.getElementById('step5').style.display = 'none';
    
    document.getElementById('perfumeSingleImageContainer').style.display = 'none';
    
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.form-group input').forEach(inp => inp.value = '');
    document.getElementById('perfumeInputs').innerHTML = '';
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── BURGER MENU ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobileNav');
    
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        mobileNav.classList.toggle('open');
    });
    
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            mobileNav.classList.remove('open');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});