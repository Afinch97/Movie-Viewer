import React, { useState, useEffect } from 'react';

const Comments = () => {
    const[commentInfo, setCommentInfo] = useState({})
    console.log(commentInfo)
    const items = []
    const MyComments = () => {
        fetch(`/flask/reviews`)
        .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setCommentInfo(data)
                });
    }
    useEffect(() => MyComments(), []);
    console.log(commentInfo)
    var key = Object.keys(commentInfo)
    const DeleteComment = (e,index) => {
        console.log("Before \n",commentInfo)
        setCommentInfo({
            length:(commentInfo.length-1),
            movie_ids:(commentInfo.movie_ids.filter((x,i) => i !== index)),
            ratings:(commentInfo.ratings.filter((x,i) => i !== index)),
            texts:(commentInfo.texts.filter((x,i) => i !== index))
        })
        fetch(`/delete_comment/${e}`)
        console.log("After\n",commentInfo)
        
    }
    console.log("After\n",commentInfo)
    for(let i=0; i<commentInfo.length; i++){
        console.log(commentInfo.movies[commentInfo.movie_ids[i]][0])
        items.push(
            <>
            <p>({i+1}). {commentInfo.movies[commentInfo.movie_ids[i]][0]}</p><button onClick={() => DeleteComment(commentInfo.review_ids[i],i)}>Delete Comment</button><br />
            <p>rating: {commentInfo.ratings[i]}</p>
            <p>review: {commentInfo.texts[i]}</p>
            <br /><br />
            </>
        )
    }
  return (
    <>
    <h1>Reviews</h1> 
    {(key[0]==="error" || commentInfo.length===0) && 
    <>
    <h1>No Reviews</h1>
    <center><span>Go make some reviews!</span></center>
    </>
    }
        {items}
    </>
  )
}

export default Comments