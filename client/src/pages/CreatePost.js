import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Context } from '../index';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Posts_Route } from '../utils/consts';


const CreatePost = observer(() => {
    const { postStore, authStore } = useContext(Context);
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showActivationModal, setShowActivationModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await authStore.checkAuth();
            
            // Добавляем проверку на существование authStore.user
            if (!authStore.user) {
                setError('Пользователь не авторизован');
                return;
            }
            
            // Сначала проверяем активацию аккаунта
            if (!authStore.user.isActivated) {
                setShowActivationModal(true);
                return;
            }
            
            // Если аккаунт активирован - создаем пост
            await postStore.createPost(topic, content);
            navigate(Posts_Route);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при создании поста');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowActivationModal(false);
    };
    const handleResendActivation = async () => {
    try {
        await authStore.resendActivationLink();
        alert('Новое письмо активации отправлено на вашу почту!');
        setShowActivationModal(false);
    } catch (error) {
        alert('Ошибка при отправке письма');
        console.error('Resend activation error:', error);
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
            <Form onSubmit={handleSubmit}>
                <FloatingLabel
                    controlId="floatingTopic"
                    label="Введите тему поста"
                    className="mb-3"
                >
                    <Form.Control 
                        as="textarea" 
                        placeholder="Тема поста"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                </FloatingLabel>
                
                <FloatingLabel 
                    controlId="floatingContent" 
                    label="Введите текст поста" 
                    className="mb-3"
                >
                    <Form.Control
                        as="textarea"
                        placeholder="Текст поста"
                        style={{ height: '100px' }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </FloatingLabel>
                
                {error && (
                    <div className="alert alert-danger mb-3">
                        {error}
                    </div>
                )}
                
                <Button 
                    variant="primary" 
                    type="submit" 
                    className="d-block mx-auto"
                    disabled={loading}
                >
                    {loading ? 'Отправка...' : 'Отправить'}
                </Button>
            </Form>

            {/* Модальное окно для уведомления об активации */}
            <Modal show={showActivationModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Требуется активация аккаунта</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Для создания постов необходимо активировать ваш аккаунт.</p>
                    {authStore.user && (
                        <p>Пожалуйста, проверьте вашу почту <strong>{authStore.user.email}</strong> и перейдите по ссылке активации.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Понятно
                    </Button>
                    
                    <Button 
                        variant="secondary" 
                        onClick={handleResendActivation}
                        disabled={loading}
                        
                    >
                        Отправить письмо повторно
                    </Button>
                    
                    
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default CreatePost;