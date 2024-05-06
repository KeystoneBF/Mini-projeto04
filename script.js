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

document.addEventListener('DOMContentLoaded', listContacts);

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

function submitContact(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const formData = new FormData(addContactForm);
    const contactData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        photo: formData.get('photo') || 'https://via.placeholder.com/100', // Foto padrão
    };

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
                    photo: contacts[key].photo
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

    col1.appendChild(photo);
    col2.appendChild(name);
    header.appendChild(col1);
    header.appendChild(col2);

    body.appendChild(phone);
    body.appendChild(email);

    contactCard.appendChild(header);
    contactCard.appendChild(body);

    return contactCard;
}