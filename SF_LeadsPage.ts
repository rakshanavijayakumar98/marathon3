import { SfHomepage } from "./SF_HomePage";

export class LeadsPage extends SfHomepage{

    async NewLeads(){
        await this.page.locator("//div[text()='New']").click()
    }
    async DeleteLeads(){
    await this.page.locator("//span[text()='Show Actions']").first().click() //click on dropdown
    await this.page.locator("//div[text()='Delete']").click() //select delete option from the dropdown
    await this.page.locator("//span[text()='Delete']").click()
    }
    async SearchLead(LeadName:any){
        await this.page.getByPlaceholder("Search this list...").fill(LeadName)
        await this.page.keyboard.press("Enter")
        await this.page.waitForTimeout(4000)
    }

}