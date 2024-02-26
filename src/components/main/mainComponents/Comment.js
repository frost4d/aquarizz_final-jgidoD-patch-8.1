import { Textarea, Box, Button, Flex, Heading, Text, Image, Card, Input } from "@chakra-ui/react"
import { useState,useEffect, useRef } from "react"
import {db,} from '../../../firebase/firebaseConfig'
import {doc, collection, getDoc, addDoc, serverTimestamp, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {UserAuth} from '../../context/AuthContext'
import { formatDistanceToNow } from "date-fns"
import Profile from "../Profile"

const Comments = (props) => {
const {user, userProfile} = UserAuth()
const postID = props.postID
const authorId = props.authorId
const [comment, setComment] = useState("")
const [commentData, setCommentData] = useState()

const txt = useRef()



  async function getComments() {
    const data = [];

    try{
        const postRef = doc(db, 'posts', postID)
        const commentRef = collection(postRef,"comments")
        // const querySnapshot = await getDocs(commentRef)
        const querySnapshot = await getDocs(query( commentRef, orderBy("createdAt", "desc"), limit(5)));
    
        querySnapshot.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
    
    }
    catch(err){
    }
   

   return data;
  }
//getting the comments but suddenly becoming undefined
useEffect(()=>{
  fetchComments()
}, [])

const fetchComments = async (e) => {
const comments = await getComments()
setCommentData(comments)

}

const handleCommentSubmit = async (e) => {
    e.preventDefault()

    // txt.current.value = ""
    const obj = {
        content : comment,
        authorID: user?.uid,
        name: userProfile.name,
        datePosted: Date.now(),
        createdAt: serverTimestamp(),
        recipientUserID: authorId,
    }
    try {
        const postRef = doc(db, 'posts', postID)
        const commentRef = collection(postRef, "comments")
        await addDoc(commentRef, obj)
        console.log(obj)
        setComment("")
    } catch(err){
    }
    console.log(comment)
}

const isWhitespace = (value) => {
    return value.trim() === ''; // trim() removes leading/trailing whitespaces
  };

const handleChange = (e) => {
    setComment(e.target.value)
  };
    return(
        <>
            <Box>
                {
                    commentData && commentData.map((comment) => (
                        <Flex key={comment.id} flexDirection="column" align="start">
                        <Card w="100%" textAlign="start" my="12px">
                        <Box mx="24px">
                        <Profile name={comment.name} 
                        authorId={comment.authorID}/>
                        <br/>
                        <Text as="i" fontSize="xs"                           color="gray.500"
                        >{formatDistanceToNow(comment.datePosted)} ago</Text>
                        </Box>

                        <Box mx="32px" my="24px">
                        <Text>
                            {comment.content}
                        </Text>
                       
                        </Box>
                        </Card>
                           
                        </Flex>
                    ))

                }
            </Box>

            <Flex w="100%" >
                <form onSubmit={handleCommentSubmit} style={{width: "100%", display: "flex", alignItems: "end", justifyContent: "center", flexDirection: "column"}}>
                    <Input value={comment} onChange={handleChange}/>
                    <Button type="submit" my="12px" isDisabled={isWhitespace(comment)} >Comment</Button>
                </form>
            </Flex>
        </>

    )
}
export default Comments