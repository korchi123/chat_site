import { observer } from 'mobx-react-lite';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const ProfileBio = observer(({ store }) => {
    return (
        <>
        
            <FloatingLabel 
                controlId="floatingContent" 
                label="Расскажите о себе" 
                
            >
                <Form.Control
                    as="textarea"
                    placeholder="Текст поста"
                    style={{ height: '100%',
                        minHeight: '200px'
                        
                     }}
                    value={store.bio}
                    onChange={(e) => store.setBio(e.target.value)}
                    required
                />
              
            </FloatingLabel>
            
        </>
    );
});

export default ProfileBio;