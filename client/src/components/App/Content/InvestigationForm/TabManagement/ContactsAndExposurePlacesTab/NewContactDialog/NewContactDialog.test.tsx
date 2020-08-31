import React from 'react';

describe('Contact Addition Card', () => {
   describe('Field Tests', () => {
      it('Filling the name field should make the phone field required', () => {});
      describe('Field Validation Tests', () => {
          describe('ID Field tests', () => {
              it('ID field cant contain letters', () => {});
              it('ID field cant contain special chars', () => {});
              it('ID field needs to be 9 characters long', () => {});
          });
          describe('Phone Field tests', () => {
              it('Phone field cant contain letters', () => {});
              it('Phone field cant contain special chars', () => {});
              it('Phone field needs to be 9/10 characters long', () => {});
          });
          describe('Name Field tests', () => {
              it('Name field cant contain numbers', () => {});
              it('Name field cant contain special chars', () => {});
          });
      });
      it('If name field is filled and phone is empty `add contact` button should be disabled', () => {});
      it('If name field is filled and phone is empty `save contact` button should be disabled', () => {});
   });
});