const productList = [
  { id: '1', name: 'Tapete Redondo em Crochê', price: 40 },
  { id: '2', name: 'Bolsa em Crochê', price: 40 },
  { id: '3', name: 'Carteira de mão em Crochê', price: 40 },
  { id: '4', name: 'Tapete Retangular em Crochê', price: 40 },
  { id: '5', name: 'Caminho de Mesa em Crochê', price: 40 },
  { id: '6', name: 'Vestido Longo em Crochê', price: 40 },
  { id: '7', name: 'Porta copo em Crochê', price: 40 },
  { id: '8', name: 'Sousplat Tradicional em Crochê', price: 40 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function updateQuantity(id, newQuantity) {
  if (newQuantity < 1) {
    cart = cart.filter(pid => pid !== id);
  } else {
    cart = cart.filter(pid => pid !== id);
    for (let i = 0; i < newQuantity; i++) {
      cart.push(id);
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartContainer.innerHTML = '';

  const cartMap = {};
  cart.forEach(id => {
    cartMap[id] = (cartMap[id] || 0) + 1;
  });

  let total = 0;

  for (const id in cartMap) {
    const product = productList.find(p => p.id === id);
    if (!product) continue;

    const quantity = cartMap[id];
    const subtotal = product.price * quantity;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${product.name}</td>
      <td><input type="number" min="1" class="quantity-input" data-id="${id}" value="${quantity}"></td>
      <td>R$ ${product.price.toFixed(2).replace('.', ',')}</td>
      <td>R$ ${subtotal.toFixed(2).replace('.', ',')}</td>
      <td><button class="btn btn-danger btn-sm remove-btn" data-id="${id}">Remover</button></td>
    `;
    cartContainer.appendChild(tr);
  }

  cartTotal.textContent = total.toFixed(2).replace('.', ',');

  // Os event listeners dos inputs e botões devem ser adicionados aqui:
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', e => {
      const id = e.target.dataset.id;
      let quantity = parseInt(e.target.value);
      if (isNaN(quantity) || quantity < 1) quantity = 1;
      e.target.value = quantity;
      updateQuantity(id, quantity);
    });
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', e => {
      const id = e.target.dataset.id;
      updateQuantity(id, 0);
    });
  });
}

// Aqui registramos os event listeners fixos fora da renderização
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartCount();

  document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    updateCartCount();
  });

  document.getElementById('checkout').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const cartMap = {};
    cart.forEach(id => {
      cartMap[id] = (cartMap[id] || 0) + 1;
    });

    let message = 'Olá! Gostaria de finalizar a seguinte compra:%0A%0A';
    let total = 0;

    for (const id in cartMap) {
      const product = productList.find(p => p.id === id);
      if (!product) continue;

      const quantity = cartMap[id];
      const subtotal = product.price * quantity;
      total += subtotal;

      message += `- ${product.name} - ${quantity} unidade${quantity > 1 ? 's' : ''} (R$ ${product.price.toFixed(2).replace('.', ',')}) = R$ ${subtotal.toFixed(2).replace('.', ',')}%0A`;
    }

    message += `%0ATotal: R$ ${total.toFixed(2).replace('.', ',')}%0A%0APor favor, aguardo a confirmação do pedido.%0AObrigado!`;

    const phone = '5584998354251'; // seu telefone aqui
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    cart = [];
    localStorage.removeItem('cart');
    renderCart();
    updateCartCount();
  });
});
