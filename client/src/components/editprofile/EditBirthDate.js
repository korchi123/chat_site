import { observer } from 'mobx-react-lite';
import Form from 'react-bootstrap/Form';

const EditBirthDate = observer(({ store }) => {
    return (
        
            
                <Form.Group controlId="birthDate">
                    <Form.Label>Дата рождения</Form.Label>
                    <Form.Control 
                        type="date" 
                        name="birthDate" 
                        value={store.birthDate}
                        onChange={(e) => store.setBirthDate(e.target.value)}
                    />
                </Form.Group>
            
        
    );
});

export default EditBirthDate;