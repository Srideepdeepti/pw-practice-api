import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'
import { assert } from 'console';


test.beforeEach(async({page})=>{

  
  await page.route('*/**/api/tags', async route=>{

  
        await route.fulfill({
        body: JSON.stringify(tags)})
  
      })
// Code to MOCK API Response before browser makes request to actual url


 await page.goto('https://conduit.bondaracademy.com/')
/*  await page.waitForTimeout(3000)
 await page.getByRole('link',{name:"Sign in"}).click()
 await page.getByPlaceholder("Email").fill("srideep.deepti@test.com")
 await page.getByPlaceholder("Password").fill("Anvika@123")
 await page.getByRole('button',{name:'Sign in'}).click() */ 


})
test('validate logo text with Mock API', async ({ page }) => {

   await page.route('*//**/api/articles*', async route=>{

  const article_respone = await route.fetch()
  const response_body =  await  article_respone.json()
  response_body.articles[0].title =" Mock Sample Title"
  response_body.articles[0].description =" This is Mock test description."
  await route.fulfill({
  body: JSON.stringify(response_body)
 })
 })
   await page.getByText('Global Feed').click()

   await expect(page.locator('.navbar-brand')).toHaveText('conduit')
   await expect(page.locator('app-article-list h1').first()).toContainText(' Mock Sample Title')
   await expect(page.locator('app-article-list p').first()).toContainText(" This is Mock test description.")
   
});

test('Validate Detete Article', async({page, request})=>{

  
const createArticle_response = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
  data:{article: {title: "Deepti_Newly12_Create", description: "Deepti13-NewAnvika", body: "Deepti1333-NewAnvika", tagList: []}}
 })

const createArticle_responseBody = await createArticle_response.json()
const slug = await createArticle_responseBody.article.slug
console.log(createArticle_responseBody)
console.log(slug)
//await page.getByRole('link',{name:"Home", exact:true}).click(
//Asserti that create article is successfull
await expect(createArticle_response.status()).toEqual(201)
//Assert that article is create
await page.getByText('Global Feed').click()
await page.getByText('Deepti_Newly12_Create').click()
await page.getByRole('button',{name:"Delete Article"}).first().click()
await page.getByText('Global Feed').click()
await expect(page.locator('app-article-list h1').first()).not.toContainText('Deepti_Newly12_Create')
await page.waitForTimeout(3000)
})

test("Delete Article ethrough API", async({page,request})=>{

  await page.getByRole('link',{name:"New Article"}).click()
  await page.getByPlaceholder('Article Title').fill("Playwright123 Sample")
  await page.getByPlaceholder("What's this article about?").fill("Playwright123 Sample -Article About")
  await page.getByPlaceholder("Write your article (in markdown)").fill("Playwright Sample -Markdown")
  await page.getByPlaceholder("Enter tags").fill("Playwrigh@tags")
  await page.getByRole('button',{name:' Publish Article '}).click()
  const response1 =await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const response_json = await response1.json()
  const slug_id = await response_json.article.slug
  console.log(slug_id)



  //Assert that new Artcle gets created
  await page.getByText('Home').click()
  await page.getByText('Global Feed').click()
 await expect(page.locator('app-article-list h1').first()).toContainText("Playwright123 Sample")
  
 const response2 = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
  data:{"user": {"email":"srideep.deepti@test.com", "password":"Anvika@123"}}
  })

 const response_body = await response2.json()

 const deleteArticle_response = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug_id}`)

// page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

 //Assertion that Delete API is successfull

 await expect(deleteArticle_response.status()).toEqual(204)

 await page.getByText('Home').click()
 await page.getByText('Global Feed').click()
 await page.waitForTimeout(2000)
 await expect(page.locator('app-article-list h1').first()).not.toContainText("Playwright123 Sample")
 


})