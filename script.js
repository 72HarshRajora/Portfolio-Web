document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'inline-block';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Product Listing with Filtering and Sorting
    const productsContainer = document.getElementById('products-container');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');

    // Sample product data
    const products = [
        { id: 1, name: 'Responsive Website', category: 'web', price: 49.99, rating: 4.5, image: 'img/Service1.png' },
        { id: 2, name: 'Logo', category: 'design', price: 0, rating: 4.2, image: 'img/Service2.jpg' },
        { id: 3, name: 'Poster Design', category: 'design', price: 29.99, rating: 4.8, image: 'img/Service3.png' },
        { id: 4, name: 'E-commerce Website', category: 'web', price: 59.99, rating: 4.7, image: 'img/Service4.jpg' },
        { id: 5, name: 'UI Design', category: 'design', price: 19.99, rating: 4.3, image: 'img/Service5.jpeg' },
        { id: 6, name: 'Portfolio Website', category: 'mobile', price: 39.99, rating: 4.6, image: 'img/Service6.jpeg'}
    ];

    // Display all products initially
    displayProducts(products);

    // Filter and sort event listeners
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    sortBy.addEventListener('change', filterProducts);

    function filterProducts() {
        let filteredProducts = [...products];
        
        // Apply category filter
        if (categoryFilter.value !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.category === categoryFilter.value
            );
        }
        
        // Apply price filter
        if (priceFilter.value === 'free') {
            filteredProducts = filteredProducts.filter(
                product => product.price === 0
            );
        } else if (priceFilter.value === 'paid') {
            filteredProducts = filteredProducts.filter(
                product => product.price > 0
            );
        }
        
        // Apply sorting
        switch (sortBy.value) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting (by ID)
                filteredProducts.sort((a, b) => a.id - b.id);
        }
        
        displayProducts(filteredProducts);
    }

    function displayProducts(productsToDisplay) {
        productsContainer.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">No products match your filters.</p>';
            return;
        }
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price === 0 ? 'FREE' : '$' + product.price.toFixed(2)}</p>
                    <p class="product-rating">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} ${product.rating}</p>
                    <span class="product-category">${product.category}</span>
                </div>
            `;
            productsContainer.appendChild(productCard);
        });
    }

    // Notes App with Local Storage
    const notesContainer = document.getElementById('notes-container');
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note');
    const clearNotesBtn = document.getElementById('clear-notes');

    // Load notes from local storage
    loadNotes();

    addNoteBtn.addEventListener('click', addNote);
    clearNotesBtn.addEventListener('click', clearNotes);
    noteInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNote();
        }
    });

    function addNote() {
        const noteText = noteInput.value.trim();
        if (noteText === '') return;
        
        // Create new note
        const noteId = Date.now();
        const note = { id: noteId, text: noteText };
        
        // Get existing notes
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        
        // Add new note
        notes.push(note);
        
        // Save to local storage
        localStorage.setItem('notes', JSON.stringify(notes));
        
        // Add to DOM
        addNoteToDOM(note);
        
        // Clear input
        noteInput.value = '';
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(note => addNoteToDOM(note));
    }

    function addNoteToDOM(note) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.dataset.id = note.id;
        noteElement.innerHTML = `
            <div class="note-text">${note.text}</div>
            <div class="note-actions">
                <button class="edit-note" title="Edit note"><i class="fas fa-edit"></i></button>
                <button class="delete-note" title="Delete note"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        notesContainer.appendChild(noteElement);
        
        // Add event listeners for edit and delete
        noteElement.querySelector('.delete-note').addEventListener('click', () => deleteNote(note.id));
        noteElement.querySelector('.edit-note').addEventListener('click', () => editNote(note.id, note.text));
    }

    function deleteNote(noteId) {
        // Remove from local storage
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('notes', JSON.stringify(notes));
        
        // Remove from DOM
        document.querySelector(`.note-item[data-id="${noteId}"]`).remove();
    }

    function editNote(noteId, currentText) {
        const noteElement = document.querySelector(`.note-item[data-id="${noteId}"]`);
        const noteTextElement = noteElement.querySelector('.note-text');
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        
        // Replace text with input
        noteTextElement.replaceWith(input);
        input.focus();
        
        // Handle save on blur or enter
        function saveEdit() {
            const newText = input.value.trim();
            if (newText === '') {
                deleteNote(noteId);
                return;
            }
            
            // Update local storage
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes = notes.map(note => 
                note.id === noteId ? { ...note, text: newText } : note
            );
            localStorage.setItem('notes', JSON.stringify(notes));
            
            // Update DOM
            noteTextElement.textContent = newText;
            input.replaceWith(noteTextElement);
        }
        
        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }

    function clearNotes() {
        if (confirm('Are you sure you want to delete all notes?')) {
            localStorage.removeItem('notes');
            notesContainer.innerHTML = '';
        }
    }

    // // Contact Form
    // const contactForm = document.getElementById('contact-form');
    // contactForm.addEventListener('submit', function(e) {
    //     e.preventDefault();
        
    //     // Get form values
    //     const name = document.getElementById('name').value;
    //     const email = document.getElementById('email').value;
    //     const message = document.getElementById('message').value;
        
    //     // Here you would typically send the form data to a server
    //     // For this demo, we'll just show an alert
    //     alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
        
    //     // Reset form
    //     contactForm.reset();
    // });


    

    const contactForm = document.getElementById("contact-form");
const contactMessage = document.getElementById("contact-message");
const submitBtn = document.querySelector("#contact-form button[type='submit']");

// Initialize EmailJS (best practice)
emailjs.init("HjXTUZWwNmAvjnAff");

const sendEmail = (e) => {
    e.preventDefault();
    
    // Disable button during submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Clear previous messages
    contactMessage.textContent = "";
    contactMessage.className = "";
    
    // Basic client-side validation
    const name = contactForm.elements["name"].value.trim();
    const email = contactForm.elements["email"].value.trim();
    const message = contactForm.elements["message"].value.trim();
    
    if (!name || !email || !message) {
        contactMessage.textContent = "Please fill all required fields ❌";
        contactMessage.className = "error-message";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        return;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        contactMessage.textContent = "Please enter a valid email ❌";
        contactMessage.className = "error-message";
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
        return;
    }

    // Send email
    emailjs.sendForm("service_dmsiboe", "template_8xo6g6j", contactForm)
        .then(() => {
            contactMessage.textContent = "Message sent successfully ✅";
            contactMessage.className = "success-message";
            contactForm.reset();
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                contactMessage.textContent = "";
                contactMessage.className = "";
            }, 5000);
        })
        .catch((error) => {
            console.error("EmailJS Error:", error);
            contactMessage.textContent = "Failed to send message. Please try again later ❌";
            contactMessage.className = "error-message";
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        });
};

contactForm.addEventListener("submit", sendEmail);




    // Scroll animations
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', checkSectionVisibility);

    function checkSectionVisibility() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize section visibility
    checkSectionVisibility();
});