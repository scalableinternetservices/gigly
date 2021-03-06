import { gql } from '@apollo/client'

export const fetchComments = gql`
  query FetchComments {
    comments {
      date
      commentContents
      userId
      username
      userPic
    }
  }
`