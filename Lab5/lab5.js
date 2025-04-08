let companies = [];
let nextId = 1;

const form = document.getElementById('exhibitionForm');
const tableBody = document.querySelector('#exhibitionTable tbody');
const recordIdSelect = document.getElementById('recordId');
const addBtn = document.getElementById('addBtn');
const clearBtn = document.getElementById('clearBtn');
const deleteBtn = document.getElementById('deleteBtn');
const sortBtn = document.getElementById('sortBtn');
const addPropertyBtn = document.getElementById('addPropertyBtn');
const propertyDisplay = document.getElementById('propertyDisplay');

function init() {
    updateTable();
    updateRecordIdSelect();
    
    addTestData();
}

function addTestData() {
    addCompany({
        companyName: "Samsung",
        country: "Южная Корея",
        email: "info@samsung.com",
        productCount: 150
    });
    
    addCompany({
        companyName: "Apple",
        country: "США",
        email: "exhibition@apple.com",
        productCount: 120
    });
    
    addCompany({
        companyName: "Xiaomi",
        country: "Китай",
        email: "expo@xiaomi.com",
        productCount: 200
    });
}

function addCompany(company) {
    company.id = nextId++;
    companies.push(company);
    updateTable();
    updateRecordIdSelect();
}

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

function updateRecordIdSelect() {
    recordIdSelect.innerHTML = '<option value="">-- Новая запись --</option>';
    
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company.id;
        option.textContent = `${company.id} - ${company.companyName}`;
        recordIdSelect.appendChild(option);
    });
}

function fillForm(company) {
    document.getElementById('companyName').value = company.companyName;
    document.getElementById('country').value = company.country;
    document.getElementById('email').value = company.email;
    document.getElementById('productCount').value = company.productCount;
}

function clearForm() {
    form.reset();
    recordIdSelect.value = '';
}

function findCompanyById(id) {
    return companies.find(company => company.id === parseInt(id));
}

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
    
    if (id) {
        const company = findCompanyById(id);
        if (company) {
            Object.assign(company, companyData);
            updateTable();
            clearForm();
        }
    } else {
        addCompany(companyData);
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
    
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        companies = companies.filter(company => company.id !== parseInt(id));
        updateTable();
        updateRecordIdSelect();
        clearForm();
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
        updateRecordIdSelect();
        
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
            fillForm(company);
        }
    } else {
        clearForm();
    }
});

document.addEventListener('DOMContentLoaded', init);