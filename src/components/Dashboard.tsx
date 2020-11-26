import React, {  useRef } from "react"
import Button from "react-bootstrap/Button"
import { RouteComponentProps } from "@reach/router"
import Form from "react-bootstrap/Form"
import Card from 'react-bootstrap/Card'
import { useQuery, useMutation, gql } from "@apollo/client"
const styles = require("./Dashboard.module.css")
import Jumbotron from "react-bootstrap/Jumbotron"

const BookMarksQuery = gql`
  {
    bookmark {
      id
      title
      url
    }
  }
`;

const AddBookMarkMutation = gql`
  mutation addBookmark(
    $url: String!
    $title: String!
  ) {
    addBookmark(url: $url,  title: $title) {
      url
    }
  }
`;

const RemoveBookMarkMutation = gql`
  mutation removeBookmark($id: ID!) {
    removeBookmark(id: $id) {
      url
    }
  }
`;


export default function Dashboard(props: RouteComponentProps) {
  const [addBookmark] = useMutation(AddBookMarkMutation)
  const [removeBookmark] = useMutation(RemoveBookMarkMutation)
  let { loading, error, data, refetch } = useQuery(BookMarksQuery,{fetchPolicy:"cache-first"})

  const inputRef = useRef<any>()
  const inputUrl = useRef<any>()

  const removeBookmarkSubmit = (id) => {
    console.log(id);
    removeBookmark({
      variables: {
        id: id,
      },
      refetchQueries: [{ query: BookMarksQuery }],
    });
  };

  return (
    <Jumbotron className={styles.jumbotron}>

      <h2>Bookmark's List</h2>

      <div className={styles.inputContainer}>
        <Form.Control
          className={styles.input}
          ref={inputRef}
          type="text"
          placeholder="Add Page Title"
        />
        <br />
        <Form.Control
          className={styles.input}
          ref={inputUrl}
          type="text"
          placeholder="Add Page URL"
        />
        <br />
        <Button
          className={styles.addTaskButton}
          onClick={async () => {
            await addBookmark({ variables: { title: inputRef.current.value , url: inputUrl.current.value} })
            console.log(inputRef.current.value,inputUrl.current.value)
            inputRef.current.value = ""
            inputUrl.current.value = ""
            await refetch()
          }}
          variant="outline-dark"
        >
          Add Task
        </Button>
      </div>
      <div>
        {data?.bookmark.map((book) => {
          return(
          <Card  key={book.id}>
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <Card.Text>
                {book.url}
              </Card.Text>
              <Button onClick={() => removeBookmarkSubmit(book.id)} variant="outline-danger" >Delete</Button>
            </Card.Body>
          </Card>
        )})}
      </div>
      
    </Jumbotron>
)}
