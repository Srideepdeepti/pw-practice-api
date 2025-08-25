import {test as setup} from '@playwright/test'
import user from '../.auth/user.json'
import fs, { writeFileSync } from'fs'

const auth_File ='.auth/user.json'
setup('authentication', async({page, request})=>{

 await page.goto('https://conduit.bondaracademy.com/')
 await page.waitForTimeout(3000)

 //Login through UI
/*  await page.getByRole('link',{name:"Sign in"}).click()
 await page.getByPlaceholder("Email").fill("srideep.deepti@test.com")
 await page.getByPlaceholder("Password").fill("Anvika@123")
 await page.getByRole('button',{name:'Sign in'}).click()
 await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags') */
 //Save this state

 //Loging through API

 const response_login = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
  data:{"user": {"email":"srideep.deepti@test.com", "password":"Anvika@123"}}
  })
  const response_json = await response_login.json()
  user.origins[0].localStorage[0].value = await response_json.user.token
 await page.context().storageState({path: auth_File})
 fs.writeFileSync(auth_File,JSON.stringify(user))
 process.env['ACCESS_TOKEN']= await response_json.user.token

    
})