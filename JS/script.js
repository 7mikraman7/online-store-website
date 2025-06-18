// Функція для обновления цены
function updatePrice(radio) {
    // Найти родительский элемент продукта
    const product = radio.closest('.smartphones-product');
    // Найти элементы цены
    const priceElement = product.querySelector('.price');
    const oldPriceElement = product.querySelector('del');
    const addToCartButton = product.querySelector('.add-to-cart-btn');

    // Обновить цену
    priceElement.textContent = radio.value;

    // Рассчитать старую цену (например, +10% от текущей)
    const newOldPrice = (parseFloat(radio.value.replace(/[^\d.]/g, '')) * 1.1).toFixed(3) + ' ₴';
    oldPriceElement.textContent = newOldPrice;

    // Обновить данные кнопки "Додати до кошика"
    addToCartButton.dataset.price = parseFloat(radio.value.replace(/[^\d.]/g, '')); // Обновляем цену
    addToCartButton.dataset.memory = radio.nextElementSibling.textContent.trim(); // Добавляем память
}

// ---------------------------------------------

// Получение корзины из localStorage
function getCart() {
    // Зчитування кошика з localStorage та розпарсування JSON-рядка у масив
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Сохранение корзины в localStorage
function saveCart(cart) {
    // Серіалізація масиву кошика у JSON-рядок та збереження у localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Добавление товара в корзину
function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find(item =>
        item.id === product.id &&
        (!product.memory || item.memory === product.memory)
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
}

// Обработчик для кнопок "Додати до кошика"
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = this.getAttribute('data-price');
        const productImage = this.getAttribute('data-image');

        // Створюємо об'єкт товару
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        };

        // Передаємо товар у кошик (можна зберігати в localStorage або надсилати на сервер)
        console.log('Товар додано до кошика:', product);
        alert(`Товар "${productName}" додано до кошика за ціною ${productPrice} ₴`);
    });
});


// ----------------------------------------------

// Память для телефона

// Функція для оновлення ціни при виборі обсягу пам'яті смартфона
function updatePrice(radio) {
    // Знаходимо батьківський елемент продукту
    const product = radio.closest('.smartphones-product');
    // Знаходимо елементи ціни
    const priceElement = product.querySelector('.price');
    const oldPriceElement = product.querySelector('del');
    const addToCartButton = product.querySelector('.add-to-cart-btn');

    // Оновлюємо ціну
    priceElement.textContent = radio.value;

    // Розраховуємо стару ціну (+10% від поточної)
    const newOldPrice = (parseFloat(radio.value.replace(/[^\d.]/g, '')) * 1.1).toFixed(3) + ' ₴';
    oldPriceElement.textContent = newOldPrice;

    // Оновлюємо дані кнопки "Додати до кошика"
    addToCartButton.dataset.price = parseFloat(radio.value.replace(/[^\d.]/g, ''));
    addToCartButton.dataset.memory = radio.nextElementSibling.textContent.trim();
}

// --- Робота з кошиком ---
// Отримати кошик з localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Зберегти кошик у localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Додати товар у кошик
function addToCart(product) {
    const cart = getCart();
    // Перевіряємо, чи вже є такий товар (з урахуванням пам'яті)
    const existingProduct = cart.find(item =>
        item.id === product.id &&
        (!product.memory || item.memory === product.memory)
    );

    if (existingProduct) {
        existingProduct.quantity += 1; // Збільшуємо кількість
    } else {
        cart.push({ ...product, quantity: 1 }); // Додаємо новий товар
    }

    saveCart(cart); // Зберігаємо кошик
}

// --- Обробник для кнопок "Додати до кошика" (старий варіант, можна видалити якщо не використовується) ---
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
        const productId = this.getAttribute('data-id');
        const productName = this.getAttribute('data-name');
        const productPrice = this.getAttribute('data-price');
        const productImage = this.getAttribute('data-image');

        // Створюємо об'єкт товару
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        };

        // Додаємо товар у кошик (можна зберігати в localStorage або надсилати на сервер)
        console.log('Товар додано до кошика:', product);
        alert(`Товар "${productName}" додано до кошика за ціною ${productPrice} ₴`);
    });
});

// --- Оновлена логіка додавання товару у кошик ---
document.addEventListener('DOMContentLoaded', () => {
    // Для кожної кнопки "Додати до кошика"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.smartphones-product');
            const selectedMemory = productElement.querySelector('input[type="radio"]:checked');
            const priceElement = productElement.querySelector('.price');

            // Перевірка вибору пам'яті
            if (!selectedMemory) {
                alert('Будь ласка, виберіть обсяг пам\'яті перед додаванням до кошика!');
                return;
            }

            // Формуємо об'єкт товару
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: Number(parseFloat(priceElement.textContent.replace(/[^\d.]/g, '')).toFixed(3)),
                memory: selectedMemory.value,
                image: button.dataset.image
            };

            addToCart(product); // Додаємо у кошик

            // Візуальний фідбек
            button.textContent = 'Додано!';
            button.disabled = true;
        });
    });

    // Обробник кнопки "Кошик" (перехід на сторінку кошика)
    const cartButton = document.querySelector('.cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Ваша корзина порожня! Додайте товари, щоб продовжити.');
                return;
            }
            window.location.href = 'basket.html';
        });
    }
});

// --- Відображення товарів у кошику ---
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Кошик порожній</p>';
        return;
    }

    // Відображаємо кожен товар у кошику
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <p class="item-title">${item.name} <span style="font-size:12px;color:#888;">(${item.memory})</span></p>
                <p class="item-price">${Number(item.price).toFixed(3)} ₴</p>
                <p class="item-quantity">Кількість: ${item.quantity}</p>
                <button class="delete-btn" data-id="${item.id}" data-memory="${item.memory}">Видалити</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Обробник кнопки "Видалити"
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            removeFromCart(button.dataset.id, button.dataset.memory);
        });
    });
}

// --- Видалення товару з кошика (з урахуванням пам'яті) ---
function removeFromCart(id, memory) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === id && item.memory === memory));
    saveCart(cart);
    displayCart();
}

// Відображаємо кошик при завантаженні сторінки
document.addEventListener('DOMContentLoaded', displayCart);

// --- Оновлення підсумку кошика (загальна сума, знижка, фінальна сума) ---
function updateCartSummary() {
    try {
        const cart = getCart();
        if (!Array.isArray(cart)) {
            console.error('Некоректні дані кошика:', cart);
            return;
        }

        let totalItems = 0;
        let totalPrice = 0;

        cart.forEach(item => {
            // Перетворюємо ціну і кількість у числа
            const itemPrice = parseFloat(
                (typeof item.price === 'string')
                    ? item.price.replace(/[^\d.]/g, '')
                    : item.price
            );
            const itemQuantity = parseInt(item.quantity, 10);

            if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
                totalItems += itemQuantity;
                totalPrice += itemPrice * itemQuantity;
            }
        });

        totalPrice = Math.round(totalPrice * 1000) / 1000;
        const discount = Math.round((totalPrice * 0.1) * 1000) / 1000; // 10% знижка
        const finalPrice = Math.round((totalPrice - discount) * 1000) / 1000;

        // Оновлюємо елементи на сторінці
        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');
        const discountElement = document.getElementById('discount');
        const finalPriceElement = document.getElementById('final-price');

        if (totalItemsElement) totalItemsElement.textContent = totalItems;
        if (totalPriceElement) totalPriceElement.textContent = `${totalPrice.toFixed(3)} ₴`;
        if (discountElement) discountElement.textContent = `${discount.toFixed(3)} ₴`;
        if (finalPriceElement) finalPriceElement.textContent = `${finalPrice.toFixed(3)} ₴`;
    } catch (error) {
        console.error('Помилка при оновленні підсумку кошика:', error);
    }
}

// Оновлюємо підсумок кошика при завантаженні сторінки
document.addEventListener('DOMContentLoaded', updateCartSummary);

// --- Виїжджаючий блок справа для 404.html ---
document.addEventListener('DOMContentLoaded', function() {
    const notice = document.getElementById('side-notice');
    if (notice) {
        notice.classList.add('show');
    }
});

// --- Показ результату входу без перезавантаження сторінки ---
document.addEventListener('DOMContentLoaded', function() {
    const result = document.getElementById('login-result');
    document.body.addEventListener('submit', function(e) {
        if (e.target && e.target.id === 'register-form') {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const actionUrl = form.getAttribute('action');
            fetch(actionUrl, {
            method: 'POST', // Відправляємо дані методом POST
            body: formData  // Передаємо дані форми (логін, пароль тощо)
            })               
            .then(response => response.text())
            .then(data => {
                try {
                    // Парсинг відповіді сервера у форматі JSON
                    const json = JSON.parse(data);
                    if (json.redirect) {
                        // Зберігаємо логін у localStorage
                        localStorage.setItem('userLogin', formData.get('login'));
                        window.location.href = json.redirect;
                        return;
                    }
                } catch (e) {
                    // Якщо не JSON, показуємо як HTML
                }
                if (result) {
                    result.innerHTML = data;
                }
            })
            .catch(error => {
                if (result) {
                    result.innerHTML = 'Сталася помилка!';
                }
            });
        }
    });
});

// --- Блок авторизації: показ логіна або кнопки "Увійти" ---
document.addEventListener('DOMContentLoaded', function() {
    const loginBlock = document.querySelector('.login-block');
    if (loginBlock) {
        const userLogin = localStorage.getItem('userLogin');
        if (userLogin) {
            // Якщо користувач увійшов — показуємо логін і кнопку "Вийти"
            loginBlock.innerHTML = `
                <div class="login-avatar">?</div>
                <div class="login-info">
                    <span class="login-user">${userLogin}</span>
                    <button id="logout-btn">Вийти</button>
                </div>
            `;
            const logoutBtn = document.getElementById('logout-btn');
            logoutBtn.addEventListener('click', function() {
                localStorage.removeItem('userLogin');
                location.reload();
            });
        } else {
            // Якщо не увійшов — показуємо кнопку "Увійти"
            loginBlock.innerHTML = `
                <button class="login-button" onclick="location.href='login.html';">Увійти</button>
            `;
        }
    }
});