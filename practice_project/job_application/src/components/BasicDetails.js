import React from 'react';
import { Field, ErrorMessage } from 'formik';

const BasicDetails = () => (
  <>
    <div>
      <label>Name</label>
      <Field name="name" type="text" />
      <ErrorMessage name="name" component="div" className="error" />
    </div>
    <div>
      <label>Email</label>
      <Field name="email" type="email" />
      <ErrorMessage name="email" component="div" className="error" />
    </div>
    <div>
      <label>Address</label>
      <Field name="address" type="text" />
      <ErrorMessage name="address" component="div" className="error" />
    </div>
    <div>
      <label>Phone Number</label>
      <Field name="phone" type="text" />
      <ErrorMessage name="phone" component="div" className="error" />
    </div>
    <div>
      <label>Gender</label>
      <Field name="gender" as="select">
        <option value="">Select</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </Field>
      <ErrorMessage name="gender" component="div" className="error" />
    </div>
    <div>
      <label>State</label>
      <Field name="state" type="text" />
      <ErrorMessage name="state" component="div" className="error" />
    </div>
    <div>
      <label>City</label>
      <Field name="city" type="text" />
      <ErrorMessage name="city" component="div" className="error" />
    </div>
    <div>
      <label>Zip Code</label>
      <Field name="zipcode" type="text" />
      <ErrorMessage name="zipcode" component="div" className="error" />
    </div>
    <div>
      <label>Date of Birth</label>
      <Field name="dob" type="date" />
      <ErrorMessage name="dob" component="div" className="error" />
    </div>
  </>
);

export default BasicDetails;
