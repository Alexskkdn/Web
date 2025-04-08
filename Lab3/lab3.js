const elementsToTranslate = {
    title: document.getElementById('form-title'),
    sectionTitle: document.getElementById('section-title'),
    labels: [
        document.getElementById('label1'),
        document.getElementById('label2'),
        document.getElementById('label3'),
        document.getElementById('label4'),
        document.getElementById('style-label')
    ],
    navItems: [
        document.getElementById('nav1'),
        document.getElementById('nav2'),
        document.getElementById('nav3'),
        document.getElementById('nav4')
    ],
    asideTitle: document.getElementById('aside-title'),
    ads: [
        document.getElementById('ad1'),
        document.getElementById('ad2'),
        document.getElementById('ad3'),
        document.getElementById('ad4')
    ],
    footerText: document.getElementById('footer-text'),
    btnShow: document.getElementById('btn-show'),
    styleOptions: document.getElementById('text-style').options
};

const fields = [
    document.getElementById('field1'),
    document.getElementById('field2'),
    document.getElementById('field3'),
    document.getElementById('field4')
];

const btnRu = document.getElementById('btn-ru');
const btnEn = document.getElementById('btn-en');
const textStyle = document.getElementById('text-style');

const texts = {
    ru: {
        title: "Форма для заполнения",
        sectionTitle: "Внесите, пожалуйста, данные",
        labels: ["ФИО:", "Пожелание к заказу:", "Телефон:", "Как ещё можно с Вами связаться:", "Стиль текста:"],
        btnShow: "Показать данные",
        nav: ["Главная", "О нас", "Меню", "Контакты"],
        aside: {
            title: "Дополнительная информация",
            ads: [
                "Специальное предложение для наших клиентов!",
                "Если Вы впервые пользуетесь нашими услугами, то получите скидку 15% на сумму заказа от 30 руб.",
                "Что новенького:",
                "В меню появились новые позиции."
            ]
        },
        footer: "© Yummi: Всегда вкусно.",
        emptyValue: "Пусто"
    },
    en: {
        title: "Fill form",
        sectionTitle: "Please enter your data",
        labels: ["Full name:", "Order wishes:", "Phone:", "Alternative contact:", "Text style:"],
        btnShow: "Show data",
        nav: ["Home", "About", "Menu", "Contacts"],
        aside: {
            title: "Additional information",
            ads: [
                "Special offer for our customers!",
                "If this is your first order, you'll get 15% discount for orders over 30 BYN",
                "What's new:",
                "New items have been added to our menu."
            ]
        },
        footer: "© Yummi: Always tasty.",
        emptyValue: "Empty"
    }
};

let currentLanguage = 'ru';

function setLanguage(lang) {
    currentLanguage = lang;
    const langTexts = texts[lang];
    
    elementsToTranslate.title.textContent = langTexts.title;
    elementsToTranslate.sectionTitle.textContent = langTexts.sectionTitle;
    elementsToTranslate.asideTitle.textContent = langTexts.aside.title;
    
    elementsToTranslate.labels.forEach((label, i) => {
        label.textContent = langTexts.labels[i];
    });
    
    elementsToTranslate.navItems.forEach((navItem, i) => {
        navItem.textContent = langTexts.nav[i];
    });
    
    elementsToTranslate.ads.forEach((ad, i) => {
        ad.textContent = langTexts.aside.ads[i];
    });
    
    elementsToTranslate.footerText.textContent = langTexts.footer;
    
    elementsToTranslate.btnShow.textContent = langTexts.btnShow;
    
    elementsToTranslate.styleOptions[0].textContent = langTexts.labels[4] + " - " + (lang === 'ru' ? "Красный" : "Red");
    elementsToTranslate.styleOptions[1].textContent = langTexts.labels[4] + " - " + (lang === 'ru' ? "Синий" : "Blue");
    elementsToTranslate.styleOptions[2].textContent = langTexts.labels[4] + " - " + (lang === 'ru' ? "Зеленый" : "Green");
}

btnRu.addEventListener('click', () => {
    setLanguage('ru');
    btnRu.classList.add('active');
    btnEn.classList.remove('active');
});

btnEn.addEventListener('click', () => {
    setLanguage('en');
    btnEn.classList.add('active');
    btnRu.classList.remove('active');
});

textStyle.addEventListener('change', function() {
    document.body.classList.remove('arial', 'times', 'courier', 'red', 'blue', 'green');
    
    const style = this.value;
    if (style === 'arial-red') {
        document.body.classList.add('arial', 'red');
    } else if (style === 'times-blue') {
        document.body.classList.add('times', 'blue');
    } else if (style === 'courier-green') {
        document.body.classList.add('courier', 'green');
    }
});

fields.forEach((field, i) => {
    if (i < fields.length - 1) {
        field.addEventListener('input', function() {
            if (this.value.length > 0) {
                fields[i + 1].focus();
            }
        });
    }
});

document.getElementById('btn-show').addEventListener('click', function() {
    const newWindow = window.open('', '_blank', 'width=600,height=500');
    
    if (!newWindow) {
        alert(currentLanguage === 'ru' ? 
            "Пожалуйста, разрешите всплывающие окна" : 
            "Please allow pop-up windows");
        return;
    }
    
    const labels = elementsToTranslate.labels.map(label => label.textContent);
    const values = fields.map(field => field.value || texts[currentLanguage].emptyValue);
    
    const selectedStyle = textStyle.value;
    let styleClass = '';
    let styleText = '';
    
    if (selectedStyle === 'arial-red') {
        styleClass = 'arial red';
        styleText = currentLanguage === 'ru' ? 'Arial - Красный' : 'Arial - Red';
    } else if (selectedStyle === 'times-blue') {
        styleClass = 'times blue';
        styleText = currentLanguage === 'ru' ? 'Times New Roman - Синий' : 'Times New Roman - Blue';
    } else if (selectedStyle === 'courier-green') {
        styleClass = 'courier green';
        styleText = currentLanguage === 'ru' ? 'Courier New - Зеленый' : 'Courier New - Green';
    }
    
    newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${elementsToTranslate.btnShow.textContent}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px;
                }
                .container { 
                    display: flex; 
                    gap: 40px; 
                }
                .column { 
                    flex: 1; 
                }
                h1, h2 { 
                    color: #333; 
                }
                h1 {
                    text-align: center;
                    margin-top: 0;
                }
                h2 {
                    border-bottom: 1px solid #ddd; 
                    padding-bottom: 5px;
                }
                ul { 
                    list-style-type: none; 
                    padding: 0; 
                    margin: 0;
                }
                li { 
                    margin-bottom: 10px; 
                    padding: 10px; 
                    background-color: #f5f5f5;
                    border-radius: 4px;
                }
                /* Стили текста */
                .arial { font-family: Arial, sans-serif; }
                .times { font-family: "Times New Roman", serif; }
                .courier { font-family: "Courier New", monospace; }
                .red { color: red; }
                .blue { color: blue; }
                .green { color: green; }
                .style-info {
                    background-color: #e3f2fd;
                    padding: 15px;
                    border-radius: 4px;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body class="${styleClass}">
            <h1>${currentLanguage === 'ru' ? 'Введённые данные' : 'Entered data'}</h1>
            
            <div class="style-info">
                ${currentLanguage === 'ru' ? 'Текущий стиль текста:' : 'Current text style:'} 
                <strong>${styleText}</strong>
            </div>
            
            <div class="container">
                <div class="column">
                    <h2>${currentLanguage === 'ru' ? 'Поля формы' : 'Form fields'}</h2>
                    <ul>
                        ${labels.map(label => `<li>${label}</li>`).join('')}
                    </ul>
                </div>
                <div class="column">
                    <h2>${currentLanguage === 'ru' ? 'Значения' : 'Values'}</h2>
                    <ul>
                        ${values.map(value => `<li>${value}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </body>
        </html>
    `);
    
    newWindow.document.close();
});

setLanguage('ru');