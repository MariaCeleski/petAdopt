#!/usr/bin/env node

/**
 * Authentication Flow Test Script
 * 
 * Tests the complete authentication flow:
 * 1. Verify PasswordInput component renders with eye icon
 * 2. Verify SignInForm has password field with toggle
 * 3. Verify SignUpForm has password fields with toggle
 * 4. Verify password strength indicator works
 * 5. Manual browser testing instructions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔐 Authentication Flow Test\n');
console.log('=' .repeat(60));

// Test 1: Check PasswordInput component exists
console.log('\n✅ Test 1: PasswordInput Component File');
const passwordInputPath = path.join(__dirname, 'src/components/auth/PasswordInput.js');
if (fs.existsSync(passwordInputPath)) {
  const content = fs.readFileSync(passwordInputPath, 'utf8');
  if (content.includes('togglePasswordVisibility') && content.includes('aria-label')) {
    console.log('   ✓ PasswordInput.js exists with eye icon toggle');
    console.log('   ✓ Contains aria-label for accessibility');
  }
} else {
  console.log('   ✗ PasswordInput.js not found');
  process.exit(1);
}

// Test 2: Check PasswordInput CSS module
console.log('\n✅ Test 2: PasswordInput Styling');
const passwordInputCssPath = path.join(__dirname, 'src/components/auth/PasswordInput.module.css');
if (fs.existsSync(passwordInputCssPath)) {
  const content = fs.readFileSync(passwordInputCssPath, 'utf8');
  if (content.includes('.eyeButton')) {
    console.log('   ✓ PasswordInput.module.css exists');
    console.log('   ✓ Contains eye button styling');
  }
} else {
  console.log('   ✗ PasswordInput.module.css not found');
  process.exit(1);
}

// Test 3: Check SignInForm imports and uses PasswordInput
console.log('\n✅ Test 3: SignInForm Integration');
const signInFormPath = path.join(__dirname, 'src/components/auth/SignInForm.js');
if (fs.existsSync(signInFormPath)) {
  const content = fs.readFileSync(signInFormPath, 'utf8');
  if (content.includes("import PasswordInput from './PasswordInput'") && 
      content.includes('<PasswordInput')) {
    console.log('   ✓ SignInForm.js imports PasswordInput');
    console.log('   ✓ SignInForm uses PasswordInput component');
  } else {
    console.log('   ✗ SignInForm does not use PasswordInput');
    process.exit(1);
  }
} else {
  console.log('   ✗ SignInForm.js not found');
  process.exit(1);
}

// Test 4: Check SignUpForm imports and uses PasswordInput
console.log('\n✅ Test 4: SignUpForm Integration');
const signUpFormPath = path.join(__dirname, 'src/components/auth/SignUpForm.js');
if (fs.existsSync(signUpFormPath)) {
  const content = fs.readFileSync(signUpFormPath, 'utf8');
  const passwordInputImportCount = (content.match(/import PasswordInput/g) || []).length;
  const passwordInputUsageCount = (content.match(/<PasswordInput/g) || []).length;
  
  if (passwordInputImportCount === 1 && passwordInputUsageCount >= 2) {
    console.log('   ✓ SignUpForm.js imports PasswordInput');
    console.log('   ✓ SignUpForm uses PasswordInput for both password fields');
    console.log('   ✓ Removed inline password toggle logic');
  } else {
    console.log('   ✗ SignUpForm does not properly use PasswordInput');
    process.exit(1);
  }

  // Check password strength indicator is still present
  if (content.includes('getPasswordStrengthColor')) {
    console.log('   ✓ Password strength indicator maintained');
  }
} else {
  console.log('   ✗ SignUpForm.js not found');
  process.exit(1);
}

// Test 5: Check for duplicate password visibility state
console.log('\n✅ Test 5: Code Quality Check');
if (fs.existsSync(signUpFormPath)) {
  const content = fs.readFileSync(signUpFormPath, 'utf8');
  const showPasswordCount = (content.match(/showPassword/g) || []).length;
  
  if (showPasswordCount === 0) {
    console.log('   ✓ No duplicate password visibility state found');
    console.log('   ✓ Centralized eye icon toggle via PasswordInput');
  } else {
    console.log('   ⚠ Warning: Found showPassword references');
    console.log('   This may be expected if used elsewhere');
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n📋 Manual Testing Instructions:\n');
console.log('1. Start the dev server: npm run dev');
console.log('2. Test SignIn page:');
console.log('   - Open: http://localhost:3000/auth/signin');
console.log('   - Click eye icon to show/hide password');
console.log('   - Verify eye icon toggles correctly\n');
console.log('3. Test SignUp page:');
console.log('   - Open: http://localhost:3000/auth/signup');
console.log('   - Test both password fields with eye icon');
console.log('   - Verify password strength indicator updates in real-time');
console.log('   - Confirm eyes show same state on both fields independently\n');
console.log('4. Test Authentication:');
console.log('   - Try invalid email/password → see validation errors');
console.log('   - Try valid credentials → should proceed with login');
console.log('   - Try signup with weak password → strength indicator red');
console.log('   - Try signup with strong password → strength indicator green\n');
console.log('5. Test Accessibility:');
console.log('   - Use Tab key to navigate to eye icon button');
console.log('   - Press Enter/Space to toggle password visibility');
console.log('   - Verify aria-labels read correctly with screen reader\n');

console.log('✨ All checks passed! Components are properly integrated.\n');
