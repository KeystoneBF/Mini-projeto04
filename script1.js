class Contact {
    constructor({ id, name, phone, email, photo, bio, page, category, favorite }) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.photo = photo;
        this.bio = bio;
        this.page = page;
        this.category = category;
        this.favorite = favorite;
    }
}

const contactList = document.getElementById('contact-list');
const addContactForm = document.getElementById('add-contact-form');
const form_title = document.getElementById('form-title');
const btn_add = document.getElementById('form-btn-add');
const btn_edit = document.getElementById('form-btn-edit');

const nameField = document.getElementById('name');
const phoneField = document.getElementById('phone');
const emailField = document.getElementById('email');
const photoField = document.getElementById('photo');
const bioField = document.getElementById('bio');
const pageField = document.getElementById('page');
const categoryField = document.getElementById('category');
const favField = document.getElementById('favorite');

const btn_confirm = document.getElementById('modal-btn-confirm');
const filterGroup = document.getElementById('filterGroup');
const filterField = document.getElementById('filterField');

document.addEventListener('DOMContentLoaded', function () {
    listContacts();
    addCategoryOptions();
});

// Event listener para o envio do formulário
addContactForm.addEventListener('submit', submitContact);

// Máscara do número de telefone
phoneField.addEventListener('keypress', () => {
    let inputLength = phoneField.value.length;

    if (inputLength == 0) {
        phoneField.value += '('
    } else if (inputLength == 3) {
        phoneField.value += ') ';
    } else if (inputLength == 10) {
        phoneField.value += '-';
    }
})

// Máscara do número de telefone
emailField.addEventListener('keypress', () => {
    let inputLength = emailField.value.length;

    if (inputLength == 10) {
        emailField.value += '@'
    } else if (inputLength == 16) {
        emailField.value += '.';
    }
})

function listContacts() {
    // Busca contatos na API
    fetchContacts()
        .then(contacts => {
            renderContacts(contacts);
        })
        .catch(error => {
            console.error('Houve um problema ao buscar os contatos:', error);
        });
}

function addCategoryOptions() {
    // Busca contatos na API
    fetchCategories()
        .then(categories => {
            fillCategorySelect(categories);
            fillFilterSelect(categories);
        })
        .catch(error => {
            console.error('Houve um problema ao buscar as categorias:', error);
        });
}

function fillCategorySelect(categories) {
    categoryField.innerHTML = ''; // Limpa as categorias existentes
    const firstOption = document.createElement('option');
    firstOption.setAttribute('value', '');
    firstOption.setAttribute('selected', '');
    firstOption.setAttribute('disabled', '');
    firstOption.textContent = "Escolha uma categoria";
    categoryField.appendChild(firstOption);

    categories.forEach(category => {
        const newOption = document.createElement('option');
        newOption.setAttribute('value', `${category.name}`);
        newOption.textContent = category.name;
        categoryField.appendChild(newOption);
    });
}

function fillFilterSelect(categories) {
    filterField.innerHTML = ''; // Limpa as categorias existentes
    const opt1 = document.createElement('option');
    opt1.setAttribute('value', 'names');
    opt1.textContent = "Ordem alfabética";

    const opt2 = document.createElement('option');
    opt2.setAttribute('value', 'favorites');
    opt2.textContent = "Favoritos";

    filterField.append(opt1, opt2);
    categories.forEach(category => {
        const newOption = document.createElement('option');
        newOption.setAttribute('value', `${category.name}`);
        newOption.textContent = `Categoria: ${category.name}`;
        filterField.appendChild(newOption);
    });
}

function resetForm() {
    btn_edit.style.display = 'none';
    btn_add.removeAttribute('style');
    form_title.textContent = "Adicionar Novo Contato"

    addContactForm.reset();
}

function submitContact(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    addContact(getFormData())
        .then(() => {
            return fetchContacts();
        })
        .then(contacts => {
            renderContacts(contacts);
            addContactForm.reset(); // Limpa os campos do formulário
        })
        .catch(error => {
            console.error('Houve um problema ao adicionar o contato:', error);
        });
}

function getFormData(){
    const formData = new FormData(addContactForm);
    const contactData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        photo: formData.get('photo') || 'https://via.placeholder.com/100', // Foto padrão
        bio: formData.get('bio'),
        page: formData.get('page') || '', // Sem página
        category: formData.get('category'),
        favorite: formData.get('favorite') || "off"
    };
    console.log(contactData);

    return contactData;
}

// Função para buscar contatos na API
function fetchContacts() {
    return fetch('https://web01-miniprojeto04-default-rtdb.firebaseio.com/contacts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(contacts => {
            const contactsList = [];
            for (let key in contacts) {
                const contact = new Contact({
                    id: key,
                    name: contacts[key].name,
                    phone: contacts[key].phone,
                    email: contacts[key].email,
                    photo: contacts[key].photo,
                    bio: contacts[key].bio,
                    page: contacts[key].page,
                    category: contacts[key].category,
                    favorite: contacts[key].favorite
                });

                //contacts.push({ id: key, ...data[key] });
                contactsList.push(contact);
            }
            return contactsList;
        });
}

// Função para adicionar contato na API
function addContact(contactData) {
    return fetch('https://web01-miniprojeto04-default-rtdb.firebaseio.com/contacts.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }

            alert("Contato adicionado com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao adicionar o contato:', error);
        });
}

function updateModal(contactId) {
    btn_confirm.setAttribute('onclick', `removeContact('${contactId}')`);
}

function removeContact(contactId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/contacts/${contactId}.json`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            listContacts();

            var modalDelete = new bootstrap.Modal(document.getElementById('modalDelete'));
            modalDelete.hide();
            alert("Remoção realizada com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao remover o contato:', error);
        });
}

function changeForm(contactId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/contacts/${contactId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(contact => {
            nameField.value = contact.name;
            phoneField.value = contact.phone;
            emailField.value = contact.email;
            photoField.value = contact.photo;
            bioField.value = contact.bio;
            pageField.value = contact.page;
            categoryField.value = contact.category;
            favField.checked = (contact.favorite == "on") ? true : false;

            btn_add.style.display = 'none';
            btn_edit.removeAttribute('style');
            form_title.textContent = "Editar Contato"
            btn_edit.setAttribute('onclick', `submitEdition('${contactId}')`);
        })
        .catch(error => {
            console.error('Houve um problema ao recuperar informações do contato:', error);
        });
}

function submitEdition(contactId) {
    updateContact(contactId, getFormData())
        .then(() => {
            btn_edit.style.display = 'none';
            btn_add.removeAttribute('style');
            form_title.textContent = "Adicionar Novo Contato"

            listContacts();
            addContactForm.reset(); // Limpa os campos do formulário
            alert("Edição realizada com sucesso!");
        });
}

function updateContact(contactId, contactData) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/contacts/${contactId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
        })
        .catch(error => {
            console.error('Houve um problema ao editar o contato:', error);
        });
}

// Função para renderizar contatos na página
function renderContacts(contacts) {
    contactList.innerHTML = ''; // Limpa os contatos existentes

    contacts.forEach(contact => {
        const contactCard = createContactCard(contact);
        contactList.appendChild(contactCard);
    });
}

// Função para criar o card de contato
function createContactCard(contact) {
    const contactCard = document.createElement('div');
    contactCard.classList.add('card', 'mb-3');
    contactCard.setAttribute('style', 'max-width: 540px;');

    const header = document.createElement('div');
    header.classList.add('card-header', 'row', 'g-0');

    const col1 = document.createElement('div');
    col1.classList.add('col-3');

    const col2 = document.createElement('div');
    col2.classList.add('col-9', 'ml-2', 'd-flex', 'align-items-center', 'row');

    const body = document.createElement('div');
    body.classList.add('card-body');

    const photo = document.createElement('img');
    photo.classList.add('img-fluid', 'rounded', 'border', 'border-dark-subtle');
    photo.setAttribute('style', 'width:100px; height: 100px; object-fit: cover;');
    photo.src = contact.photo;
    photo.alt = contact.name;

    const card_title= document.createElement('h3');
    card_title.classList.add('card-title');

    const name = document.createElement('a');
    name.classList.add('text-dark', 'text-decoration-none');
    name.href = contact.page;
    name.target = '_blank';
    name.textContent = contact.name;

    card_title.appendChild(name);

    const category = document.createElement('div');
    category.classList.add('card-text', 'text-warning');
    category.innerHTML = `<h5>${contact.category}</h5>`;

    const phone = document.createElement('p');
    phone.classList.add('card-text');
    phone.textContent = `Telefone: ${contact.phone}`;

    const email = document.createElement('p');
    email.classList.add('card-text');
    email.textContent = `Email: ${contact.email}`;

    const bio = document.createElement('p');
    bio.classList.add('card-text');
    bio.textContent = `Descrição: ${contact.bio}`;

    const btn_group = document.createElement('div');
    btn_group.classList.add('btn-group');
    btn_group.setAttribute('role', 'group');

    const btn_remove = document.createElement('button');
    btn_remove.classList.add('btn', 'btn-secondary');
    btn_remove.setAttribute('type', 'button');
    btn_remove.setAttribute('data-bs-toggle', 'modal');
    btn_remove.setAttribute('data-bs-target', '#modalDelete');
    btn_remove.setAttribute('onclick', `updateModal('${contact.id}')`);

    btn_remove.innerHTML = "Remover";

    const btn_update = document.createElement('button');
    btn_update.classList.add('btn', 'btn-primary');
    btn_update.setAttribute('type', 'button');
    btn_update.setAttribute('onclick', `changeForm('${contact.id}')`);
    btn_update.innerHTML = "Editar";

    const btn_favorite = document.createElement('button');
    btn_favorite.classList.add('btn');
    btn_favorite.classList.add(contact.favorite == "on" ? 'btn-danger' : 'btn-success');
    btn_favorite.setAttribute('type', 'button');
    btn_favorite.setAttribute('onclick', `favoriteContact('${contact.id}')`);
    btn_favorite.innerHTML = contact.favorite == "on" ? "Desfavoritar" : "Favoritar";

    col1.appendChild(photo);
    col2.append(card_title, category);
    header.append(col1, col2);

    btn_group.append(btn_remove, btn_update, btn_favorite);
    body.append(phone, email, bio, btn_group);
    contactCard.append(header, body);

    return contactCard;
}

function favoriteContact(contactId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/contacts/${contactId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(contact => {
            contact.favorite = contact.favorite == "on" ? "off" : "on";

            updateContact(contactId, contact)
                .then(() => {
                    listContacts();
                    alert("Edição realizada com sucesso!");
                });
        })
        .catch(error => {
            console.error('Houve um problema ao recuperar informações do contato:', error);
        });
}

function filterList() {
    const filter_type = filterField.value;

    if (filter_type == "favorites") {
        filterByFavorite();
    } else if (filter_type == "names") {
        filterByName();
    } else {
        filterByCategory(filter_type);
    }
}

function filterByFavorite() {
    // Busca contatos na API
    fetchContacts()
        .then(contacts => {
            contacts = contacts.filter(contact => contact.favorite == "on");
            renderContacts(contacts);
            alert('Contatos filtrados por favoritos!');
        })
        .catch(error => {
            console.error('Houve um problema ao buscar os contatos:', error);
        });
}

function filterByName() {
    // Busca contatos na API
    fetchContacts()
        .then(contacts => {
            contacts.sort(function (a, b) {
                let nameA = a.name.toLowerCase();
                let nameB = b.name.toLowerCase();

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            });
            renderContacts(contacts);
            alert(`Contatos Ordenados por nome!`);
        })
        .catch(error => {
            console.error('Houve um problema ao buscar os contatos:', error);
        });
}

function filterByCategory(category_filter) {
    // Busca contatos na API
    fetchContacts()
        .then(contacts => {
            contacts = contacts.filter(contact => contact.category == category_filter);
            renderContacts(contacts);
            alert(`Contatos filtrados pela categoria ${category_filter}!`);
        })
        .catch(error => {
            console.error('Houve um problema ao buscar os contatos:', error);
        });
}