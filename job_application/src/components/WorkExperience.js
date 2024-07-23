import React, { useState } from 'react';
import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';

const WorkExperience = () => {
  const { values, setFieldTouched, validateForm } = useFormikContext();
  const [error, setError] = useState('');

  const validateAndAdd = (push) => {
    let valid = true;

    values.workExperience.forEach((entry, index) => {
      if (!entry.companyName || !entry.designation || !entry.fromDate || !entry.toDate) {
        valid = false;
        setFieldTouched(`workExperience.${index}.companyName`, true, false);
        setFieldTouched(`workExperience.${index}.designation`, true, false);
        setFieldTouched(`workExperience.${index}.fromDate`, true, false);
        setFieldTouched(`workExperience.${index}.toDate`, true, false);
      }
    });

    validateForm().then((errors) => {
      if (valid && Object.keys(errors.workExperience || {}).length === 0) {
        push({ companyName: '', designation: '', fromDate: '', toDate: '' });
        setError('');
      } else {
        setError('Please fill all fields before adding a new entry.');
      }
    });
  };
  return(
    <FieldArray name="workExperience">
      {({ push, remove, form }) => (
        <>
          {form.values.workExperience.map((_, index) => (
            <div key={index}>
              <div>
                <label>Company Name</label>
                <Field name={`workExperience.${index}.companyName`} type="text" />
                <ErrorMessage name={`workExperience.${index}.companyName`} component="div" className="error" />
              </div>
              <div>
                <label>Designation</label>
                <Field name={`workExperience.${index}.designation`} type="text" />
                <ErrorMessage name={`workExperience.${index}.designation`} component="div" className="error" />
              </div>
              <div>
                <label>From Date</label>
                <Field name={`workExperience.${index}.fromDate`} type="date" />
                <ErrorMessage name={`workExperience.${index}.fromDate`} component="div" className="error" />
              </div>
              <div>
                <label>To Date</label>
                <Field name={`workExperience.${index}.toDate`} type="date" />
                <ErrorMessage name={`workExperience.${index}.toDate`} component="div" className="error" />
              </div>
              {form.values.workExperience.length > 1 && (
                <button type="button" onClick={() => remove(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => validateAndAdd(push)}>
            Add WorkExperience
          </button>
          {error && <div className="error">{error}</div>}
        </>
      )}
    </FieldArray>
  )
};

export default WorkExperience;
