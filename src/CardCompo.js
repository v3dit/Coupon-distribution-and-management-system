import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Card,
    CardImg,
    CardImgOverlay,
    CardText,
    CardTitle,
} from 'reactstrap';


const CardCompo = () => {
    return (
        <div>
            <Card inverse>
                <CardImg
                    alt="Card image cap"
                    src="https://picsum.photos/900/270?grayscale"
                    style={{
                        height: 270
                    }}
                    width="100%"
                />
                <CardImgOverlay>
                    <CardTitle tag="h5">
                        Card Title
                    </CardTitle>
                    <CardText>
                        This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.
                    </CardText>
                    <CardText>
                        <small className="text-muted">
                            Last updated 3 mins ago
                        </small>
                    </CardText>
                </CardImgOverlay>
            </Card>
        </div>
    )
};

export default CardCompo;
