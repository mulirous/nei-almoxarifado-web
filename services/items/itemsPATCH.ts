import { useApi } from "../../composables/axios";

export const patchItem = async(userStore, itemId, minimumStockLevel) => {
    try{
        const { data } = await useApi().patch(`/itens/${itemId}`, {
            'minimumStockLevel': minimumStockLevel
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userStore.token}`
            },
        });
        return data
    } catch(err){
        throw new Error(err)
        return false
    }
}