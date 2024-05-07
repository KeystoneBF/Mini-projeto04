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