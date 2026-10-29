const {test}=require('node:test');const assert=require('node:assert/strict');
const {validateSignup}=require('../database/signup-validation');
const receipt='72522c2b-7db0-400c-9e35-14e7f2b981d7';
test('results signup normalises email and requires separate consent and receipt',()=>{
  assert.deepEqual(validateSignup({email:'  TEST@Example.com ',consent:true,receipt}),{email:'test@example.com',receipt});
  assert.ok(validateSignup({email:'test@example.com',receipt}).error);
  assert.ok(validateSignup({email:'test@example.com',consent:true,receipt:'bad'}).error);
});
test('results signup rejects malformed and oversized email',()=>{
  for(const email of ['x','a@b','a b@example.com','<a>@example.com','a@b.com\nx','a'.repeat(250)+'@example.com',null])assert.ok(validateSignup({email,consent:true,receipt}).error);
});
