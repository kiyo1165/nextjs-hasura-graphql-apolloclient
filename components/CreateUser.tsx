import { VFC } from 'react'
import { useCreateForm } from '../hooks/useCreateForm'
import { Child } from './Child'

export const CreateUser: VFC = () => {
  const {
    handleSubmit,
    username,
    usernameChange,
    printMsg,
    text,
    handleTextChange,
  } = useCreateForm()

  return (
    <>
      {console.log('CreateUser renderd')}
      <p className="mb-3 font-bold">Custom Hook + useCallback + memo</p>
      <div className="mb-3 flex flex-col justify-center items-center">
        <label>Text</label>
        <input
          type="text"
          className="px-3 py-2 border border-gray-300"
          value={text}
          onChange={handleTextChange}
        />
      </div>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <label>Username</label>
        <input
          type="text"
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="New user ?"
          value={username}
          onChange={usernameChange}
        />
        <button
          type="submit"
          className="my-3 py-1 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
        >
          submit
        </button>
      </form>
      <Child printMsg={printMsg} handleSubmit={handleSubmit} />
    </>
  )
}
