import { VFC } from 'react'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GET_USERS } from '../queries/queries'
import { GetUsersQuery } from '../types/generated/graphql'
import { Layout } from '../components/Layout'

const FetchMain: VFC = () => {
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    // fetchPolicy: 'network-only', //毎回サーバーにアクセスしてキャッシュを更新する。
    fetchPolicy: 'cache-and-network', //fetchしている間に既存のcacheを表示させてくれる。
    // fetchPolicy: 'cache-first', //取得済みのデータがあれば優先的にキャッシュを読みに行く。
    // fetchPolicy: 'no-cache',//キャッシュを使わない。※axiosのように毎回fetchするイメージ
  })
  if (error)
    return (
      <Layout title="Hasura fetchPolicy">
        <p>Error: {error.message}</p>
      </Layout>
    )
  return (
    <Layout title="Hasura fetchPolicy">
      <p className="mb-6 font-bold">Hasura main page</p>
      {console.log(data)}
      {data?.users.map((user) => {
        return (
          <p className="my-1" key={user.id}>
            {user.name}
          </p>
        )
      })}
      <Link href="/hasura-sub">
        <a className="mt-6">Next</a>
      </Link>
    </Layout>
  )
}

export default FetchMain
