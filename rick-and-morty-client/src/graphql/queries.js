import { gql } from '@apollo/client'

export const GET_CHARACTERS = gql`
  query GetCharacters(
    $name: String
    $status: String
    $species: String
    $gender: String
    $sortBy: String
  ) {
    characters(
      name: $name
      status: $status
      species: $species
      gender: $gender
      sortBy: $sortBy
    ) {
      id
      name
      status
      species
      gender
      image
      isFavorite
      is_deleted
    }
  }
`

export const GET_CHARACTER = gql`
  query GetCharacter($id: Int!) {
    character(id: $id) {
      id
      name
      status
      species
      type
      gender
      origin
      location
      image
      isFavorite
      comments {
        id
        author
        content
        createdAt
      }
    }
  }
`

export const ADD_COMMENT = gql`
  mutation AddComment($character_id: Int!, $author: String, $content: String!) {
    addComment(character_id: $character_id, author: $author, content: $content) {
      id
      author
      content
      createdAt
    }
  }
`

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($character_id: Int!) {
    toggleFavorite(character_id: $character_id)
  }
`

export const SOFT_DELETE = gql`
  mutation SoftDelete($id: Int!) {
    softDeleteCharacter(id: $id)
  }
`