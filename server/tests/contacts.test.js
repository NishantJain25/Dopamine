const request = require('supertest')
const baseURL = "http://localhost:3005/api"
const crypto = require('crypto')
const { default: mongoose } = require('mongoose')

//create new contact (testing for already existing contact)
describe("POST /contacts/create", () => {
    const newContact = {
        _id: crypto.randomUUID(),
        name: "Nishant Jain",
        phones: [
            {number: "9820871209",type: "Home", countryCode: "+91"}
        ]
    }
    afterAll(async () => {
        await request(baseURL).post("/contacts/delete").send(newContact._id)
    })
    it("should create and return new document", async () => {
        const response = await request(baseURL).post("/contacts/create").send(newContact)
       
        expect(["Contact already exists","Phone number already exists"]).toContain(response.body.error)
        
    })
})
//Get all contacts
describe("GET /contacts/getAllContacts", () => {
    const newContact = {
        _id: crypto.randomUUID(),
        name: "Nishant",
        phones: [
            {number: "9820871209",type: "Home", countryCode: "+91"}
        ]
    }
    beforeAll(async() => {
        await request(baseURL).post("/contacts/create").send(newContact)
    })
    afterAll(async () => {
        await request(baseURL).post("/contacts/delete").send(newContact._id)
    })
    it("should return new document", async () => {
        const response = await request(baseURL).get("/contacts/getAllContacts")
        expect(response.body.error).toBe(undefined)
        expect(response.body.message).toBe("Contacts fetched successfully")
    })
})

//Get contact by id
describe("GET /contacts/getContactById/:id", () => {
    const objectId = new mongoose.Types.ObjectId(crypto.randomBytes(12))
    const newContact = {
        _id: objectId,
        name: "Nishant",
        phones: [
            {number: "9820871209",type: "Home", countryCode: "+91"}
        ]
    }
    beforeAll(async() => {
        await request(baseURL).post("/contacts/create").send(newContact)
    })
    afterAll(async () => {
        await request(baseURL).post("/contacts/delete").send(newContact._id)
    })
    it("should return existing contact by id", async () => {
        const response = await request(baseURL).get(`/contacts/getContactById/${newContact._id}`)
       
        expect(response.statusCode).toBe(200)
        expect(response.body.error).toBe(undefined)
    })
})

// search contact by name
describe("GET /contacts/search", () => {
    const objectId = new mongoose.Types.ObjectId(crypto.randomBytes(12))
    const newContact = {
        _id: objectId,
        name: "Nishant",
        phones: [
            {number: "9820871209",type: "Home", countryCode: "+91"}
        ]
    }
    beforeAll(async() => {
        await request(baseURL).post("/contacts/create").send(newContact)
    })
    afterAll(async () => {
        await request(baseURL).post("/contacts/delete").send(newContact._id)
    })
    it("should return all contacts with query string in the name", async () => {
        const response = await request(baseURL).get(`/contacts/search?q=ni`)
        
        expect(response.statusCode).toBe(200)
        expect(response.body.error).toBe(undefined)
        expect(response.body.message).toBe("Contacts searched successfully")
    })
})


// update contact
describe("POST /contacts/update", () => {
    const objectId = new mongoose.Types.ObjectId(crypto.randomBytes(12))
    const newContact = {
        _id: objectId,
        name: "Nishant Jain",
        phones: [
            {number: "9820872578",type: "Home", countryCode: "+91"}
        ]
    }
    beforeAll(async() => {
        await request(baseURL).post("/contacts/create").send(newContact)
    })
    afterAll(async () => {
        await request(baseURL).post("/contacts/delete").send(newContact._id)
    })
    it("should update contact info", async () => {
        const userResponse = await request(baseURL).get(`/contacts/getContactById/653a704c8099ffcdab9800cf`)
        const user = userResponse.body.contact
        
        user.name = "John Doe"
        const response = await request(baseURL).post(`/contacts/update`).send({contactInfo: user})
        
        expect(response.body.error).toBe(undefined)
        expect(response.body.message).toBe("Contact updated successfully")
    })
})

//delete contact 
describe("POST /contacts/delete", () => {
    const objectId = new mongoose.Types.ObjectId(crypto.randomBytes(12))
    const newContact = {
        _id: objectId,
        name: "Nishant",
        phones: [
            {number: "9820871209",type: "Home", countryCode: "+91"}
        ]
    }
    beforeAll(async() => {
        await request(baseURL).post("/contacts/create").send(newContact)
    })
    
    it("should delete one contact by id", async () => {
        const response = await request(baseURL).post("/contacts/delete").send(newContact._id)
        
       
        expect(response.body.error).toBe(undefined)
        expect(response.body.message).toBe("Contact deleted successfully")
    })
})

