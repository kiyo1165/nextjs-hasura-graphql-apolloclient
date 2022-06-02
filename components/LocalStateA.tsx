import { ChangeEvent, FormEvent, useState, VFC } from 'react'
import { todoVar } from '../cache'
import { useReactiveVar } from '@apollo/client'
import Link from 'next/link'

export const LocalStateA: VFC = () => {
  const [input, setInput] = useState('')

  //cacheで定義したstateを読み込み、todos変数に格納
  const todos = useReactiveVar(todoVar)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    todoVar([...todoVar(), { title: input }])
    setInput('')
  }
  return (
    <>
      <p className="md-3 font-bold">makeVar</p>
      {todos?.map((task, index) => {
        return (
          <p className="mb-3 y-1" key={index}>
            {task.title}
          </p>
        )
      })}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        <input
          className="mb-3 px-3 py-2 border border-gray-300"
          placeholder="New task ?"
          type="text"
          value={input}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
        <button
          disabled={!input}
          type="submit"
          className="disabled:opacity-40 mb-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
        >
          submit
        </button>
      </form>
      <Link href="/local-state-b">
        <a>Next</a>
      </Link>
    </>
  )
}
