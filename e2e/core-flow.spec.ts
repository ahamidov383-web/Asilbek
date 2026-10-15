import { test, expect } from '@playwright/test';

test.describe('Core Business Flow', () => {
  test('complete tourist-agency-admin flow', async ({ page }) => {
    // Step 1: Register tourist
    await page.goto('/register');
    await page.click('button:has-text("Turist")');
    await page.fill('input[placeholder="Ismingiz Familyangiz"]', 'Test Tourist');
    await page.fill('input[type="email"]', 'newtourist@test.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.fill('input[placeholder="••••••••"]:nth-of-type(2)', 'Password123');
    await page.click('button:has-text("Ro\'yxatdan o\'tish")');
    
    // Wait for success message
    await expect(page.locator('text=Muvaffaqiyatli')).toBeVisible({ timeout: 10000 });

    // Step 2: Login as tourist and create request
    await page.goto('/login');
    await page.click('button:has-text("Turist")');
    await page.fill('input[type="email"]', 'tourist@test.com');
    await page.fill('input[type="password"]', 'tourist123');
    await page.click('button:has-text("Kirish")');
    
    // Wait for redirect to home
    await page.waitForURL('**/');
    
    // Navigate to request page
    await page.goto('/request');
    await page.fill('input[type="number"]', '1500');
    await page.fill('input[placeholder*="Tarix"]', 'History, Culture');
    await page.fill('input[type="date"]:first-of-type', '2026-06-01');
    await page.fill('input[type="date"]:nth-of-type(2)', '2026-06-10');
    await page.click('button:has-text("So\'rov yuborish")');
    
    // Wait for success
    await expect(page.locator('text=So\'rov yuborildi')).toBeVisible({ timeout: 10000 });

    // Step 3: Register agency
    await page.goto('/register');
    await page.click('button:has-text("Agentlik")');
    await page.fill('input[placeholder*="Silk Road"]', 'Test Agency');
    await page.fill('input[placeholder="Ismingiz Familyangiz"]', 'Agency Owner');
    await page.fill('input[type="email"]', 'newagency@test.com');
    await page.fill('input[type="password"]', 'Password123');
    await page.fill('input[placeholder="••••••••"]:nth-of-type(2)', 'Password123');
    await page.check('input[type="checkbox"]');
    await page.click('button:has-text("Ariza yuborish")');
    
    await expect(page.locator('text=Muvaffaqiyatli')).toBeVisible({ timeout: 10000 });

    // Step 4: Admin approves agency
    await page.goto('/login');
    await page.click('button:has-text("Admin")');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Kirish")');
    
    await page.waitForURL('**/admin');
    
    // Find and approve pending agency
    const approveButton = page.locator('button:has-text("Tasdiqlash")').first();
    if (await approveButton.isVisible()) {
      await approveButton.click();
      await expect(page.locator('text=Tasdiqlangan')).toBeVisible({ timeout: 5000 });
    }

    // Step 5: Agency sends offer
    await page.goto('/login');
    await page.click('button:has-text("Agentlik")');
    await page.fill('input[type="email"]', 'agency@test.com');
    await page.fill('input[type="password"]', 'agency123');
    await page.click('button:has-text("Kirish")');
    
    await page.waitForURL('**/dashboard');
    await page.goto('/dashboard/offers');
    
    // Send offer if pending requests exist
    const sendOfferButton = page.locator('button:has-text("Taklif yuborish")').first();
    if (await sendOfferButton.isVisible()) {
      await sendOfferButton.click();
      await page.fill('input[type="number"]', '1200');
      await page.fill('textarea', 'We offer a comprehensive tour package with experienced guides');
      await page.click('button:has-text("Taklif yuborish")');
      await expect(page.locator('text=Taklif muvaffaqiyatli')).toBeVisible({ timeout: 5000 });
    }

    // Step 6: Tourist accepts offer
    await page.goto('/login');
    await page.click('button:has-text("Turist")');
    await page.fill('input[type="email"]', 'tourist@test.com');
    await page.fill('input[type="password"]', 'tourist123');
    await page.click('button:has-text("Kirish")');
    
    await page.waitForURL('**/');
    await page.goto('/requests');
    
    // Accept offer if available
    const acceptButton = page.locator('button:has-text("Qabul qilish")').first();
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
      // Confirm in modal
      await page.click('button:has-text("Tasdiqlash")');
      await expect(page.locator('text=Qabul qilingan')).toBeVisible({ timeout: 5000 });
    }
  });

  test('role-based access control', async ({ page }) => {
    // Test tourist cannot access agency dashboard
    await page.goto('/login');
    await page.click('button:has-text("Turist")');
    await page.fill('input[type="email"]', 'tourist@test.com');
    await page.fill('input[type="password"]', 'tourist123');
    await page.click('button:has-text("Kirish")');
    
    await page.waitForURL('**/');
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);

    // Test tourist cannot access admin panel
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*login/);

    // Test agency can access dashboard
    await page.goto('/login');
    await page.click('button:has-text("Agentlik")');
    await page.fill('input[type="email"]', 'agency@test.com');
    await page.fill('input[type="password"]', 'agency123');
    await page.click('button:has-text("Kirish")');
    
    await page.waitForURL('**/dashboard');
    await expect(page.locator('text=Boshqaruv paneli')).toBeVisible();

    // Test agency cannot access admin panel
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*login/);

    // Test admin can access admin panel
    await page.goto('/login');
    await page.click('button:has-text("Admin")');
    await page.fill('input[type="email"]', 'admin@test.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Kirish")');
    
    await page.waitForURL('**/admin');
    await expect(page.locator('text=Admin Panel')).toBeVisible();
  });
});

test.describe('Public Pages', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Visit Uzbekistan')).toBeVisible();
  });

  test('places page loads with map', async ({ page }) => {
    await page.goto('/places');
    await expect(page.locator('text=Diqqatga sazovor joylar')).toBeVisible();
    // Wait for map to load
    await page.waitForTimeout(2000);
    await expect(page.locator('.leaflet-container')).toBeVisible();
  });

  test('restaurants page loads', async ({ page }) => {
    await page.goto('/restaurants');
    await expect(page.locator('text=Restoranlar')).toBeVisible();
  });

  test('agencies page loads', async ({ page }) => {
    await page.goto('/agencies');
    await expect(page.locator('text=Agentliklar')).toBeVisible();
  });
});
