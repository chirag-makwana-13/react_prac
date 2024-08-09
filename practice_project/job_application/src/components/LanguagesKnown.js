import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';

const LanguagesKnown = () => {
  const { values, setFieldValue } = useFormikContext();

  const handleLanguageChange = (language) => (e) => {
    const isChecked = e.target.checked;
    if (!isChecked) {
      setFieldValue(`languages.${language}.read`, false);
      setFieldValue(`languages.${language}.write`, false);
      setFieldValue(`languages.${language}.speak`, false);
    }
    setFieldValue(`languages.${language}.selected`, isChecked);
  };

  return (
    <>
      <div>
        <label>
          <Field
            name="languages.hindi.selected"
            type="checkbox"
            onChange={handleLanguageChange('hindi')}
          />
          Hindi
        </label>
        {values.languages.hindi.selected && (
          <div>
            <label>
              <Field name="languages.hindi.read" type="checkbox" />
              Read
            </label>
            <label>
              <Field name="languages.hindi.write" type="checkbox" />
              Write
            </label>
            <label>
              <Field name="languages.hindi.speak" type="checkbox" />
              Speak
            </label>
            <ErrorMessage name="languages.hindi" component="div" className="error" />
          </div>
        )}
      </div>
      <div>
        <label>
          <Field
            name="languages.gujarati.selected"
            type="checkbox"
            onChange={handleLanguageChange('gujarati')}
          />
          Gujarati
        </label>
        {values.languages.gujarati.selected && (
          <div>
            <label>
              <Field name="languages.gujarati.read" type="checkbox" />
              Read
            </label>
            <label>
              <Field name="languages.gujarati.write" type="checkbox" />
              Write
            </label>
            <label>
              <Field name="languages.gujarati.speak" type="checkbox" />
              Speak
            </label>
            <ErrorMessage name="languages.gujarati" component="div" className="error" />
          </div>
        )}
      </div>
      <div>
        <label>
          <Field
            name="languages.english.selected"
            type="checkbox"
            onChange={handleLanguageChange('english')}
          />
          English
        </label>
        {values.languages.english.selected && (
          <div>
            <label>
              <Field name="languages.english.read" type="checkbox" />
              Read
            </label>
            <label>
              <Field name="languages.english.write" type="checkbox" />
              Write
            </label>
            <label>
              <Field name="languages.english.speak" type="checkbox" />
              Speak
            </label>
            <ErrorMessage name="languages.english" component="div" className="error" />
          </div>
        )}
      </div>
    </>
  );
};

export default LanguagesKnown;
