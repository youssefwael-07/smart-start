        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                container.appendChild(particle);
            }
        }

        // Order management
        const prices = {
            premium: 29.99,
            storage: 9.99,
            support: 14.99
        };

        let quantities = {
            premium: 1,
            storage: 1,
            support: 1
        };

        function updateQuantity(item, change) {
            quantities[item] = Math.max(0, quantities[item] + change);
            document.getElementById(`${item}-qty`).textContent = quantities[item];
            document.getElementById(`${item}-price`).textContent = `$${(prices[item] * quantities[item]).toFixed(2)}`;
            updateTotal();
            updateProgress();
        }

        function updateTotal() {
            const subtotal = Object.keys(quantities).reduce((sum, item) => {
                return sum + (prices[item] * quantities[item]);
            }, 0);
            
            const tax = subtotal * 0.08;
            const discount = 5.00;
            const total = subtotal + tax - discount;

            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;
            document.getElementById('btn-text').textContent = `Complete Payment - $${total.toFixed(2)}`;
        }

        function updateProgress() {
            const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
            const progress = Math.min((totalItems / 10) * 100, 100);
            document.getElementById('progress').style.width = progress + '%';
        }

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                showToast('Payment method updated', 'success');
            });
        });

        // Real-time form validation
        function validateField(field, validator) {
            const isValid = validator(field.value);
            const icon = document.getElementById(field.id + '-icon');
            
            field.classList.remove('valid', 'invalid');
            icon.classList.remove('show', 'valid', 'invalid');
            
            if (field.value.length > 0) {
                icon.classList.add('show');
                if (isValid) {
                    field.classList.add('valid');
                    icon.classList.add('valid');
                } else {
                    field.classList.add('invalid');
                    icon.classList.add('invalid');
                }
            }
            
            return isValid;
        }

        // Validation functions
        const validators = {
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            cardNumber: (value) => {
                const cleaned = value.replace(/\s/g, '');
                return /^\d{13,19}$/.test(cleaned);
            },
            expiry: (value) => {
                const match = value.match(/^(\d{2})\/(\d{2})$/);
                if (!match) return false;
                const month = parseInt(match[1]);
                const year = parseInt(match[2]) + 2000;
                const now = new Date();
                const expiry = new Date(year, month - 1);
                return month >= 1 && month <= 12 && expiry > now;
            },
            cvv: (value) => /^\d{3,4}$/.test(value),
            cardholder: (value) => value.trim().length >= 2,
            zip: (value) => /^\d{5}(-\d{4})?$/.test(value)
        };

        // Format card number with spaces
        function formatCardNumber(value) {
            const cleaned = value.replace(/\s/g, '');
            const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
            return formatted;
        }

        // Format expiry date
        function formatExpiry(value) {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length >= 2) {
                return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
            }
            return cleaned;
        }

        // Update credit card display
        function updateCardDisplay() {
            const cardNumber = document.getElementById('card-number').value;
            const cardholder = document.getElementById('cardholder').value;
            const expiry = document.getElementById('expiry').value;

            // Update card number display
            const displayNumber = cardNumber || '•••• •••• •••• ••••';
            document.getElementById('card-display').textContent = displayNumber;

            // Update cardholder name
            const displayName = cardholder.toUpperCase() || 'YOUR NAME';
            document.getElementById('name-display').textContent = displayName;

            // Update expiry
            const displayExpiry = expiry || 'MM/YY';
            document.getElementById('expiry-display').textContent = displayExpiry;
        }

        // Toast notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type}`;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        
            const submitBtn = document.getElementById('submit-btn');
            const loading = document.getElementById('loading');
            const btnText = document.getElementById('btn-text');
            
            // Show loading state
            submitBtn.classList.add('processing');
            loading.style.display = 'inline-block';
            btnText.textContent = 'Processing Payment...';
            
            // Simulate payment processing
            setTimeout(() => {
                submitBtn.classList.remove('processing');
                loading.style.display = 'none';
                btnText.textContent = 'Payment Successful!';
                showToast('Payment completed successfully!', 'success');
                
                // Reset after 3 seconds
                setTimeout(() => {
                    btnText.textContent = 'Complete Payment - $54.37';
                }, 3000);
            }, 2000);

        // Event listeners for form fields
        document.getElementById('email').addEventListener('input', function() {
            validateField(this, validators.email);
        });

        document.getElementById('card-number').addEventListener('input', function() {
            this.value = formatCardNumber(this.value);
            validateField(this, validators.cardNumber);
            updateCardDisplay();
        });

        document.getElementById('expiry').addEventListener('input', function() {
            this.value = formatExpiry(this.value);
            validateField(this, validators.expiry);
            updateCardDisplay();
        });

        document.getElementById('cvv').addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            validateField(this, validators.cvv);
        });

        document.getElementById('cardholder').addEventListener('input', function() {
            validateField(this, validators.cardholder);
            updateCardDisplay();
        });

        document.getElementById('zip').addEventListener('input', function() {
            validateField(this, validators.zip);
        });

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            updateProgress();
            showToast('Welcome! Your secure checkout is ready.', 'success');
        });