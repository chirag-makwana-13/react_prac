import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import BasicDetails from './BasicDetails';
import EducationDetails from './EducationDetails';
import LanguagesKnown from './LanguagesKnown';
import TechnologiesKnown from './TechnologiesKnown';
import WorkExperience from './WorkExperience';
import References from './References';
import Preferences from './Preferences';

import '../styles/MultiStepForm.css'; // Correct import path

const MultiStepForm = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Clear local storage on component mount
    localStorage.removeItem('formData');
  }, []);

  const steps = [
    { component: <BasicDetails />, label: 'Basic Details' },
    { component: <EducationDetails />, label: 'Education Details' },
    { component: <LanguagesKnown />, label: 'Languages Known' },
    { component: <TechnologiesKnown />, label: 'Technologies Known' },
    { component: <WorkExperience />, label: 'Work Experience' },
    { component: <References />, label: 'References' },
    { component: <Preferences />, label: 'Preferences' },
  ];

  const validationSchema = [
    Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      address: Yup.string().required('Required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Required'),
      gender: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      zipcode: Yup.string()
        .matches(/^[0-9]{5}$/, 'Zip Code must be 5 digits')
        .required('Required'),
      dob: Yup.date().required('Required'),
    }),
    Yup.object({
      education: Yup.array()
        .of(
          Yup.object({
            board: Yup.string().required('Required'),
            passingYear: Yup.number()
              .typeError('Must be a number')
              .min(1900, 'Invalid year')
              .max(new Date().getFullYear(), 'Invalid year')
              .required('Required'),
            percentage: Yup.number()
              .typeError('Must be a number')
              .min(0, 'Invalid percentage')
              .max(100, 'Invalid percentage')
              .required('Required'),
          })
        )
        .required('Must have education details')
        .min(1, 'Minimum of 1 education detail required'),
    }),
    Yup.object({
      languages: Yup.object({
        hindi: Yup.object({
          selected: Yup.boolean(),
          read: Yup.boolean(),
          write: Yup.boolean(),
          speak: Yup.boolean(),
        }).test(
          'hindi-test',
          'At least one option should be selected for Hindi',
          (value) => !value.selected || value.read || value.write || value.speak
        ),
        gujarati: Yup.object({
          selected: Yup.boolean(),
          read: Yup.boolean(),
          write: Yup.boolean(),
          speak: Yup.boolean(),
        }).test(
          'gujarati-test',
          'At least one option should be selected for Gujarati',
          (value) => !value.selected || value.read || value.write || value.speak
        ),
        english: Yup.object({
          selected: Yup.boolean(),
          read: Yup.boolean(),
          write: Yup.boolean(),
          speak: Yup.boolean(),
        }).test(
          'english-test',
          'At least one option should be selected for English',
          (value) => !value.selected || value.read || value.write || value.speak
        ),
      }),
    }),
    Yup.object({
      technologies: Yup.object({
        php: Yup.string().oneOf(['beginner', 'midotor', 'expert']),
        sql: Yup.string().oneOf(['beginner', 'midotor', 'expert']),
        java: Yup.string().oneOf(['beginner', 'midotor', 'expert']),
        python: Yup.string().oneOf(['beginner', 'midotor', 'expert']),
      }),
    }),
    Yup.object({
      workExperience: Yup.array()
        .of(
          Yup.object({
            companyName: Yup.string().required('Required'),
            designation: Yup.string().required('Required'),
            fromDate: Yup.date().required('Required'),
            toDate: Yup.date().required('Required'),
          })
        )
        .required('Must have work experience details')
        .min(1, 'Minimum of 1 work experience required'),
    }),
    Yup.object({
      references: Yup.array()
        .of(
          Yup.object({
            relativeName: Yup.string().required('Required'),
            relationship: Yup.string().required('Required'),
            number: Yup.string()
              .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
              .required('Required'),
          })
        )
        .required('Must have reference details')
        .min(1, 'Minimum of 1 reference required'),
    }),
    Yup.object({
      preferences: Yup.object({
        location: Yup.string().required('Required'),
        department: Yup.string().required('Required'),
        noticePeriod: Yup.string().required('Required'),
        expectedCTC: Yup.number().required('Required'),
        currentCTC: Yup.number().required('Required'),
      }),
    }),
  ];

  const initialValues = {
    name: '',
    email: '',
    address: '',
    phone: '',
    gender: '',
    state: '',
    city: '',
    zipcode: '',
    dob: '',
    education: [{ board: '', passingYear: '', percentage: '' }],
    languages: {
      hindi: { selected: false, read: false, write: false, speak: false },
      gujarati: { selected: false, read: false, write: false, speak: false },
      english: { selected: false, read: false, write: false, speak: false },
    },
    technologies: {
      php: '',
      sql: '',
      java: '',
      python: '',
    },
    workExperience: [{ companyName: '', designation: '', fromDate: '', toDate: '' }],
    references: [{ relativeName: '', relationship: '', number: '' }],
    preferences: { location: '', department: '', noticePeriod: '', expectedCTC: '', currentCTC: '' },
  };

  const handleNext = () => setStep((prevStep) => prevStep + 1);
  const handlePrevious = () => setStep((prevStep) => prevStep - 1);

  const handleSubmit = (values) => {
    console.log(values);
    localStorage.setItem('formData', JSON.stringify(values));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema[step]}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className="form-container">
          <fieldset>
            <legend>{steps[step].label}</legend>
            {steps[step].component}
            <div className="button-group">
              {step > 0 && <button type="button" onClick={handlePrevious}>Previous</button>}
              {step < steps.length - 1 && (
                <button type="button" onClick={handleNext} disabled={!isValid || !dirty}>
                  Next
                </button>
              )}
              {step === steps.length - 1 && <button type="submit">Submit</button>}
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

export default MultiStepForm;
