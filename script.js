'use strict';

const CONFIG = {
  businessEmail: '', // Add a real reservations inbox to enable email enquiries.
  currency: 'USD'
};

const cars = [
  { name: 'BMW 230i xDrive', category: 'Coupe', price: 40, image: 'car-2.png', seats: 4, transmission: 'Automatic', locations: ['Athens', 'Thessaloniki'], tag: 'Sporty choice' },
  { name: 'Mercedes-Benz GLC-Class', category: 'SUV', price: 40, image: 'car-3.png', seats: 5, transmission: 'Automatic', locations: ['Athens', 'Crete'], tag: 'Family favourite' },
  { name: 'Genesis G90', category: 'Sedan', price: 90, image: 'car-4.png', seats: 5, transmission: 'Automatic', locations: ['Athens'], tag: 'Premium' },
  { name: 'Toyota Prius', category: 'Sedan', price: 40, image: 'car-5.png', seats: 5, transmission: 'Automatic', locations: ['Thessaloniki', 'Crete'], tag: 'Efficient drive' },
  { name: 'Toyota bZ4X 2025', category: 'Electric', price: 40, image: 'car-6.png', seats: 5, transmission: 'Automatic', locations: ['Athens', 'Crete'], tag: '100% electric' },
  { name: 'Buick Encore G', category: 'SUV', price: 40, image: 'car-7.png', seats: 5, transmission: 'Automatic', locations: ['Thessaloniki'], tag: 'City-ready' },
  { name: 'Hyundai Santa Fe 2025', category: 'SUV', price: 40, image: 'car-8.png', seats: 7, transmission: 'Automatic', locations: ['Athens', 'Crete'], tag: 'Extra space' },
  { name: 'Kia Sorento', category: 'SUV', price: 40, image: 'car-9.png', seats: 7, transmission: 'Automatic', locations: ['Thessaloniki', 'Crete'], tag: 'Road trip ready' },
  { name: 'Tesla Cybertruck', category: 'Electric', price: 80, image: 'car-10.png', seats: 5, transmission: 'Automatic', locations: ['Athens'], tag: 'Electric standout' }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const todayString = () => { const d = new Date(); const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); return `${y}-${m}-${day}`; };
const addDays = (dateString, days) => { const [y, m, d] = dateString.split('-').map(Number); const dt = new Date(y, m - 1, d + days); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`; };
const safe = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let activeFilter = 'all';
let activeLocation = 'all';
let selectedCar = null;
let favoritesOnly = false;
const favorites = new Set();
let searchTerm = '';
const grid = $('#cars-content');

function renderCars() {
  const sortBy = $('#sort-cars').value;
  const filtered = cars.filter(car =>
    (activeFilter === 'all' || car.category === activeFilter) &&
    (activeLocation === 'all' || car.locations.includes(activeLocation)) &&
    (!favoritesOnly || favorites.has(car.name)) &&
    (`${car.name} ${car.category} ${car.locations.join(' ')}`.toLowerCase().includes(searchTerm))
  );
  filtered.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return cars.indexOf(a) - cars.indexOf(b);
  });
  grid.innerHTML = filtered.map((car, i) => {
    const saved = favorites.has(car.name);
    const number = String(cars.indexOf(car) + 1).padStart(2, '0');
    return `
      <article class="car-card" style="--card-order:${i}">
        <div class="car-image-wrap">
          <div class="car-badge-row"><span class="car-tag"><span class="tag-spark">✳</span> ${safe(car.tag)}</span><button type="button" class="car-favorite ${saved ? 'is-saved' : ''}" data-favorite="${cars.indexOf(car)}" aria-label="${saved ? 'Remove' : 'Save'} ${safe(car.name)} ${saved ? 'from' : 'to'} favourites" aria-pressed="${saved}">${saved ? '♥' : '♡'}</button></div>
          <img src="${safe(car.image)}" alt="${safe(car.name)}" loading="lazy" decoding="async">
          <span class="car-image-caption">COLLECTION / ${number}</span><span class="car-image-watermark" aria-hidden="true">VELORA</span>
        </div>
        <div class="car-content">
          <div class="car-meta"><span class="car-category">${safe(car.category)}</span><span class="car-location"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg> ${safe(car.locations[0])}${car.locations.length > 1 ? ` +${car.locations.length - 1}` : ''}</span></div>
          <h3 class="car-title">${safe(car.name)}</h3>
          <div class="car-specs"><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/></svg>${car.seats} seats</span><span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/><path d="M12 3v6m-9 3h6m3 3v6m3-9h6"/></svg>${safe(car.transmission)}</span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 13h7l-1 9 10-13h-7l1-7Z"/></svg>${car.category === 'Electric' ? 'Electric' : 'Instant enquiry'}</span></div>
          <div class="car-bottom"><div class="car-price"><small>STARTING FROM</small><div><strong>$${car.price}</strong><span> / hour</span></div></div><button type="button" class="card-book" data-book="${cars.indexOf(car)}" aria-label="Enquire about ${safe(car.name)}">View & enquire <span aria-hidden="true">↗</span></button></div>
        </div>
      </article>`;
  }).join('');
  grid.querySelectorAll('.car-image-wrap img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.className = 'car-image-placeholder';
      placeholder.textContent = 'Vehicle image coming soon';
      img.parentElement.appendChild(placeholder);
    }, { once: true });
    if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event('error'));
  });
  $('#result-count').textContent = `${filtered.length} vehicle${filtered.length === 1 ? '' : 's'}`;
  $('#favorites-count').textContent = favorites.size;
  $('#fleet-summary').textContent = favoritesOnly ? 'Your saved selection' : activeFilter === 'all' ? 'All available styles' : `${activeFilter} collection`;
  $('#empty-state').hidden = filtered.length > 0;
  $('#empty-state h3').textContent = favoritesOnly && favorites.size === 0 ? 'No saved cars yet.' : 'No cars match your search.';
  $('#empty-state p').textContent = favoritesOnly && favorites.size === 0 ? 'Tap the heart on a car to save it here.' : 'Try another category, location, or search term.';
}

const pickup = $('#pickup-date');
const dropoff = $('#return-date');
const initial = todayString();
pickup.min = initial;
pickup.value = initial;
dropoff.min = addDays(initial, 1);
dropoff.value = addDays(initial, 1);
pickup.addEventListener('change', () => {
  if (!pickup.value) return;
  dropoff.min = addDays(pickup.value, 1);
  if (!dropoff.value || dropoff.value <= pickup.value) dropoff.value = addDays(pickup.value, 1);
});

function dateError(start, end) {
  if (!start || !end) return 'Choose both pick-up and return dates.';
  if (start < todayString()) return 'Pick-up date cannot be in the past.';
  if (end <= start) return 'Return date must be after pick-up.';
  return '';
}

$('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  const error = dateError(pickup.value, dropoff.value);
  $('#search-error').textContent = error;
  if (error) return;
  activeLocation = $('#pickup-location').value;
  renderCars();
  $('#fleet').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

$$('.filter-chip').forEach(chip => chip.addEventListener('click', () => {
  activeFilter = chip.dataset.filter;
  $$('.filter-chip').forEach(item => { const active = item === chip; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  renderCars();
}));
$('#sort-cars').addEventListener('change', renderCars);
$('#car-search').addEventListener('input', event => { searchTerm = event.target.value.trim().toLowerCase(); renderCars(); });
$('#favorites-filter').addEventListener('click', () => {
  favoritesOnly = !favoritesOnly;
  const btn = $('#favorites-filter');
  btn.classList.toggle('active', favoritesOnly);
  btn.setAttribute('aria-pressed', String(favoritesOnly));
  renderCars();
});
$('#clear-filters').addEventListener('click', () => {
  activeFilter = 'all'; activeLocation = 'all'; favoritesOnly = false; searchTerm = ''; $('#pickup-location').value = 'all'; $('#car-search').value = ''; $('#favorites-filter').classList.remove('active'); $('#favorites-filter').setAttribute('aria-pressed', 'false');
  $$('.filter-chip').forEach(chip => { const active = chip.dataset.filter === 'all'; chip.classList.toggle('active', active); chip.setAttribute('aria-pressed', String(active)); });
  renderCars();
});

const dialog = $('#booking-dialog');
const bookingForm = $('#booking-form');
function openBooking(index) {
  selectedCar = cars[index];
  if (!selectedCar) return;
  $('#booking-selected').innerHTML = `<strong>${safe(selectedCar.name)}</strong><span>From $${selectedCar.price} / hour</span>`;
  bookingForm.elements.start.min = todayString();
  bookingForm.elements.start.value = pickup.value >= todayString() ? pickup.value : todayString();
  bookingForm.elements.end.min = addDays(bookingForm.elements.start.value, 1);
  bookingForm.elements.end.value = dropoff.value > bookingForm.elements.start.value ? dropoff.value : addDays(bookingForm.elements.start.value, 1);
  const location = $('#pickup-location').value;
  bookingForm.elements.location.value = selectedCar.locations.includes(location) ? location : selectedCar.locations[0];
  $('#booking-error').textContent = '';
  dialog.showModal();
}
grid.addEventListener('click', event => {
  const favorite = event.target.closest('[data-favorite]');
  if (favorite) {
    const car = cars[Number(favorite.dataset.favorite)];
    if (!car) return;
    if (favorites.has(car.name)) favorites.delete(car.name);
    else favorites.add(car.name);
    renderCars();
    return;
  }
  const btn = event.target.closest('[data-book]');
  if (btn) openBooking(Number(btn.dataset.book));
});
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
bookingForm.elements.start.addEventListener('change', () => {
  const start = bookingForm.elements.start.value;
  if (!start) return;
  bookingForm.elements.end.min = addDays(start, 1);
  if (bookingForm.elements.end.value <= start) bookingForm.elements.end.value = addDays(start, 1);
});
let toastTimeout;
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('show'), 4800); }
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const form = bookingForm.elements;
  const error = dateError(form.start.value, form.end.value);
  $('#booking-error').textContent = error;
  if (error) return;
  if (!CONFIG.businessEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONFIG.businessEmail)) {
    $('#booking-error').textContent = 'Demo mode: add your real reservations email to CONFIG.businessEmail in script.js before accepting enquiries.';
    return;
  }
  const subject = `Rental enquiry: ${selectedCar.name}`;
  const body = [
    'Hello, I would like to enquire about a vehicle rental.', '',
    `Vehicle: ${selectedCar.name}`, `Pick-up: ${form.location.value}`, `From: ${form.start.value}`, `Until: ${form.end.value}`,
    `Name: ${form.name.value.trim()}`, `Email: ${form.email.value.trim()}`, `Phone: ${form.phone.value.trim() || 'Not provided'}`,
    '', 'Please confirm availability and final pricing. This is an enquiry, not a confirmed booking.'
  ].join('\n');
  window.location.href = `mailto:${CONFIG.businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  toast('Your email app should open with your enquiry. Your booking is not yet confirmed.');
  dialog.close();
});

const menuBtn = $('.mobile-toggle');
menuBtn.addEventListener('click', () => {
  const open = $('#main-nav').classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  $('#main-nav').classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}));

$$('[data-contact-link]').forEach(link => {
  if (CONFIG.businessEmail) link.href = `mailto:${CONFIG.businessEmail}`;
  else link.addEventListener('click', event => { event.preventDefault(); toast('Demo mode: configure your business email in script.js.'); });
});
$('#year').textContent = new Date().getFullYear();
renderCars();
