import { useContext, useEffect, useState } from "react";
import { Card, Button, Figure, Container, Spinner } from "react-bootstrap";
import { observer } from 'mobx-react-lite';
import { Context } from "..";
import base_photo from '../images/base_photo.jpg';
import { useNavigate } from "react-router-dom";
import { EditProfile_route } from "../utils/consts";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';


const Profile = observer(() => {
    const { profileStore, authStore } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    authStore.checkAuth(),
                    profileStore.loadProfile()
                ]);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [profileStore, authStore]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    const handleResendActivation = async () => {
        try {
            await authStore.resendActivationLink();
            alert('Новое письмо активации отправлено на вашу почту!');
        } catch (error) {
            alert('Ошибка при отправке письма активации');
            console.error('Activation error:', error);
        }
    };

    return (
        <Container>
            <div style={{
                maxWidth: '1000px',
                margin: '5% auto',
                padding: '20px',
                width: '90%',
                border: '1px solid #dee2e6',
                borderRadius: '0.25rem',
                boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                display: 'flex',
                gap: '30px'
            }}>
                
                {/* Левая колонка - фото и дата рождения */}
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    width: '30%'
                }}>
                    <Figure>
                        <Figure.Image
                            width={180}
                            height={180}
                            alt="Profile photo"
                            src={profileStore.photo ? `${process.env.REACT_APP_API_URL}${profileStore.photo}` : base_photo}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #ddd'
                            }}
                            onError={(e) => {
                                e.target.src = base_photo;
                            }}
                        />
                    </Figure>
                    
                    {/* Блок с никнеймом */}
                    <div style={{ 
                        textAlign: 'center',
                        margin: '10px 0'
                    }}>
                        <h4 style={{ 
                            fontWeight: 'bold',
                            margin: 0
                        }}>
                            {authStore.user?.nickname || "Пользователь"}
                        </h4>
                    </div>
                    
                    {profileStore.birthDate && (
                        <div style={{ textAlign: 'center' }}>
                            <strong>Дата рождения:</strong>
                            <div>{new Date(profileStore.birthDate).toLocaleDateString()}</div>
                        </div>
                    )}
                </div>

                {/* Правая колонка - биография */}
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: '20px',
                    width: '70%'
                }}>
                    <Card style={{ flex: 1 }}>
                        <Card.Body style={{ padding: '1rem' }}>
                            <FloatingLabel 
                                controlId="floatingBio" 
                                label="Биография"
                                className="mb-3"
                            >
                                <Form.Control
                                    as="textarea"
                                    plaintext
                                    readOnly
                                    value={profileStore.bio || 'Пользователь пока не добавил биографию'}
                                    style={{ 
                                        height: '100%',
                                        minHeight: '200px',
                                        backgroundColor: 'transparent',
                                        border: 'none'
                                    }}
                                />
                            </FloatingLabel>
                        </Card.Body>
                    </Card>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <Button 
                            onClick={() => navigate(EditProfile_route)}
                            variant="primary"
                            style={{
                                width: 'auto',
                                padding: '5px 15px'
                            }}
                        >
                            Редактировать профиль
                        </Button>
                    </div>
                </div>
            </div>
            
            {!authStore.user?.isActivated && (
                <div style={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '20px',
                    width: '90%',
                    border: '1px solid #dee2e6',
                    borderRadius: '0.25rem',
                    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    alignItems: 'center',
                    backgroundColor: '#fff8e1' // светло-желтый фон для заметности
                }}>
                    <h4 style={{ fontWeight: 'bold', margin: 0, color: '#d32f2f' }}>
                        Аккаунт не активирован
                    </h4>
                    <p style={{ margin: 0, textAlign: 'center' }}>
                        Для полного доступа к функциям необходимо активировать аккаунт.
                        Проверьте почту <strong>{authStore.user?.email}</strong> или запросите новое письмо.
                    </p>
                    <Button 
                        variant="warning"
                        onClick={handleResendActivation}
                        style={{
                            width: 'auto',
                            padding: '8px 20px',
                            fontWeight: 'bold'
                        }}
                    >
                        Отправить ссылку активации повторно
                    </Button>
                </div>
            )}
        </Container>
    );
});

export default Profile;