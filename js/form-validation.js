function handleFormSubmit(event) {
    event.preventDefault();
    
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
    
    const form = event.target;
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const position = document.getElementById('position');
    const agency = document.getElementById('agency');
    const companySize = document.getElementById('company-size');
    
    let isValid = true;
    
    if (!fullName.value.trim()) {
        showError('fullName', 'Full name is required');
        isValid = false;
    }

    if (!email.value.trim()) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        showError('email', 'Please enter a valid email');
        isValid = false;
    }
    
    const phoneValue = phone.value.trim();
    if (!phoneValue) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!phoneValue.startsWith('+')) {
        showError('phone', 'Phone number must include area code and be 10 digits.');
        isValid = false;
    }
    
    if (!position.value) {
        showError('position', 'Please select your position');
        isValid = false;
    }
    
    if (!agency.value.trim()) {
        showError('agency', 'Agency name is required');
        isValid = false;
    }
    
    if (!companySize.value) {
        showError('company-size', 'Please select company size');
        isValid = false;
    }
    
    if (!isValid) {
        console.log('Form validation failed');
        return false;
    }
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    const formData = {
        full_name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        position: document.getElementById('position').value,
        agency: document.getElementById('agency').value,
        company_size: document.getElementById('company-size').value,
        message: document.getElementById('message').value
    };

    fetch('send.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        if (data.status === 'success') {
            form.reset();
            
            const formModal = document.getElementById('demoModal');
            if (formModal) {
                formModal.style.display = 'none';
            }
            
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                setTimeout(() => {
                    successModal.classList.remove('hidden');
                }, 10);
            }
        } else {
            showStatus(data.message || 'Error submitting form', true);
        }
    })
    .catch(error => {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        showStatus('Network error. Please try again.', true);
        console.error('Error:', error);
    });
    
    return false;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

function showStatus(message, isError = false) {
    const formStatus = document.getElementById('form-status');
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.className = 'form-status';
    formStatus.classList.add(isError ? 'error' : 'success');
    formStatus.style.display = 'block';
    
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    if (!isError) {
        setTimeout(() => {
            formStatus.style.opacity = '0';
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
                formStatus.style.display = 'none';
                formStatus.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}

function closeModalFunc() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
