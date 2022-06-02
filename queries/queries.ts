import { gql } from '@apollo/client'

export const GET_USERS = gql`
  query GetUsers {
    users(order_by: { created_at: desc }) {
      id
      name
      created_at
    }
  }
`
// @clientをつけるとサーバーではなくクライアント側のキャッシュを見に行く
export const GET_USERS_LOCAL = gql`
  query GetUsers {
    users(order_by: { created_at: desc }) @client {
      id
      name
      created_at
    }
  }
`

export const GET_USERIDS = gql`
  query GetUsersIds {
    users(order_by: { created_at: desc }) {
      id
    }
  }
`

/*
1.個別データの取得(引数のidに対応したuserを取得)
2.受け取る引数を変数化する場合は[$]をつける。
3.[!]は受け取る引数が必須である事を示す。
*/
export const GET_USERBY_ID = gql`
  query GetUserById($id: uuid!) {
    users_by_pk(id: $id) {
      id
      name
      created_at
    }
  }
`

export const CREATE_USER = gql`
  mutation CreateUser($name: String!) {
    insert_users_one(object: { name: $name }) {
      id
      name
      created_at
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($id: uuid!) {
    delete_users_by_pk(id: $id) {
      created_at
      id
      name
    }
  }
`
/*
1. _setは変更する値
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: uuid!, $name: String!) {
    update_users_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
      created_at
      id
      name
    }
  }
`

/*
queryを自動生成するときのコマンド
yarn gen-types
 */
