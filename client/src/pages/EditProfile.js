import { useContext, useRef, useEffect, useState } from "react";
import { observer } from 'mobx-react-lite';
import Container from 'react-bootstrap/Container';
import { Context } from "..";
import EditBirthDate from '../components/editprofile/EditBirthDate.js';
import base_photo from '../images/base_photo.jpg';
import { Figure, Button, Card, Modal } from "react-bootstrap";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import './pagescss/EditProfile.css';

const EditProfile = observer(() => {
    const { profileStore } = useContext(Context);
    const fileInputRef = useRef(null);
    const [showBioSuccessModal, setShowBioSuccessModal] = useState(false);
    const [showBirthDateSuccessModal, setShowBirthDateSuccessModal] = useState(false);
    const [birthDateError, setBirthDateError] = useState('');

    useEffect(() => {
        profileStore.loadProfile();
    }, [profileStore]);

    useEffect(() => {
        console.log('API URL:', process.env.REACT_APP_API_URL);
    }, []);

    const handleCloseBioModal = () => setShowBioSuccessModal(false);
    const handleShowBioModal = () => setShowBioSuccessModal(true);
    const handleCloseBirthDateModal = () => {
            setShowBirthDateSuccessModal(false);
            setBirthDateError('');
        };
    const handleShowBirthDateModal = () => setShowBirthDateSuccessModal(true);

    const handlePhotoUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите изображение');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Файл слишком большой (максимум 5MB)');
            return;
        }

        profileStore.uploadPhoto(file);
    };

    const handleDeletePhoto = async () => {
        if (window.confirm('Вы уверены, что хотите удалить фотографию профиля?')) {
            try {
                await profileStore.deletePhoto();
                // После успешного удаления устанавливаем base_photo
                profileStore.setPhoto('');
            } catch (error) {
                console.error('Ошибка при удалении фотографии:', error);
            }
        }
    };

    const handleSaveBio = async () => {
        try {
            await profileStore.saveBio();
            handleShowBioModal(); // Показываем модальное окно после успешного сохранения
        } catch (error) {
            console.error('Ошибка при сохранении биографии:', error);
        }
    };
    const handleSaveBirthDate = async () => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const selectedDate = new Date(profileStore.birthDate);
            
            if (selectedDate > today) {
                setBirthDateError('Дата рождения не может быть в будущем');
                return;
            }
            
            await profileStore.saveBirthDate();
            handleShowBirthDateModal();
        } catch (error) {
            setBirthDateError('Ошибка при сохранении даты');
        }
    };

    return (
        <Container>
            <div className="profile-container">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />

                {/* Левая колонка - фото и дата рождения */}
                <div className="left-column">
                    <Figure>
                        <Figure.Image
                            width={180}
                            height={180}
                            alt="Profile photo"
                            src={profileStore.photo ? `${process.env.REACT_APP_API_URL}${profileStore.photo}` : base_photo}
                            className="profile-image"
                            onError={(e) => {
                                e.target.src = base_photo;
                            }}
                        />
                    </Figure>
                    
                    <Button 
                        variant="primary"
                        onClick={handlePhotoUploadClick}
                        disabled={profileStore.isLoading}
                        className="profile-button"
                    >
                        {profileStore.isLoading ? 'Загрузка...' : 'Обновить фотографию'}
                    </Button>
                    
                    <Button 
                        variant="danger"
                        onClick={handleDeletePhoto}
                        disabled={!profileStore.photo || profileStore.isLoading}
                        className="profile-button"
                    >
                        Удалить фотографию
                    </Button>
                    
                    <div style={{ width: '100%' }}>
                        <EditBirthDate store={profileStore} />
                        {birthDateError && (
                        <div className="text-danger mt-2">{birthDateError}</div>
                    )}
                    </div>
                    
                    <Button 
                        variant="primary"
                        onClick={handleSaveBirthDate}
                        disabled={profileStore.isSavingBirthDate}
                        className="profile-button"
                    >
                        {profileStore.isSavingBirthDate ? 'Сохранение...' : 'Сохранить дату'}
                    </Button>
                </div>

                {/* Правая колонка - биография */}
                <div className="right-column">
                    <Card className="bio-card">
                        <Card.Body className="card-body">
                            <Form className="bio-form">
                                <FloatingLabel 
                                    controlId="floatingContent" 
                                    label="Напишите биографию" 
                                    className="bio-label"
                                >
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Расскажите о себе"
                                        value={profileStore.bio}
                                        onChange={(e) => profileStore.setBio(e.target.value)}
                                        className="bio-input"
                                    />
                                </FloatingLabel>
                            </Form>
                        </Card.Body>
                        <div className="save-button-container">
                            <Button 
                                variant="primary"
                                onClick={handleSaveBio}
                                disabled={profileStore.isSavingBio}
                                className="profile-button"
                            >
                                {profileStore.isSavingBio ? 'Сохранение...' : 'Сохранить биографию'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Модальное окно успешного сохранения */}
            <Modal show={showBioSuccessModal} onHide={handleCloseBioModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Биография успешно обновлена
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseBioModal}>
                        Понятно
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showBirthDateSuccessModal} onHide={handleCloseBirthDateModal} centered>
            <Modal.Header closeButton>
                    <Modal.Title>Успешно!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Дата рождения успешно обновлена
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseBirthDateModal}>
                        Понятно
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
});

export default EditProfile;