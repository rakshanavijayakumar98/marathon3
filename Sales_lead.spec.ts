import {test,expect} from '@playwright/test'
import { LeadsPage } from '../Pages/SF_LeadsPage'

let accessToken1:any //global variable created for access_token, instance_url, token_type, id
let insUrl:any
let typeToken:any
let sysId:any

test.use({storageState:"Data/SFLogin.json"})

test("Generate the token",async({request})=>{ //generating the token
    let token1=await request.post("https://login.salesforce.com/services/oauth2/token",{
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "Connection":"keep-alive"
        },
        form:{
            "grant_type":"password",
            "username":"rakshanaabinesh.de5abe8db387@agentforce.com",
            "password":"Siddarth@98yqa3QWSBKkP5gKvF1VCDldrqu",
        }
    }
)
let genResponse=await token1.json()
console.log(genResponse)
accessToken1=genResponse.access_token
insUrl=genResponse.instance_url
typeToken=genResponse.token_type

console.log(accessToken1)
console.log(insUrl)
})

test("Create Lead",async({request})=>{ //create lead
    let createLead=await request.post(`${insUrl}/services/data/v64.0/sobjects/Lead/`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${typeToken} ${accessToken1}`
        },
        data:{
            "FirstName": "Raks",
            "LastName": "v",
            "Salutation": "Mrs.",
            "Company": "Test",
            "Status": "Working - Contacted"
        }
    })
let successRes=await createLead.json()
console.log(successRes)
sysId= successRes.id
console.log(sysId)
expect(createLead.status()).toBe(201)
})

test("Get the Lead details",async({request})=>{ //fetching the lead details
    let getLead=await request.get(`${insUrl}/services/data/v64.0/sobjects/Lead/${sysId}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${typeToken} ${accessToken1}`
        }
    })
let getLeadRes=await getLead.json()
console.log(getLeadRes)
expect(getLead.status()).toBe(200)
})

test("Update the first name using Patch",async({request})=>{ //updating lead's firstname using patch method
    let updateName=await request.patch(`${insUrl}/services/data/v64.0/sobjects/Lead/${sysId}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`${typeToken} ${accessToken1}`
        },
        data:{
            "FirstName": "Raks adobe"
        }
    })
expect(updateName.status()).toBe(204)
})

test("Delete the lead through UI",async({page})=>{ //delete the lead
    const cl=new LeadsPage(page)
    await page.goto("https://orgfarm-c072b0ad98-dev-ed.develop.lightning.force.com/lightning/page/home")//used storage state to save the login
    await cl.ClickLeads()
    await page.waitForTimeout(3000)
    await cl.DeleteLeads()//click on delete in confirmation popup
    await cl.SearchLead("Raks adobe")
    let Message= await page.locator("//p[@class='slds-text-heading_medium']").textContent()
    expect(Message).toBe("Nothing to see here")
    console.log("Lead deleted successfully")
})