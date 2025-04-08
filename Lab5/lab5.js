// Хранилище данных
let companies = [];
let nextId = 1;
let history = [];

// Элементы DOM
const form = document.getElementById('exhibitionForm');
const tableBody = document.querySelector('#exhibitionTable tbody');
const recordIdSelect = document.getElementById('recordId');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const deleteBtn = document.getElementById('deleteBtn');
const sortBtn = document.getElementById('sortBtn');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const propertyDisplay = document.getElementById('propertyDisplay');
const historyLog = document.getElementById('historyLog');

// Инициализация
function init() {
    updateTable();
    updateRecordIdSelect();
    loadHistory();
}

// Обновление таблицы
function updateTable() {
    tableBody.innerHTML = '';
    
    companies.forEach(company => {
        const row = document.createElement('tr');
        
        let additionalProps = '';
        for (const key in company) {
            if (!['id', 'companyName', 'country', 'email', 'productCount'].includes(key)) {
                additionalProps += `${key}: ${company[key]}, `;
            }
        }
        additionalProps = additionalProps.replace(/, $/, '');
        
        row.innerHTML = `
            <td>${company.id}</td>
            <td>${company.companyName}</td>
            <td>${company.country}</td>
            <td>${company.email}</td>
            <td>${company.productCount}</td>
            <td>${additionalProps}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Обновление выпадающего списка ID
function updateRecordIdSelect() {
    recordIdSelect.innerHTML = '<option value="">-- Новая запись --</option>';
    
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = `${company.id} - ${company.companyName}`;
        recordIdSelect.appendChild(option);
    });
}

// Поиск компании по ID
function findCompanyById(id) {
    return companies.find(company => company.id === parseInt(id));
}

// Удаление компании по ID
function deleteCompanyById(id) {
    const index = companies.findIndex(company => company.id === parseInt(id));
    if (index !== -1) {
        const deletedCompany = companies[index];
        companies.splice(index, 1);
        updateTable();
        updateRecordIdSelect();
        addHistoryEntry('delete', `Удалена запись с ID ${id}: ${deletedCompany.companyName}`, id);
        return true;
    }
    return false;
}

// Добавление/обновление компании
function saveCompany(companyData, id = null) {
    if (id) {
        const company = findCompanyById(id);
        if (company) {
            Object.assign(company, companyData);
            updateTable();
            addHistoryEntry('update', `Обновлена запись с ID ${id}: ${company.companyName}`, id);
            return true;
        }
        return false;
    } else {
        companyData.id = nextId++;
        companies.push(companyData);
        updateTable();
        updateRecordIdSelect();
        addHistoryEntry('add', `Добавлена новая запись с ID ${companyData.id}: ${companyData.companyName}`, companyData.id);
        return true;
    }
}

// Добавление записи в историю
function addHistoryEntry(action, details, id = null) {
    const entry = {
        timestamp: new Date(),
        action,
        details,
        id
    };
    
    // Проверка на дублирование
    const lastEntry = history[history.length - 1];
    if (!lastEntry || 
        lastEntry.action !== entry.action || 
        lastEntry.id !== entry.id || 
        lastEntry.details !== entry.details) {
        history.push(entry);
        updateHistoryDisplay();
        localStorage.setItem('exhibitionHistory', JSON.stringify(history));
    }
}

// Обновление отображения истории
function updateHistoryDisplay() {
    historyLog.innerHTML = '';
    
    const recentHistory = history.slice(-20).reverse();
    
    recentHistory.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = `history-entry history-${entry.action.toLowerCase()}`;
        
        const timeString = entry.timestamp.toLocaleTimeString();
        const dateString = entry.timestamp.toLocaleDateString();
        
        entryElement.innerHTML = `
            <span class="history-time">[${dateString} ${timeString}]</span>
            ${entry.details}
        `;
        
        historyLog.appendChild(entryElement);
    });
    
    historyLog.scrollTop = 0;
}

// Загрузка истории из localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('exhibitionHistory');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        history.forEach(entry => {
            entry.timestamp = new Date(entry.timestamp);
        });
        updateHistoryDisplay();
    }
}

// Очистка формы
function clearForm() {
    form.reset();
    recordIdSelect.value = '';
}

// Сортировка стран по количеству продукции
function sortCountriesByProducts() {
    const countryStats = {};
    
    companies.forEach(company => {
        if (!countryStats[company.country]) {
            countryStats[company.country] = 0;
        }
        countryStats[company.country] += company.productCount;
    });
    
    const sortedCountries = Object.entries(countryStats)
        .sort((a, b) => b[1] - a[1])
        .map(([country, count]) => `${country}: ${count} единиц продукции`);
    
    alert('Страны по количеству продукции:\n' + sortedCountries.join('\n'));
}

// Обработчики событий
addBtn.addEventListener('click', () => {
    const id = recordIdSelect.value;
    const companyData = {
        companyName: document.getElementById('companyName').value,
        country: document.getElementById('country').value,
        email: document.getElementById('email').value,
        productCount: parseInt(document.getElementById('productCount').value)
    };
    
    if (!companyData.companyName || !companyData.country || !companyData.email || !companyData.productCount) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    if (saveCompany(companyData, id || undefined)) {
        clearForm();
    }
});

clearBtn.addEventListener('click', clearForm);

deleteBtn.addEventListener('click', () => {
    const id = recordIdSelect.value;
    if (!id) {
        alert('Пожалуйста, выберите запись для удаления');
        return;
    }
    
    const company = findCompanyById(id);
    if (!company) {
        alert('Запись не найдена');
        return;
    }
    
    if (confirm(`Вы уверены, что хотите удалить запись с ID ${id} (${company.companyName})?`)) {
        if (deleteCompanyById(id)) {
            clearForm();
        } else {
            alert('Ошибка при удалении записи');
        }
    }
});

sortBtn.addEventListener('click', sortCountriesByProducts);

addPropertyBtn.addEventListener('click', () => {
    const id = recordIdSelect.value;
    if (!id) {
        alert('Пожалуйста, выберите запись для добавления свойства');
        return;
    }
    
    const propertyName = document.getElementById('newProperty').value.trim();
    const propertyValue = document.getElementById('newPropertyValue').value.trim();
    
    if (!propertyName || !propertyValue) {
        alert('Пожалуйста, введите название и значение свойства');
        return;
    }
    
    const company = findCompanyById(id);
    if (company) {
        company[propertyName] = propertyValue;
        updateTable();
        addHistoryEntry('property', `Добавлено свойство "${propertyName}" к записи с ID ${id}`, id);
        propertyDisplay.textContent = `Добавлено свойство: ${propertyName} = ${propertyValue}`;
        document.getElementById('newProperty').value = '';
        document.getElementById('newPropertyValue').value = '';
    }
});

recordIdSelect.addEventListener('change', () => {
    const id = recordIdSelect.value;
    if (id) {
        const company = findCompanyById(id);
        if (company) {
            document.getElementById('companyName').value = company.companyName;
            document.getElementById('country').value = company.country;
            document.getElementById('email').value = company.email;
            document.getElementById('productCount').value = company.productCount;
        }
    } else {
        clearForm();
    }
});

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', init);