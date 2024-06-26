const categoryList = document.getElementById('category-list');
const addCategoryForm = document.getElementById('add-category-form');
const form_title = document.getElementById('form-title');
const btn_add = document.getElementById('form-btn-add');
const btn_edit = document.getElementById('form-btn-edit');

document.addEventListener('DOMContentLoaded', listCategories);

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

// Event listener para o envio do formulário
addCategoryForm.addEventListener('submit', submitCategory);

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

            alert("Categoria adicionada com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao adicionar a categoria:', error);
        });
}

function removeCategory(categoryId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/categories/${categoryId}.json`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            listCategories();
            
            alert("Remoção realizada com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao remover a categoria:', error);
        });
}

function changeForm(categoryId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/categories/${categoryId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(category => {
            console.log(`Categoria ${category.name} recuperada, dale!`);

            const nameField = document.getElementById('name');
            nameField.value = category.name;

            btn_add.style.display = 'none';
            btn_edit.removeAttribute('style');
            form_title.textContent = "Editar Categoria"
            btn_edit.setAttribute('onclick', `updateCategory('${categoryId}')`);
        });
}

function updateCategory(categoryId) {
    const formData = new FormData(addCategoryForm);
    const categoryData = {
        name: formData.get('name')
    };

    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/categories/${categoryId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            btn_edit.style.display = 'none';
            btn_add.removeAttribute('style');
            form_title.textContent = "Adicionar Nova Categoria"

            listCategories();
            addCategoryForm.reset(); // Limpa os campos do formulário
            alert("Edição realizada com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao editar a categoria:', error);
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
    categoryCard.classList.add('card', 'card-body', 'mb-3');

    const name = document.createElement('h4');
    name.classList.add('card-title');
    name.textContent = category.name;

    const btn_group = document.createElement('div');
    btn_group.classList.add('btn-group');
    btn_group.setAttribute('role', 'group');

    const btn_remove = document.createElement('button');
    btn_remove.classList.add('btn', 'btn-danger', 'btn-sm');
    btn_remove.setAttribute('type', 'button');
    btn_remove.setAttribute('onclick', `removeCategory('${category.id}')`);
    btn_remove.innerHTML = "Remover";

    const btn_update = document.createElement('button');
    btn_update.classList.add('btn', 'btn-primary', 'btn-sm');
    btn_update.setAttribute('type', 'button');
    btn_update.setAttribute('onclick', `changeForm('${category.id}')`);
    btn_update.innerHTML = "Editar";

    btn_group.append(btn_remove, btn_update);
    categoryCard.append(name, btn_group);

    return categoryCard;
}