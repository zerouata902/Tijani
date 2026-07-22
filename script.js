/* ============================================================
   TIJANI PARFUMES — script.js
   ============================================================ */

// ── STATE ─────────────────────────────────────────────────────
let selectedGender = null;
let selectedSize = null;
let selectedQuantity = null;
let perfumeNames = [];
let currentLanguage = 'ar';

// ── PRICES ────────────────────────────────────────────────────
const prices = {
    '30ml': { 1: 40, 3: 100, 6: 200 },
    '50ml': { 1: 70, 3: 180 }
};

// ── IMAGES ────────────────────────────────────────────────────
const genderImages = {
    'رجال': 'D1.jpg',
    'نساء': 'D2.jpg'
};

// ── LANGUAGE SWITCH ──────────────────────────────────────────
function switchLanguage(lang) {
    currentLanguage = lang;
    
    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // تحديث جميع العناصر التي تحمل data-ar و data-fr
    document.querySelectorAll('[data-ar][data-fr]').forEach(el => {
        el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-fr');
    });
    
    // تحديث placeholders
    document.querySelectorAll('[data-ar-placeholder][data-fr-placeholder]').forEach(el => {
        el.placeholder = lang === 'ar' ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-fr-placeholder');
    });
    
    // تحديث الروابط في الموبايل ناف
    document.querySelectorAll('.mobile-nav a[data-ar][data-fr]').forEach(el => {
        el.textContent = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-fr');
    });
    
    showToast(lang === 'ar' ? '✅ تم التبديل إلى العربية' : '✅ Basculé vers le français');
}

// ── FUNCTIONS ─────────────────────────────────────────────────

// اختيار الجنس
function selectGender(gender) {
    selectedGender = gender;
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    document.querySelectorAll('#step1 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === gender);
    });
    
    showToast(currentLanguage === 'ar' ? '✅ تم اختيار: ' + gender : '✅ Sélectionné: ' + (gender === 'رجال' ? 'Homme' : 'Femme'));
}

// اختيار الحجم
function selectSize(size) {
    selectedSize = size;
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    
    document.querySelectorAll('#step2 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === size);
    });
    
    showToast(currentLanguage === 'ar' ? '✅ تم اختيار: ' + size : '✅ Sélectionné: ' + size);
}

// اختيار العدد
function selectQuantity(qty) {
    selectedQuantity = parseInt(qty);
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'block';
    
    document.querySelectorAll('#step3 .option-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.value === qty);
    });
    
    // عرض صورة الفئة المختارة
    const img = document.getElementById('perfumeSingleImage');
    img.src = genderImages[selectedGender];
    document.getElementById('perfumeSingleImageContainer').style.display = 'flex';
    
    // إظهار الصورة المقترحة حسب الفئة
    document.querySelectorAll('.suggestion-img').forEach(img => img.classList.remove('show'));
    if (selectedGender === 'رجال') {
        document.querySelector('.suggestion-male').classList.add('show');
    } else if (selectedGender === 'نساء') {
        document.querySelector('.suggestion-female').classList.add('show');
    }
    document.getElementById('summerSuggestions').classList.add('active');
    
    // إنشاء خانات الإدخال
    createPerfumeInputs(qty);
    
    // عرض السعر
    let price = 0;
    if (selectedSize && prices[selectedSize] && prices[selectedSize][selectedQuantity]) {
        price = prices[selectedSize][selectedQuantity];
    } else if (selectedQuantity === 6) {
        price = 200;
    }
    
    const msg = currentLanguage === 'ar' ? 
        '✅ تم اختيار: ' + qty + ' عطر - السعر: ' + price + ' درهم' :
        '✅ Sélectionné: ' + qty + ' parfums - Prix: ' + price + ' DH';
    showToast(msg);
}

// إنشاء خانات إدخال أسماء العطور
function createPerfumeInputs(qty) {
    const container = document.getElementById('perfumeInputs');
    container.innerHTML = '';
    perfumeNames = [];
    
    const placeholder = currentLanguage === 'ar' ? 'أدخل اسم العطر' : 'Entrez le nom du parfum';
    
    for (let i = 0; i < qty; i++) {
        const div = document.createElement('div');
        div.className = 'perfume-input-group';
        div.innerHTML = `
            <span class="perfume-number">${i + 1}</span>
            <input type="text" class="perfume-input" placeholder="${placeholder} ${i + 1}" data-index="${i}" />
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
        showToast(currentLanguage === 'ar' ? '⚠️ الرجاء إدخال أسماء جميع العطور' : '⚠️ Veuillez entrer tous les noms des parfums');
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
        document.getElementById('summerSuggestions').classList.remove('active');
        document.querySelectorAll('.suggestion-img').forEach(img => img.classList.remove('show'));
    } else if (step === 'step5') {
        document.getElementById('step5').style.display = 'none';
        document.getElementById('step4').style.display = 'block';
        createPerfumeInputs(selectedQuantity);
    }
}

// تحديث الملخص
function updateSummary() {
    const genderMap = { 'رجال': currentLanguage === 'ar' ? '👤 رجال' : '👤 Homme', 'نساء': currentLanguage === 'ar' ? '👩 نساء' : '👩 Femme' };
    document.getElementById('summaryGender').textContent = genderMap[selectedGender] || '-';
    document.getElementById('summarySize').textContent = selectedSize || '-';
    
    const qtyText = currentLanguage === 'ar' ? selectedQuantity + ' عطر' : selectedQuantity + ' parfum' + (selectedQuantity > 1 ? 's' : '');
    document.getElementById('summaryQuantity').textContent = selectedQuantity ? qtyText : '-';
    document.getElementById('summaryPerfumes').textContent = perfumeNames.length ? perfumeNames.join('، ') : '-';
    
    let price = 0;
    if (selectedSize && prices[selectedSize] && prices[selectedSize][selectedQuantity]) {
        price = prices[selectedSize][selectedQuantity];
    } else if (selectedQuantity === 6) {
        price = 200;
    }
    document.getElementById('summaryPrice').textContent = price ? price + (currentLanguage === 'ar' ? ' درهم' : ' DH') : '-';
}

// إرسال الطلب عبر واتساب
function sendOrder() {
    const name = document.getElementById('clientName').value.trim();
    const city = document.getElementById('clientCity').value.trim();
    const address = document.getElementById('clientAddress').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    
    if (!name || !city || !address || !phone) {
        showToast(currentLanguage === 'ar' ? '⚠️ الرجاء ملء جميع الحقول' : '⚠️ Veuillez remplir tous les champs');
        return;
    }
    
    if (!selectedGender || !selectedSize || !selectedQuantity) {
        showToast(currentLanguage === 'ar' ? '⚠️ الرجاء اختيار جميع الخيارات' : '⚠️ Veuillez sélectionner toutes les options');
        return;
    }
    
    let price = 0;
    if (selectedSize && prices[selectedSize] && prices[selectedSize][selectedQuantity]) {
        price = prices[selectedSize][selectedQuantity];
    } else if (selectedQuantity === 6) {
        price = 200;
    }
    
    const genderMap = { 'رجال': currentLanguage === 'ar' ? 'رجال' : 'Homme', 'نساء': currentLanguage === 'ar' ? 'نساء' : 'Femme' };
    const perfumesList = perfumeNames.join('، ');
    
    const msg = `🛍️ *${currentLanguage === 'ar' ? 'طلب جديد من TIJANI PARFUMES' : 'Nouvelle commande de TIJANI PARFUMES'}*%0A%0A` +
        `${currentLanguage === 'ar' ? '👤 الاسم' : '👤 Nom'}: ${name}%0A` +
        `${currentLanguage === 'ar' ? '📍 المدينة' : '📍 Ville'}: ${city}%0A` +
        `${currentLanguage === 'ar' ? '🏠 العنوان' : '🏠 Adresse'}: ${address}%0A` +
        `${currentLanguage === 'ar' ? '📱 الهاتف' : '📱 Téléphone'}: ${phone}%0A%0A` +
        `📦 *${currentLanguage === 'ar' ? 'تفاصيل الطلب' : 'Détails de la commande'}:*%0A` +
        `${currentLanguage === 'ar' ? '👤 الفئة' : '👤 Catégorie'}: ${genderMap[selectedGender]}%0A` +
        `${currentLanguage === 'ar' ? '📏 الحجم' : '📏 Taille'}: ${selectedSize}%0A` +
        `${currentLanguage === 'ar' ? '🔢 العدد' : '🔢 Quantité'}: ${selectedQuantity} ${currentLanguage === 'ar' ? 'عطر' : 'parfum' + (selectedQuantity > 1 ? 's' : '')}%0A` +
        `${currentLanguage === 'ar' ? '🌸 العطور' : '🌸 Parfums'}: ${perfumesList}%0A` +
        `${currentLanguage === 'ar' ? '💰 السعر الإجمالي' : '💰 Prix total'}: ${price} ${currentLanguage === 'ar' ? 'درهم' : 'DH'}`;
    
    const url = `https://wa.me/212725759434?text=${msg}`;
    window.open(url, '_blank');
    
    showToast(currentLanguage === 'ar' ? '✅ تم إرسال طلبك بنجاح! سنتواصل معك قريبًا' : '✅ Commande envoyée avec succès! Nous vous contacterons bientôt');
    
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
    document.getElementById('summerSuggestions').classList.remove('active');
    document.querySelectorAll('.suggestion-img').forEach(img => img.classList.remove('show'));
    
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