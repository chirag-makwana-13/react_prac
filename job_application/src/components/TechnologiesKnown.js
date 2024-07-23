import React from 'react';
import { Field, ErrorMessage } from 'formik';

const TechnologiesKnown = () => (
  <>
    <div>
      <label>PHP</label>
      <div>
        <Field name="technologies.php" as="select">
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="midotor">Midotor</option>
          <option value="expert">Expert</option>
        </Field>
        <ErrorMessage name="technologies.php" component="div" className="error" />
      </div>
    </div>
    <div>
      <label>SQL</label>
      <div>
        <Field name="technologies.sql" as="select">
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="midotor">Midotor</option>
          <option value="expert">Expert</option>
        </Field>
        <ErrorMessage name="technologies.sql" component="div" className="error" />
      </div>
    </div>
    <div>
      <label>Java</label>
      <div>
        <Field name="technologies.java" as="select">
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="midotor">Midotor</option>
          <option value="expert">Expert</option>
        </Field>
        <ErrorMessage name="technologies.java" component="div" className="error" />
      </div>
    </div>
    <div>
      <label>Python</label>
      <div>
        <Field name="technologies.python" as="select">
          <option value="">Select</option>
          <option value="beginner">Beginner</option>
          <option value="midotor">Midotor</option>
          <option value="expert">Expert</option>
        </Field>
        <ErrorMessage name="technologies.python" component="div" className="error" />
      </div>
    </div>
  </>
);

export default TechnologiesKnown;