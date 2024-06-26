import fs from 'fs';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
    try {
        const itemsRes:H3Event<EventHandlerRequest> = await readBody(event);
        fs.writeFile('static/data.json', JSON.stringify(itemsRes.items, null, 2), 'utf-8', (err) => {
            if (err) return console.log('An error happened', err)
        });
        return { 
            status: 200, 
            body: 1
        };
    } catch (error) {
        return { 
            status: 500, 
            body: { error: 'Erro interno do servidor' } 
        };
    }
});


  