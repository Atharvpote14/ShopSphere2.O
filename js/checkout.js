const $ = (s) => document.querySelector(s)
const $$ = (s) => Array.from(document.querySelectorAll(s))

const state = {
  items: [],
  shipping: 80,
  taxRate: 0.18
}

function currency(v) {
  return `₹${v.toFixed(2)}`
}

function loadCart() {
  const local = JSON.parse(localStorage.getItem('cart') || '[]')
  state.items = local.map(i => ({
    id: i.id,
    title: i.title || 'Item',
    price: i.price || 0,
    image: i.image || '',
    quantity: i.quantity || 1
  }))
}

function renderSummary() {
  const itemsEl = $('#summaryItems')
  if (state.items.length === 0) {
    itemsEl.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--ck-muted);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🛒</div>
        <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">Your cart is empty</div>
        <div style="font-size: 0.9rem;">Add some items to proceed with checkout</div>
        <button onclick="window.location.href='index.html'" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--ck-primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
          Continue Shopping
        </button>
      </div>
    `
    $('#subtotal').textContent = currency(0)
    $('#shipping').textContent = currency(0)
    $('#tax').textContent = currency(0)
    $('#total').textContent = currency(0)
    $('#placeOrderBtn').disabled = true
    $('#placeOrderBtn').style.opacity = '0.5'
    return
  }
  
  itemsEl.innerHTML = state.items.map(i => `
    <div class="summary-item">
      <img src="${i.image}" alt="${i.title}">
      <div class="summary-meta">
        <div>${i.title}</div>
        <div class="summary-price">${currency(i.price)} × ${i.quantity}</div>
      </div>
      <div>${currency(i.price * i.quantity)}</div>
    </div>
  `).join('')
  const subtotal = state.items.reduce((s,i)=>s+i.price*i.quantity,0)
  const tax = Math.round((subtotal * state.taxRate) * 100) / 100
  $('#subtotal').textContent = currency(subtotal)
  $('#shipping').textContent = currency(state.shipping)
  $('#tax').textContent = currency(tax)
  $('#total').textContent = currency(subtotal + state.shipping + tax)
  $('#placeOrderBtn').disabled = false
  $('#placeOrderBtn').style.opacity = '1'
}

function bindShipping() {
  $$('input[name="ship"]').forEach(r => {
    r.addEventListener('change', () => {
      state.shipping = r.value === 'express' ? 180 : 80
      renderSummary()
    })
  })
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
function validatePhone(v) {
  return /^[0-9]{10}$/.test(v.replace(/\D/g,''))
}
function validateNotEmpty(v) {
  return v.trim().length > 1
}
function validateZip(v) {
  return /^[0-9]{5,6}$/.test(v)
}
function validateCard(v) {
  const n = v.replace(/\s/g,'')
  return /^[0-9]{12,19}$/.test(n)
}
function validateExpiry(v) {
  const m = v.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const mm = parseInt(m[1],10)
  const yy = parseInt(m[2],10)
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  const y = now.getFullYear() % 100
  const mo = now.getMonth() + 1
  if (yy < y) return false
  if (yy === y && mm < mo) return false
  return true
}
function validateCVV(v) {
  return /^[0-9]{3,4}$/.test(v)
}

function setError(id, ok, msg) {
  const el = $(`#${id}Error`)
  const input = $(`#${id}`)
  
  if (ok) {
    el.textContent = ''
    el.classList.remove('show')
    input.classList.remove('error')
    input.classList.add('success')
  } else {
    el.textContent = msg
    el.classList.add('show')
    input.classList.add('error')
    input.classList.remove('success')
  }
}

function updateProgress() {
  const contactDone = validateEmail($('#email').value) && validatePhone($('#phone').value)
  const shippingDone = validateNotEmpty($('#firstName').value) && validateNotEmpty($('#address1').value) && validateZip($('#zip').value)
  const paymentDone = allValid()
  
  // Update progress steps
  const progressContact = $('#progress-contact')
  const progressShipping = $('#progress-shipping')
  const progressPayment = $('#progress-payment')
  const progressReview = $('#progress-review')
  
  // Reset all steps
  [progressContact, progressShipping, progressPayment, progressReview].forEach(step => {
    step.classList.remove('active', 'completed')
  })
  
  // Set completed and active states
  if (contactDone) {
    progressContact.classList.add('completed')
    progressShipping.classList.add('active')
  } else {
    progressContact.classList.add('active')
  }
  
  if (shippingDone) {
    progressShipping.classList.add('completed')
    progressPayment.classList.add('active')
  }
  
  if (paymentDone) {
    progressPayment.classList.add('completed')
    progressReview.classList.add('active')
  }
}

function bindValidation() {
  const validateAndUpdate = (id, validator, errorMsg) => {
    const input = $(`#${id}`)
    input.addEventListener('input', e => {
      setError(id, validator(e.target.value), errorMsg)
      updateProgress()
    })
    input.addEventListener('change', e => {
      setError(id, validator(e.target.value), errorMsg)
      updateProgress()
    })
  }
  
  validateAndUpdate('email', validateEmail, 'Enter a valid email')
  validateAndUpdate('phone', validatePhone, 'Enter a valid phone')
  validateAndUpdate('firstName', validateNotEmpty, 'Required')
  validateAndUpdate('lastName', validateNotEmpty, 'Required')
  validateAndUpdate('address1', validateNotEmpty, 'Required')
  validateAndUpdate('city', validateNotEmpty, 'Required')
  
  $('#state').addEventListener('change', e => {
    setError('state', validateNotEmpty(e.target.value), 'Select a state')
    updateProgress()
  })
  
  validateAndUpdate('zip', validateZip, 'Enter a valid code')
  validateAndUpdate('cardName', validateNotEmpty, 'Required')
  
  $('#cardNumber').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()
    setError('cardNumber', validateCard(e.target.value), 'Enter a valid card')
    updateProgress()
  })
  
  $('#expiry').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').replace(/(\d{2})(\d{0,2}).*/,'$1/$2')
    setError('expiry', validateExpiry(e.target.value), 'MM/YY')
    updateProgress()
  })
  
  $('#cvv').addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,4)
    setError('cvv', validateCVV(e.target.value), '3–4 digits')
    updateProgress()
  })
}

function allValid() {
  const checks = [
    validateEmail($('#email').value),
    validatePhone($('#phone').value),
    validateNotEmpty($('#firstName').value),
    validateNotEmpty($('#lastName').value),
    validateNotEmpty($('#address1').value),
    validateNotEmpty($('#city').value),
    validateNotEmpty($('#state').value),
    validateZip($('#zip').value),
    validateNotEmpty($('#cardName').value),
    validateCard($('#cardNumber').value),
    validateExpiry($('#expiry').value),
    validateCVV($('#cvv').value)
  ]
  return checks.every(Boolean)
}

function stepBadges() {
  updateProgress()
}

function bindPlaceOrder() {
  $('#placeOrderBtn').addEventListener('click', () => {
    stepBadges()
    
    // Get all validation errors
    const errors = validateAllFields()
    
    if (errors.length > 0) {
      const orderStatus = $('#orderStatus')
      orderStatus.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid #ef4444; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
          <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h4 style="margin: 0 0 0 0.75rem; color: #ef4444; font-size: 1.1rem;">Please correct the following:</h4>
          </div>
          <ul style="margin: 0; padding-left: 1.5rem; color: #dc2626; line-height: 1.6;">
            ${errors.map(error => `<li style="margin-bottom: 0.25rem;">${error}</li>`).join('')}
          </ul>
        </div>
      `
      orderStatus.className = 'order-status error'
      
      // Scroll to first error field
      if (errors[0]) {
        const fieldName = errors[0].toLowerCase().split(' ')[0]
        const field = document.getElementById(fieldName === 'email' ? 'email' : 
                                                  fieldName === 'phone' ? 'phone' :
                                                  fieldName === 'first' ? 'firstName' :
                                                  fieldName === 'last' ? 'lastName' :
                                                  fieldName === 'address' ? 'address1' :
                                                  fieldName === 'city' ? 'city' :
                                                  fieldName === 'state' ? 'state' :
                                                  fieldName === 'postal' ? 'zip' :
                                                  fieldName === 'card' ? 'cardName' :
                                                  fieldName === 'card' ? 'cardNumber' :
                                                  fieldName === 'expiry' ? 'expiry' :
                                                  fieldName === 'cvv' ? 'cvv' : '')
        if (field) {
          field.focus()
          field.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }
    
    const btn = $('#placeOrderBtn')
    const orderStatus = $('#orderStatus')
    
    // Show loading state
    btn.classList.add('loading')
    btn.textContent = ''
    orderStatus.innerHTML = `
      <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
        <div style="display: flex; align-items: center;">
          <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <h4 style="margin: 0 0 0 0.75rem; color: #3b82f6; font-size: 1.1rem;">Processing your order...</h4>
        </div>
      </div>
    `
    orderStatus.className = 'order-status'
    
    // Simulate order validation and processing
    setTimeout(() => {
      orderStatus.innerHTML = `
        <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
          <div style="display: flex; align-items: center;">
            <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <h4 style="margin: 0 0 0 0.75rem; color: #3b82f6; font-size: 1.1rem;">Validating payment details...</h4>
          </div>
        </div>
      `
      
      setTimeout(() => {
        orderStatus.innerHTML = `
          <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid #3b82f6; border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
            <div style="display: flex; align-items: center;">
              <div class="loading-spinner" style="width: 24px; height: 24px; border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              <h4 style="margin: 0 0 0 0.75rem; color: #3b82f6; font-size: 1.1rem;">Finalizing order...</h4>
            </div>
          </div>
        `
        
        setTimeout(() => {
          // Success - Order placed
          btn.classList.remove('loading')
          btn.textContent = '✓ Order Placed Successfully'
          btn.style.background = 'linear-gradient(135deg, #10b981, #059669)'
          
          // Show comprehensive order confirmation
          showOrderConfirmation()
          
          // Clear cart after successful order
          localStorage.removeItem('cart')
          
          // Redirect to home page after 5 seconds
          setTimeout(() => {
            window.location.href = 'index.html'
          }, 5000)
        }, 800)
      }, 800)
    }, 800)
  })
}

function validateAllFields() {
  const errors = []
  
  // Validate contact information
  const email = $('#email').value.trim()
  const phone = $('#phone').value.trim()
  
  if (!email) {
    errors.push('Email address is required')
  } else if (!validateEmail(email)) {
    errors.push('Please enter a valid email address')
  }
  
  if (!phone) {
    errors.push('Phone number is required')
  } else if (!validatePhone(phone)) {
    errors.push('Please enter a valid phone number')
  }
  
  // Validate shipping information
  const firstName = $('#firstName').value.trim()
  const lastName = $('#lastName').value.trim()
  const address1 = $('#address1').value.trim()
  const city = $('#city').value.trim()
  const state = $('#state').value
  const zip = $('#zip').value.trim()
  
  if (!firstName) {
    errors.push('First name is required')
  } else if (!validateNotEmpty(firstName)) {
    errors.push('First name cannot be empty')
  }
  
  if (!lastName) {
    errors.push('Last name is required')
  } else if (!validateNotEmpty(lastName)) {
    errors.push('Last name cannot be empty')
  }
  
  if (!address1) {
    errors.push('Address line 1 is required')
  } else if (!validateNotEmpty(address1)) {
    errors.push('Address cannot be empty')
  }
  
  if (!city) {
    errors.push('City is required')
  } else if (!validateNotEmpty(city)) {
    errors.push('City cannot be empty')
  }
  
  if (!state) {
    errors.push('Please select a state')
  }
  
  if (!zip) {
    errors.push('Postal code is required')
  } else if (!validateZip(zip)) {
    errors.push('Please enter a valid postal code')
  }
  
  // Validate payment information
  const cardName = $('#cardName').value.trim()
  const cardNumber = $('#cardNumber').value.replace(/\s/g, '')
  const expiry = $('#expiry').value.trim()
  const cvv = $('#cvv').value.trim()
  
  if (!cardName) {
    errors.push('Name on card is required')
  } else if (!validateNotEmpty(cardName)) {
    errors.push('Card name cannot be empty')
  }
  
  if (!cardNumber) {
    errors.push('Card number is required')
  } else if (!validateCard(cardNumber)) {
    errors.push('Please enter a valid card number')
  }
  
  if (!expiry) {
    errors.push('Expiry date is required')
  } else if (!validateExpiry(expiry)) {
    errors.push('Please enter a valid expiry date (MM/YY)')
  }
  
  if (!cvv) {
    errors.push('CVV is required')
  } else if (!validateCVV(cvv)) {
    errors.push('Please enter a valid CVV (3-4 digits)')
  }
  
  return errors
}

function showOrderConfirmation() {
  const orderStatus = $('#orderStatus')
  const orderNumber = generateOrderNumber()
  const orderDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  })
  
  orderStatus.innerHTML = `
    <div style="background: rgba(16, 185, 129, 0.1); border: 2px solid var(--ck-success); border-radius: 12px; padding: 1.5rem; margin-top: 1rem;">
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="width: 60px; height: 60px; background: var(--ck-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </div>
        <h3 style="color: var(--ck-success); margin: 0; font-size: 1.25rem; font-weight: 700;">Order Confirmed!</h3>
        <p style="color: var(--ck-text); margin: 0.5rem 0; font-size: 0.95rem;">Thank you for your purchase</p>
      </div>
      
      <div style="background: var(--ck-bg); border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--ck-muted); font-size: 0.9rem;">Order Number:</span>
          <span style="font-weight: 600; color: var(--ck-text);">${orderNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--ck-muted); font-size: 0.9rem;">Order Date:</span>
          <span style="font-weight: 600; color: var(--ck-text);">${orderDate}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--ck-muted); font-size: 0.9rem;">Estimated Delivery:</span>
          <span style="font-weight: 600; color: var(--ck-success);">${estimatedDelivery}</span>
        </div>
      </div>
      
      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 8px; padding: 1rem;">
        <h4 style="margin: 0 0 0.5rem 0; color: var(--ck-primary); font-size: 0.95rem;">What's Next?</h4>
        <ul style="margin: 0; padding-left: 1.5rem; color: var(--ck-text); font-size: 0.9rem; line-height: 1.6;">
          <li style="margin-bottom: 0.25rem;">Order confirmation sent to your email</li>
          <li style="margin-bottom: 0.25rem;">Track your order with order number: <strong>${orderNumber}</strong></li>
          <li style="margin-bottom: 0.25rem;">Delivery within 3-5 business days</li>
          <li>24/7 customer support available</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 1rem;">
        <p style="color: var(--ck-muted); font-size: 0.85rem; margin: 0;">
          Redirecting to homepage in <span id="countdown">5</span> seconds...
        </p>
      </div>
    </div>
  `
  
  orderStatus.className = 'order-status success'
  
  // Start countdown
  let countdown = 5
  const countdownInterval = setInterval(() => {
    countdown--
    const countdownEl = document.getElementById('countdown')
    if (countdownEl) {
      countdownEl.textContent = countdown
    }
    
    if (countdown <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

function generateOrderNumber() {
  const prefix = 'SS'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${prefix}-${timestamp}-${random}`
}

function init() {
  loadCart()
  renderSummary()
  bindShipping()
  bindValidation()
  stepBadges()
  bindPlaceOrder()
}

document.addEventListener('DOMContentLoaded', init)
