import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Context } from '../index';
import { Posts_Route } from '../utils/consts';
import { useContext } from 'react';

const Login = observer(() => {
    const { authStore } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            await authStore.login(email, password);
            navigate(Posts_Route); // Перенаправление после успешного входа
        } catch (err) {
            setError(err.response?.data?.message || 'Не удалось войти. Проверьте данные.');
        }
    };

    return (
        <div style={{
            maxWidth: '500px',
            margin: '5% auto',
            padding: '20px',
            width: '90%',
            border: '1px solid #dee2e6',
            borderRadius: '0.25rem',
            boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
        }}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Введите email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста, введите корректный email
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Введите пароль</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={3}
                    />
                    <Form.Control.Feedback type="invalid">
                        Пароль должен содержать минимум 6 символов
                    </Form.Control.Feedback>
                </Form.Group>

                {error && (
                    <div className="mb-3 text-danger">
                        {error}
                    </div>
                )}
                
                <Button variant="primary" type="submit">
                    Отправить
                </Button>
            </Form>
        </div>
    );
});

export default Login;