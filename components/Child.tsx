import { memo, VFC, ChangeEvent, FormEvent } from 'react'

interface Props {
  printMsg: () => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

// eslint-disable-next-line react/display-name
export const Child: VFC<Props> = memo(({ printMsg, handleSubmit }) => {
  return (
    <>
      {console.log('child renderd')}
      <p>Child Component</p>
      <button onClick={printMsg}>click</button>
    </>
  )
})
