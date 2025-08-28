import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import { Context } from '..';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import base_photo from '../images/base_photo.jpg';

const UserProfile = observer(() => {
    const { userId } = useParams();
    const { profileStore } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            profileStore.loadUserProfile(userId);
        }
    }, [userId, profileStore]);

    // 1. Показываем спиннер во время загрузки
    if (profileStore.isLoading) {
        return (
            <Container className="d-flex justify-content-center mt-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    // 2. Показываем ошибку только после завершения загрузки
    if (!profileStore.isLoading && !profileStore.userProfile) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    Профиль пользователя не найден
                </Alert>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Назад
                </Button>
            </Container>
        );
    }

    // 3. Рендерим профиль только когда данные загружены
    const { nickname, birthDate, bio, photo } = profileStore.userProfile;

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
                {/* Левая колонка - фото */}
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    width: '30%'
                }}>
                    <img
                        width={180}
                        height={180}
                        alt="Profile"
                        src={photo ? profileStore.getProxiedImageUrl(photo) : base_photo}
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #ddd'
                        }}
                        onError={(e) => {
                            e.target.src = base_photo;
                        }}
                    />
                </div>

                {/* Правая колонка - информация */}
                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    gap: '20px',
                    width: '70%'
                }}>
                    <Card style={{ flex: 1 }}>
                        <Card.Body>
                            <h2>{nickname}</h2>
                            
                            {birthDate && (
                                <p>
                                    <strong>Дата рождения:</strong>{' '}
                                    {new Date(birthDate).toLocaleDateString()}
                                </p>
                            )}
                            
                            {bio ? (
                                <div className="mt-3">
                                    <h5>О себе:</h5>
                                    <p>{bio}</p>
                                </div>
                            ) : (
                                <p className="text-muted mt-3">Пользователь не добавил информацию о себе</p>
                            )}

                            <Button 
                                variant="secondary" 
                                onClick={() => navigate(-1)}
                                className="mt-3"
                            >
                                Назад
                            </Button>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    );
});

export default UserProfile;