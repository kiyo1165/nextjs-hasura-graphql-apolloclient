import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries/queries'
import { CreateUserMutation } from '../types/generated/graphql'

/*

Custom Hook内の関数は基本的にuseCallbackを使用するように推奨されている。。

背景
Custom Hookで定義される関数は、再利用性を目的にしている。
例えば再利用時にPropsとして子コンポーネントに渡した時、親コンポーネントの値が変化し、かつ子コンポーネントが直接関係ない場合、子コンポーネントが再レンダリングしないようにしている。
そのため、値が子コンポーネントに関係ない場合は初回のみレンダリングするようにuseCallbackに明示する必要がある。
*/

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')
  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
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
  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])

  const usernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])

  //childコンポーネント再レンダリングを防ぐためのuseCallback
  const printMsg = useCallback(() => {
    console.log('Hello')
  }, [])

  /*
stateを含む、以下handleSubmitをuseCallbackで使用すケースは第二引数にstateを指定する。

背景
custom hookで関数を生成する時のstateは初期値が参照されて生成されるため、仮に初期値が空の場合は値が空のままになってしまう。
そのため、あらかじめ使用するstateを第二引数に指定する必要がある。

*/
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        await insert_users_one({
          variables: {
            name: username,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setUsername('')
    },
    [username]
  )
  return {
    text,
    handleSubmit,
    username,
    usernameChange,
    printMsg,
    handleTextChange,
  }
}
