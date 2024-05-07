class Contact {
    constructor({ id, name, phone, email, photo }) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.photo = photo;
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

document.addEventListener('DOMContentLoaded', function () {
    listContacts();
    addCategoryOptions();
});

// Event listener para o envio do formulário
addContactForm.addEventListener('submit', submitContact);

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

function submitContact(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const formData = new FormData(addContactForm);
    const contactData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        photo: formData.get('photo') || 'https://via.placeholder.com/100', // Foto padrão
        bio: formData.get('bio'),
        page: formData.get('page'),
        category: formData.get('category'),
        favorite: formData.get('favorite'),
    };
    console.log(contactData);

    addContact(contactData)
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

// Função para buscar contatos na API
function fetchContacts() {
    //return fetch('https://imd0404-webi-default-rtdb.firebaseio.com/contacts.json')
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
    //return fetch('https://imd0404-webi-default-rtdb.firebaseio.com/contacts.json', {
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
            console.log(`Contato recuperado: ${contact}`);

            nameField.value = contact.name;
            phoneField.value = contact.phone;
            emailField.value = contact.email;
            photoField.value = contact.photo;
            bioField.value = contact.bio;
            pageField.value = contact.page;
            categoryField.value = contact.category;
            favField.checked = (contact.favorite == "on") ? true : false;

            const formData = new FormData(addContactForm);

            btn_add.style.display = 'none';
            btn_edit.removeAttribute('style');
            form_title.textContent = "Editar Contato"
            btn_edit.setAttribute('onclick', `updateContact('${contactId}')`);
        });
}

function updateContact(contactId) {
    const formData = new FormData(addContactForm);
    const contactData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        photo: formData.get('photo') || 'https://via.placeholder.com/100', // Foto padrão
        bio: formData.get('bio'),
        page: formData.get('page'),
        category: formData.get('category'),
        favorite: formData.get('favorite')
    };

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
            btn_edit.style.display = 'none';
            btn_add.removeAttribute('style');
            form_title.textContent = "Adicionar Contato"

            listContacts();
            addContactForm.reset(); // Limpa os campos do formulário
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
    contactCard.classList.add('card');
    contactCard.classList.add('mb-3');
    contactCard.classList.add('my-4');
    contactCard.setAttribute('style', 'max-width: 540px;');

    const header = document.createElement('div');
    header.classList.add('card-header');
    header.classList.add('row');
    header.classList.add('g-0');

    const col1 = document.createElement('div');
    col1.classList.add('col-2');

    const col2 = document.createElement('div');
    col2.classList.add('col-10');
    col2.classList.add('d-flex');
    col2.classList.add('align-items-center');

    const body = document.createElement('div');
    body.classList.add('card-body');

    const photo = document.createElement('img');
    photo.classList.add('img-fluid');
    photo.classList.add('rounded');
    photo.src = contact.photo;
    photo.alt = contact.name;

    const name = document.createElement('h3');
    name.classList.add('card-title');
    name.textContent = contact.name;

    const phone = document.createElement('p');
    phone.classList.add('card-text');
    phone.textContent = `Telefone: ${contact.phone}`;

    const email = document.createElement('p');
    email.classList.add('card-text');
    email.textContent = `Email: ${contact.email}`;

    const btn_group = document.createElement('div');
    btn_group.classList.add('btn-group');
    btn_group.setAttribute('role', 'group');

    const btn_remove = document.createElement('button');
    btn_remove.setAttribute('type', 'button');
    btn_remove.classList.add('btn');
    btn_remove.classList.add('btn-danger');
    btn_remove.setAttribute('data-bs-toggle', 'modal');
    btn_remove.setAttribute('data-bs-target', '#modalDelete');
    btn_remove.setAttribute('onclick', `updateModal('${contact.id}')`);

    btn_remove.innerHTML = "Remover";

    const btn_update = document.createElement('button');
    btn_update.setAttribute('type', 'button');
    btn_update.classList.add('btn');
    btn_update.classList.add('btn-primary');
    btn_update.setAttribute('onclick', `changeForm('${contact.id}')`);
    btn_update.innerHTML = "Editar";

    col1.appendChild(photo);
    col2.appendChild(name);
    header.appendChild(col1);
    header.appendChild(col2);
    btn_group.appendChild(btn_remove);
    btn_group.appendChild(btn_update);

    body.appendChild(phone);
    body.appendChild(email);
    body.appendChild(btn_group);

    contactCard.appendChild(header);
    contactCard.appendChild(body);

    return contactCard;
}