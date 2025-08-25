import { observer } from 'mobx-react-lite';
import { Button, Container, Form, Nav, Navbar, NavDropdown, Modal } from 'react-bootstrap';
import { Posts_Route, DeleteAccount_Route, Create_Post, My_Posts, Login_Route, Registration_Route, Profile_Route } from '../utils/consts';
import { useContext, useState } from 'react';
import { Context } from '../index';
import { useNavigate } from 'react-router-dom';

const NavBar = observer(() => {
    const { authStore, searchStore, postStore } = useContext(Context);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            await authStore.deleteRequest();
            setShowDeleteModal(false);
            navigate(DeleteAccount_Route);
        } catch (error) {
            console.error("Ошибка при удалении аккаунта:", error);
        }
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!localSearchQuery.trim()) return;
        
        try {
            // Устанавливаем поисковый запрос в хранилище
            searchStore.setSearchQuery(localSearchQuery);
            
            // Выполняем поиск
            await postStore.searchPosts(localSearchQuery);
            
            // Переходим на страницу постов, если мы не на ней
            if (window.location.pathname !== Posts_Route) {
                navigate(Posts_Route);
            }
        } catch (error) {
            console.error("Ошибка при поиске:", error);
        }
    };

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href={Posts_Route}>Pet project</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                            {authStore.isAuth ? (
                                <>
                                    <NavDropdown title="Аккаунт" id="basic-nav-dropdown" align="end">
                                        <NavDropdown.Item onClick={() => navigate(Create_Post)}>
                                            Создать пост
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => navigate(My_Posts)}>
                                            Мои посты
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => navigate(Profile_Route)}>
                                            Профиль
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={() => authStore.logout()}>
                                            Выйти
                                        </NavDropdown.Item>
                                        <NavDropdown.Item 
                                            onClick={() => setShowDeleteModal(true)}
                                            className="text-danger"
                                        >
                                            Удалить аккаунт
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <Nav.Link href={Registration_Route}>Зарегистрироваться</Nav.Link>
                                    <Nav.Link href={Login_Route}>Войти</Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Form className="d-flex" onSubmit={handleSearchSubmit}>
                            <Form.Control
                                type="search"
                                placeholder="Поиск"
                                className="me-2"
                                aria-label="Search"
                                value={localSearchQuery}
                                onChange={(e) => setLocalSearchQuery(e.target.value)}
                            />
                            <Button 
                                variant="outline-success" 
                                type="submit"
                                disabled={!localSearchQuery.trim()}
                            >
                                Поиск
                            </Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Модальное окно удаления аккаунта */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение удаления</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Удалить аккаунт
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default NavBar;