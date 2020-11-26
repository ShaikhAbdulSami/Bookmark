import React, { useContext, useRef, useState } from "react"
import Button from "react-bootstrap/Button"
import { RouteComponentProps } from "@reach/router"
import { identityContext } from "../context/NetlifyContext"
import Form from "react-bootstrap/Form"
import ListGroup from "react-bootstrap/ListGroup"
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


export default function UserArea(props: RouteComponentProps) {
  const [addBookmark] = useMutation(AddBookMarkMutation)
  const [removeBookmark] = useMutation(RemoveBookMarkMutation)
  let { loading, error, data, refetch } = useQuery(BookMarksQuery,{fetchPolicy:"cache-first"})

  const { user, identity } = useContext(identityContext)
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


  React.useEffect(()=>{
    async function fetchData(){
        await refetch();
    }

    fetchData()

  },[user])


  return (
  !!user ? (
    <Jumbotron className={styles.jumbotron}>
      <Button disabled = {loading}
        className={styles.logout}
        onClick={() => {
          identity.logout()
        }}
        variant="outline-dark"
      >
        Logout
      </Button>

      <h2>{user.user_metadata.full_name}'s List</h2>

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

      <ListGroup variant="flush">
        {(loading ) ? <div>Loading...</div> : 
        error ? <div>{error.message}</div> : 
          (data.bookmark.length === 0 ? (
            <h5>Your todo list is empty</h5>
          ) : (
            data.bookmark.map(book => (
              <ListGroup.Item key={book.id}>
                <div>
                  <Button onClick={() => removeBookmarkSubmit(book.id)}>DELETE</Button>
                  <p className={styles.todoText}>{book.title}</p>
                  <br />
                  <p className={styles.todoText}>{book.url}</p>
                  <br />
                  <Button href={book.url}>Go to link</Button>
                </div>
              </ListGroup.Item>
            ))
          ))}
      </ListGroup>
    </Jumbotron>
  ) : (
    <div>
      <Jumbotron className={styles.jumbotron}>
        <h4>Please Login to view your dashboard</h4>
        <Button
          onClick={() => {
            identity.open()
          }}
          variant="outline-dark"
        >
          Login
        </Button>
      </Jumbotron>
    </div>
  )
  )
}
