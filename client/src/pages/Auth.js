import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Posts_Route } from '../utils/consts';

const Auth = observer(() => {
    const { authStore } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [errors, setErrors] = useState({});
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email обязателен';
        if (!password) newErrors.password = 'Пароль обязателен';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
        if (!nickname) newErrors.nickname = 'Никнейм обязателен';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await authStore.registration(email, password, nickname);
            setShowSuccessModal(true); // Показываем модальное окно при успешной регистрации
        } catch (err) {
            alert(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate(Posts_Route); // Перенаправляем после закрытия модального окна
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
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Введите email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Введите пароль" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Повторите пароль</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Повторите пароль" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        isInvalid={!!errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicNickname">
                    <Form.Label>Никнейм</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Введите никнейм" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        isInvalid={!!errors.nickname}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.nickname}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Зарегистрироваться
                </Button>
            </Form>

            {/* Модальное окно успешной регистрации */}
            <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Регистрация успешна</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ссылка для активации аккаунта отправлена на почту <strong>{email}</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Понятно
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default Auth;