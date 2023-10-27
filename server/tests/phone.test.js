const request = require('supertest')
const baseURL = "https://dopamine-test-api.vercel.app/api"
const crypto = require('crypto')
const { default: mongoose } = require('mongoose')


// search contact by phone number
describe("GET /phone/search", () => {
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
    it("should return all contacts with query string in the phone number", async () => {
        const response = await request(baseURL).get(`/phone/search?q=982`)
        
        
        expect(response.body.error).toBe(undefined)
        expect(response.body.message).toBe("Contacts searched successfully")
    })
})


// delete phone number
describe("POST /phone/delete", () => {
    
    it("should return deleted number", async () => {
        const searchResponse = await request(baseURL).get(`/phone/search?q=98`)
        console.log(searchResponse.body.contacts[0]._id)
        const response = await request(baseURL).post("/phone/delete").send({phoneId: searchResponse.body.contacts[0]._id})
        expect(response.body.error).toBe(undefined)
        expect(response.body.message).toBe("Number deleted successfully")
    })
})
