import React, { useState } from 'react';
import { Field, FieldArray, ErrorMessage, useFormikContext } from 'formik';


const References = () => {
  const { values, setFieldTouched, validateForm } = useFormikContext();
  const [error, setError] = useState('');

  const validateAndAdd = (push) => {
    let valid = true;

    values.references.forEach((entry, index) => {
      if (!entry.relativeName || !entry.relationship || !entry.number) {
        valid = false;
        setFieldTouched(`references.${index}.relativeName`, true, false);
        setFieldTouched(`references.${index}.relationship`, true, false);
        setFieldTouched(`references.${index}.number`, true, false);
      }
    });

    validateForm().then((errors) => {
      if (valid && Object.keys(errors.references || {}).length === 0) {
        push({ relativeName: '', relationship: '', number: '' });
        setError('');
      } else {
        setError('Please fill all fields before adding a new entry.');
      }
    });
  };

  return (
    <FieldArray name="references">
      {({ push, remove, form }) => (
        <>
          {form.values.references.map((_, index) => (
            <div key={index}>
              <div>
                <label>Relative Name</label>
                <Field name={`references.${index}.relativeName`} type="text" />
                <ErrorMessage name={`references.${index}.relativeName`} component="div" className="error" />
              </div>
              <div>
                <label>Relationship</label>
                <Field name={`references.${index}.relationship`} type="text" />
                <ErrorMessage name={`references.${index}.relationship`} component="div" className="error" />
              </div>
              <div>
                <label>Phone Number</label>
                <Field name={`references.${index}.number`} type="text" />
                <ErrorMessage name={`references.${index}.number`} component="div" className="error" />
              </div>
              {form.values.references.length > 1 && (
                <button type="button" onClick={() => remove(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => validateAndAdd(push)}>
            Add References
          </button>
          {error && <div className="error">{error}</div>}
        </>
      )}
    </FieldArray>
  )
};

export default References;
