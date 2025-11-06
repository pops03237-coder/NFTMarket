// Функция обновления страницы
function refreshPage() {
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        window.location.reload();
    }, 300);
}

// Firebase конфигурация
const firebaseConfig = {
    apiKey: "AIzaSyBY1T2iXvoUmS6H6wLuJdoZ9U5EAD_kLNc",
    authDomain: "starsshopweb.firebaseapp.com",
    projectId: "starsshopweb",
    storageBucket: "starsshopweb.firebasestorage.app",
    messagingSenderId: "893946651537",
    appId: "1:893946651537:web:15d40434f754bd57c27030",
    measurementId: "G-VFJQ7DNN6F"
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const analytics = firebase.analytics();

// Функции для модальных окон
function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function openCreateModal() {
    document.getElementById('createModal').style.display = 'block';
}

function closeCreateModal() {
    document.getElementById('createModal').style.display = 'none';
}

// Функции кошелька
function connectWallet() {
    showMessage('Подключение кошелька...', 'info');
    // Здесь будет интеграция с MetaMask/Phantom
    setTimeout(() => {
        showMessage('Кошелек успешно подключен!', 'success');
    }, 2000);
}

function exploreNFTs() {
    document.getElementById('featured').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Функция создания NFT
function createNFT() {
    const name = document.getElementById('nftName').value;
    const description = document.getElementById('nftDescription').value;
    const price = document.getElementById('nftPrice').value;
    const category = document.getElementById('nftCategory').value;
    
    if (!name || !description || !price || !category) {
        showMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    showMessage('NFT создается...', 'info');
    
    setTimeout(() => {
        closeCreateModal();
        showMessage('NFT успешно создано!', 'success');
        // Очистка формы
        document.getElementById('nftName').value = '';
        document.getElementById('nftDescription').value = '';
        document.getElementById('nftPrice').value = '';
        document.getElementById('nftCategory').value = '';
    }, 3000);
}

// Функции авторизации (остаются как были)
function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            closeAuthModal();
            showMessage('Успешный вход!', 'success');
        })
        .catch((error) => {
            showMessage('Ошибка входа: ' + error.message, 'error');
        });
}

function register() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const name = document.getElementById('registerName').value;
    
    if (!email || !password || !name) {
        showMessage('Пожалуйста, заполните все поля', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Пароль должен быть не менее 6 символов', 'error');
        return;
    }
    
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Регистрация...';
    btn.disabled = true;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({
                displayName: name
            });
        })
        .then(() => {
            closeAuthModal();
            showMessage('Регистрация успешна! Добро пожаловать!', 'success');
        })
        .catch((error) => {
            let message = 'Ошибка регистрации: ';
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    message = 'Этот email уже используется';
                    break;
                case 'auth/invalid-email':
                    message = 'Неверный формат email';
                    break;
                case 'auth/operation-not-allowed':
                    message = 'Регистрация по email отключена';
                    break;
                case 'auth/weak-password':
                    message = 'Пароль слишком простой';
                    break;
                default:
                    message += error.message;
            }
            
            showMessage(message, 'error');
        })
        .finally(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        });
}

function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(() => {
            closeAuthModal();
        })
        .catch((error) => {
            showMessage('Ошибка входа через Google: ' + error.message, 'error');
        });
}

// Функция отображения сообщений
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'error') {
        message.style.background = '#ff4757';
    } else if (type === 'success') {
        message.style.background = '#2ed573';
    } else if (type === 'info') {
        message.style.background = '#3742fa';
    }
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 5000);
}

// Слушатель изменения состояния авторизации
auth.onAuthStateChanged((user) => {
    const navActions = document.getElementById('navActions');
    
    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        navActions.innerHTML = `
            <div class="user-menu">
                <div class="user-avatar">
                    ${displayName.charAt(0).toUpperCase()}
                </div>
                <span class="user-name">${displayName}</span>
                <button class="btn-create" onclick="openCreateModal()">✨ Создать NFT</button>
                <button class="btn-logout" onclick="logout()">Выйти</button>
            </div>
        `;
    } else {
        navActions.innerHTML = `
            <button class="btn-wallet" onclick="connectWallet()">🔗 Подключить кошелек</button>
            <button class="btn-create" onclick="openCreateModal()">✨ Создать NFT</button>
            <button class="btn-login" onclick="openAuthModal()">Войти</button>
        `;
    }
});

function logout() {
    auth.signOut();
    showMessage('Вы вышли из системы', 'info');
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для вкладок
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Обработчики для фильтров
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Закрытие модальных окон
    window.onclick = function(event) {
        if (event.target === document.getElementById('authModal')) {
            closeAuthModal();
        }
        if (event.target === document.getElementById('createModal')) {
            closeCreateModal();
        }
    }

    // Загрузка изображения
    const uploadArea = document.getElementById('uploadArea');
    const nftImage = document.getElementById('nftImage');
    
    uploadArea.addEventListener('click', () => {
        nftImage.click();
    });
    
    nftImage.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            uploadArea.innerHTML = `
                <div class="upload-icon">✅</div>
                <p>Изображение загружено: ${e.target.files[0].name}</p>
            `;
        }
    });
});

// Анимация для сообщений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
