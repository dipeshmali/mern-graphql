import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

let TextField = ({ field, type, label, form: { touched, errors } }) => (
    <div className="form-group">
        <label htmlFor={label}>{label}</label>
        <input {...field} type={type} />
        {touched[field.name] && errors[field.name] ? <p>{errors[field.name]}</p> : ''}
    </div>
)

const AuthSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid Email')
        .required('Required'),
    password: Yup.string().required('Required')

})

/** Comman form for signUp & singIn */
const AuthForm = ({ submitData }) => {
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={AuthSchema}
            onSubmit={(values, { setSubmitting }) => {
                submitData(values)
                setSubmitting(false)
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <Field type="email" name="email" label="email" component={TextField} />
                    <Field type="password" name="password" label="password" component={TextField} />
                    <button type="submit" disabled={isSubmitting}>Submit</button>
                </Form>
            )}
        </Formik>
    )
};

export default AuthForm;