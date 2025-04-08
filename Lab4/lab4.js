const usersData = [];
let currentUserData = null;

const form = document.getElementById('surveyForm');
const clearBtn = document.getElementById('clearBtn');
const viewResultsBtn = document.getElementById('viewResultsBtn');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            birthWeek: document.getElementById('birthWeek').value,
            genres: [],
            favChannel: document.getElementById('favChannel').value,
            frequency: document.querySelector('input[name="frequency"]:checked')?.value || '',
            comments: document.getElementById('comments').value
        };
        
        document.querySelectorAll('input[name="genres"]:checked').forEach(checkbox => {
            formData.genres.push(checkbox.value);
        });
        
        currentUserData = formData;
        
        usersData.push(formData);
        
        this.reset();
        
        alert('Спасибо за участие в опросе!');
    }
});

clearBtn.addEventListener('click', function() {
    if (confirm('Вы уверены, что хотите очистить форму?')) {
        form.reset();
        clearErrors();
    }
});

viewResultsBtn.addEventListener('click', function() {
    if (currentUserData) {
        showResults(currentUserData);
    } else {
        alert('Сначала заполните и отправьте форму');
    }
});

function validateForm() {
    let isValid = true;
    clearErrors();
    
    const name = document.getElementById('name');
    if (!name.value || !name.checkValidity()) {
        document.getElementById('nameError').textContent = 
            'Введите корректное имя (только буквы, 2-50 символов)';
        isValid = false;
    }
    
    const email = document.getElementById('email');
    if (!email.value || !email.checkValidity()) {
        document.getElementById('emailError').textContent = 
            'Введите корректный email';
        isValid = false;
    }
    
    const genres = document.querySelectorAll('input[name="genres"]:checked');
    if (genres.length === 0) {
        document.getElementById('genresError').textContent = 
            'Выберите хотя бы один жанр';
        isValid = false;
    }
    
    const channel = document.getElementById('favChannel');
    if (!channel.value) {
        document.getElementById('channelError').textContent = 
            'Выберите любимый канал';
        isValid = false;
    }
    
    const frequency = document.querySelector('input[name="frequency"]:checked');
    if (!frequency) {
        document.getElementById('frequencyError').textContent = 
            'Выберите частоту просмотра';
        isValid = false;
    }
    
    return isValid;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
    });
}

function showResults(userData) {
    const modal = document.getElementById('resultsModal');
    const modalContent = document.getElementById('modalResultsContent');
    const usersDatalist = document.getElementById('users');
    
    modalContent.innerHTML = `
        <table>
            <tr>
                <th>Имя</th>
                <td>${userData.name}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td>${userData.email}</td>
            </tr>
            <tr>
                <th>Неделя рождения</th>
                <td>${userData.birthWeek || 'Не указано'}</td>
            </tr>
            <tr>
                <th>Любимые жанры</th>
                <td>${userData.genres.join(', ') || 'Не указано'}</td>
            </tr>
            <tr>
                <th>Любимый канал</th>
                <td>${userData.favChannel || 'Не указано'}</td>
            </tr>
            <tr>
                <th>Частота просмотра</th>
                <td>${userData.frequency}</td>
            </tr>
            <tr>
                <th>Пожелания</th>
                <td>${userData.comments || 'Не указано'}</td>
            </tr>
        </table>
    `;
    
    usersDatalist.innerHTML = usersData.map(user => 
        `<option value="${user.name}">${user.email}</option>`
    ).join('');
    
    modal.style.display = 'block';
    
    document.querySelector('.close-btn').onclick = function() {
        modal.style.display = 'none';
    };
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}