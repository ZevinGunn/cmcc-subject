export async function accountMenu(page,phone){
 if(!await page.locator('.account-menu-trigger').count())await page.getByRole('button',{name:'账号管理',exact:true}).click();
 await (phone?page.getByRole('button',{name:phone+'功能菜单',exact:true}):page.locator('.account-menu-trigger').first()).click();
}
export async function numberView(page,name,phone){await accountMenu(page,phone);await page.getByRole('menuitem',{name,exact:true}).click();}
export async function logoutNumber(page){await accountMenu(page);await page.getByRole('menuitem',{name:'退出登录',exact:true}).click();}
