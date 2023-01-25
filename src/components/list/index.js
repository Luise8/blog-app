import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import Image from "react-bootstrap/Image";
import "components/list/styles.css";

function ListItem(props) {
  return (
    <div>
      <Container className=" bg-white p-3 my-2 shadow-sm border position-relative">
        <Row xs={2} sm={2}>
          <Col className="p-0 m-0" sm="auto" xs="auto">
            <Image
              className="diferent-size"
              src={props.postData.img}
              alt="user icon"
              roundedCircle
            ></Image>
          </Col>
          <Col className="my-auto">
            <p className="my-0">{props.postData.author}</p>
          </Col>
        </Row>
        <Row className="ms-2">
          <Col>
            <p>{props.postData.date}</p>
          </Col>
        </Row>
        <Row className="ms-2">
          <Col>
            <h4>{props.postData.title}</h4>
          </Col>
        </Row>
        <Row xs="auto" className="ms-2">
          <Col>
            <p>{props.postData.likes}</p>
          </Col>
          <Col>
            <p>{props.postData.comments}</p>
          </Col>
        </Row>
        <Link
          to={"/post/" + props.postData.uid}
          // To make this Container clickeable without change the style of Container
          /*           
              These styles make the same
              style={{
                position: "absolute",
                right: "0",
                left: "0",
                top: "0",
                bottom: "0",
              }} */
          className="stretched-link"
        ></Link>
      </Container>
    </div>
  );
}

export default function List(List) {
  return (
    <Container className="lists">
      {List.map((post) => {
        return <ListItem key={post.uid} postData={post}></ListItem>;
      })}
    </Container>
  );
}