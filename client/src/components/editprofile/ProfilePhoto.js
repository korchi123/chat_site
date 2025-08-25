import { observer } from 'mobx-react-lite';
import Figure from 'react-bootstrap/Figure';
import base_photo from '../../images/base_photo.jpg';


const ProfilePhoto = observer(() => {
    

    return (
        
            <Figure>
                <Figure.Image
                    width={180}
                    height={180}
                    alt="Profile photo"
                    src={base_photo}
                    className="profile-image"
                />
            </Figure>
            
            
        
    );
});

export default ProfilePhoto;