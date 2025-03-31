import request  from "supertest";
import server from "../../server";
import e from "express";

describe('POST /api/products', () => {
    it('should display validation errors', async () => {
        const res = await request(server).post('/api/products').send({})
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(4);
        
        expect(res.status).not.toBe(404);
        expect(res.body.errors).not.toHaveLength(2);

    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Curvo",
            price: 0
        })
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        
        expect(res.status).not.toBe(404);
        expect(res.body.errors).not.toHaveLength(2);

    })

    it('should validate that the price is a number and greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: "Monitor Curvo",
            price: "Hola"
        })
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(2);
        
        expect(res.status).not.toBe(404);
        expect(res.body.errors).not.toHaveLength(4);

    })


    it('should create a new product', async () => {
        const res = await request(server).post('/api/products').send({
            name: "TV test",
            price: 10
        })
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.status).not.toBe(404);
        expect(res.status).not.toBe(200);
        expect(res.body).not.toHaveProperty('errors');

    });
});

describe('GET /api/products', () => {
    it('should check if api/products returns a JSON response', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).not.toBe(404);
    })
    
            



    it('GET a JSON response with products', async () => {
        const res = await request(server).get('/api/products')
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(1);

        expect(res.body).not.toHaveProperty('errors');
        expect(res.status).not.toBe(404);

        
    });
});


describe('GET /api/products/:id', () => {
    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000;
        const res = await request(server).get(`/api/products/${productId}`);
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Producto no encontrado');
    })
    it('should check a valid ID in the URL', async () => {
        const res = await request(server).get('/api/products/not-valid-url');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toHaveLength(1);
            expect(res.body.errors[0].msg).toBe('Id no valido');
    })
    it('GET a JSON response for a single product', async () => {
        const res = await request(server).get('/api/products/1');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('data');
       
    })
});

describe('PUT /api/products/:id', () => {

    it('should check a valid ID in the URL', async () => {
        const response = await request(server)
                            .put('/api/products/not-valid-url')
                            .send({
                                name: "Monitor Curvo",
                                availability: true,
                                price : 300,
                            })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    it('should display validation error messages when updating a product', async() => {
        const response = await request(server).put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should validate that the price is greater than 0', async() => {
        const response = await request(server)
                                .put('/api/products/1')
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price : 0
                                })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('El precio debe ser mayor a 0')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should return a 404 response for a non-existent product', async() => {
        const productId = 2000
        const response = await request(server)
                                .put(`/api/products/${productId}`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price : 300
                                })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    }) 

    it('should update an existing product with valid data', async() => {
        const response = await request(server)
                                .put(`/api/products/1`)
                                .send({
                                    name: "Monitor Curvo",
                                    availability: true,
                                    price : 300
                                })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
    }) 
    

})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request(server).patch('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('Id no valido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto Eliminado")

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})