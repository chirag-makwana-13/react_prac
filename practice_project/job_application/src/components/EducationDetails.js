import React, { useState } from 'react';
import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';

const EducationDetails = () => {
  const { values, setFieldTouched, validateForm } = useFormikContext();
  const [error, setError] = useState('');

  const validateAndAdd = (push) => {
    let valid = true;

    values.education.forEach((entry, index) => {
      if (!entry.board || !entry.passingYear || !entry.percentage) {
        valid = false;
        setFieldTouched(`education.${index}.board`, true, false);
        setFieldTouched(`education.${index}.passingYear`, true, false);
        setFieldTouched(`education.${index}.percentage`, true, false);
      }
    });

    validateForm().then((errors) => {
      if (valid && Object.keys(errors.education || {}).length === 0) {
        push({ board: '', passingYear: '', percentage: '' });
        setError('');
      } else {
        setError('Please fill all fields before adding a new entry.');
      }
    });
  };

  return (
    <FieldArray name="education">
      {({ push, remove, form }) => (
        <>
          {form.values.education.map((_, index) => (
            <div key={index}>
              <div>
                <label>Board</label>
                <Field name={`education.${index}.board`} type="text" />
                <ErrorMessage name={`education.${index}.board`} component="div" className="error" />
              </div>
              <div>
                <label>Passing Year</label>
                <Field name={`education.${index}.passingYear`} type="text" />
                <ErrorMessage name={`education.${index}.passingYear`} component="div" className="error" />
              </div>
              <div>
                <label>Percentage</label>
                <Field name={`education.${index}.percentage`} type="text" />
                <ErrorMessage name={`education.${index}.percentage`} component="div" className="error" />
              </div>
              {form.values.education.length > 1 && (
                <button type="button" onClick={() => remove(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => validateAndAdd(push)}>
            Add Education
          </button>
          {error && <div className="error">{error}</div>}
        </>
      )}
    </FieldArray>
  );
};

export default EducationDetails;
