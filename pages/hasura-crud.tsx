import { VFC, useState, FormEvent } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from '../queries/queries'
import {
  GetUsersQuery,
  CreateUserMutation,
  DeleteUserMutation,
  UpdateUserMutation,
} from '../types/generated/graphql'
import { Layout } from '../components/Layout'
import { UserItem } from '../components/UserItem'

const HasuraCRUD: VFC = () => {
  const [editedUser, setEditedUser] = useState({ id: '', name: '' })
  //Get
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })
  //PUT
  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)

  /*
    **CREATE, DELETEはmutation 後のcacheの処理を手動で行う必要がある。**
   
    1. update(cache, { data: { insert_users_one } })
    update関数の第二引数に新規作成した戻り値のinsert_users_oneを読み込む
    2. const cacheId = cache.identify(insert_users_one)
    cache.identify(識別)で戻り値のinsert_users_oneのidを変数に格納
    3. return [toReference(cacheId), ...
    toReference組み込み関数にcacheIdを渡すことで戻り値のinser_users_oneのデータを参照することができる。
    4. cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
    cache.modifyでfields(DBテーブル)の変更を行う。
    ここでのusers、fieldsはapolloclientがgraphqlで定義したテーブル名をクライアント内部に自動で生成している。
    users(既存のデータ, 新しい参照する関数)
    return で既存のデータをスプレッドで展開し、先頭に新しい値をキャッシュにセットしている。
*/

  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    //キャッシュの処理
    update(cache, { data: { insert_users_one } }) {
      const cacheId = cache.identify(insert_users_one)
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })
  /*
1. update関数の第二引数に戻り値(delete_users_by_pk)を読み込む
2. cache.modify関数でキャッシュの変更
3. fieldsで必要なfieldを指定
4. 組み込み関数readField関数をusersの第二引数で読み込む
5. retunrで既存のデータをfilter関数で読み込ませ、戻り値以外のデータを新たに作成する。


*/
  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    //cache処理
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existingUsers, { readField }) {
            return existingUsers.filter(
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          },
        },
      })
    },
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedUser.id) {
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    } else {
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    }
  }
  if (error) return <Layout title="Hasura CRUD">Error: {error.message}</Layout>
  return (
    <Layout title="Hasura CRUD">
      <p className="mb-3 font-bold">Hasura CRUD</p>
      <form
        className="flex flex-col justify-center, items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="px-3 py-2 border border-gray-300"
          type="text"
          placeholder="New user ?"
          value={editedUser.name}
          onChange={(e) =>
            setEditedUser({ ...editedUser, name: e.target.value })
          }
        />
        <button
          type="submit"
          disabled={!editedUser.name}
          data-testid="new"
          className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
        >
          {editedUser.id ? 'Update' : 'Create'}
        </button>
      </form>
      {data?.users.map((user) => {
        return (
          <UserItem
            key={user.id}
            user={user}
            setEditedUser={setEditedUser}
            delete_users_by_pk={delete_users_by_pk}
          />
        )
      })}
    </Layout>
  )
}

export default HasuraCRUD
