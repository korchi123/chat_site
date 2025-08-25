import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Context } from '../index';
import { Posts_Route } from '../utils/consts';
import { useContext } from 'react';

const CreatePost = observer(() => {
    const { authStore } = useContext(Context);
    const [code, setCode] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);
        
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            setIsLoading(false);
            return;
        }

        try {
            // Отправляем код подтверждения на сервер
            const response = await authStore.deleteConfirm(code);
            
            // Если удаление прошло успешно
            if (response.status === 200) {
                navigate(Posts_Route);
            }
        } catch (err) {
            setError(err.response?.data?.message || 
                    'Неверный код подтверждения. Попробуйте еще раз.');
        } finally {
            setIsLoading(false);
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
            <h2 className="mb-4">Подтверждение удаления аккаунта</h2>
            <p className="mb-4">
                На вашу почту был отправлен код подтверждения. 
                Введите его ниже для завершения удаления аккаунта.
            </p>
            
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicCode">
                    <Form.Label>Код подтверждения</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Введите 6-значный код"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        minLength={6}
                        maxLength={6}
                        pattern="\d{6}"
                    />
                    <Form.Control.Feedback type="invalid">
                        Пожалуйста, введите 6-значный код
                    </Form.Control.Feedback>
                </Form.Group>

                {error && (
                    <div className="mb-3 text-danger">
                        {error}
                    </div>
                )}
                
                <div className="d-grid gap-2">
                    <Button 
                        variant="danger" 
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Обработка...' : 'Удалить аккаунт'}
                    </Button>
                    
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate(Posts_Route)}
                    >
                        Отмена
                    </Button>
                </div>
            </Form>
        </div>
    );
});

export default CreatePost;