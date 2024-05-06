class Category {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
}

const categoryList = document.getElementById('category-list');
const addCategoryForm = document.getElementById('add-category-form');

document.addEventListener('DOMContentLoaded', listCategories);

// Event listener para o envio do formulário
addCategoryForm.addEventListener('submit', submitCategory);

function listCategories() {
    // Busca categorias na API
    fetchCategories()
        .then(categories => {
            renderCategories(categories);
        })
        .catch(error => {
            console.error('Houve um problema ao buscar as categorias:', error);
        });

}

function submitCategory(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const formData = new FormData(addCategoryForm);
    const categoryData = {
        name: formData.get('name')
    };

    addCategory(categoryData)
        .then(() => {
            return fetchCategories();
        })
        .then(categories => {
            renderCategories(categories);
            addCategoryForm.reset(); // Limpa os campos do formulário
        })
        .catch(error => {
            console.error('Houve um problema ao adicionar a categoria:', error);
        });
}

// Função para buscar categorias na API
function fetchCategories() {
    return fetch('https://web01-miniprojeto04-default-rtdb.firebaseio.com/categories.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(categories => {
            const categoriesList = [];
            for (let key in categories) {
                const category = new Category({
                    id: key,
                    name: categories[key].name
                });

                categoriesList.push(category);
            }
            return categoriesList;
        });
}

// Função para adicionar contato na API
function addCategory(categoryData) {
    return fetch('https://web01-miniprojeto04-default-rtdb.firebaseio.com/categories.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
        });
}

// Função para renderizar categorias na página
function renderCategories(categories) {
    categoryList.innerHTML = ''; // Limpa as categorias existentes

    categories.forEach(category => {
        const categoryCard = createCategoryCard(category);
        categoryList.appendChild(categoryCard);
    });
}

// Função para criar o card da categoria
function createCategoryCard(category) {

    const categoryCard = document.createElement('div');
    categoryCard.classList.add('card');
    categoryCard.classList.add('card-body');
    categoryCard.classList.add('mb-3');
    categoryCard.classList.add('my-4');

    const name = document.createElement('h3');
    name.classList.add('card-title');
    name.textContent = category.name;

    categoryCard.appendChild(name);

    return categoryCard;
}