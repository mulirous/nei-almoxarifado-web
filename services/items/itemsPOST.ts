import { useApi } from "../../composables/axios";
//Cadastra um item
export const postCreateItem = async (userStore ,name, sipac, qtd, type, minimumStock) => {
    const { data } = await useApi().post('/operacoes/cadastro', {
        'name': name,
        'sipacCode': sipac,
        'quantity': qtd,
        'type': type,
        'minimumStockLevel': minimumStock
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userStore.token}`
        },
    });
};