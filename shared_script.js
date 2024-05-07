class Category {
    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }
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