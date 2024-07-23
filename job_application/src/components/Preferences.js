import React from 'react';
import { Field, ErrorMessage } from 'formik';

const Preferences = () => (
  <>
    <div>
      <label>Preferred Location</label>
      <Field name="preferences.location" type="text" />
      <ErrorMessage name="preferences.location" component="div" className="error" />
    </div>
    <div>
      <label>Department</label>
      <Field name="preferences.department" type="text" />
      <ErrorMessage name="preferences.department" component="div" className="error" />
    </div>
    <div>
      <label>Notice Period</label>
      <Field name="preferences.noticePeriod" type="text" />
      <ErrorMessage name="preferences.noticePeriod" component="div" className="error" />
    </div>
    <div>
      <label>Expected CTC</label>
      <Field name="preferences.expectedCTC" type="number" />
      <ErrorMessage name="preferences.expectedCTC" component="div" className="error" />
    </div>
    <div>
      <label>Current CTC</label>
      <Field name="preferences.currentCTC" type="number" />
      <ErrorMessage name="preferences.currentCTC" component="div" className="error" />
    </div>
  </>
);

export default Preferences;
