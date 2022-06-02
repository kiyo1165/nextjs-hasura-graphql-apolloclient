import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client'
import 'cross-fetch/polyfill'

// export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

//apolloClientのインスタンス化
const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', //ブラウザではない、すなわちサーバーサイドの場合。
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_HASURA_URL, //graphQLのエンドポイント
      headers: {
        'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_KEY,
      },
    }),
    cache: new InMemoryCache(),
  })
}

// SSG and SSRの場合は常に新しいapollocrientを作成する。
export const initializeApollo = (initialState = null) => {
  //左辺がnull or undefiedの場合は右辺を実行、左辺がtrueの場合は左辺を代入
  const _apolloClient = apolloClient ?? createApolloClient()
  if (typeof window === 'undefined') return _apolloClient

  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

/*
1.作成した上記ライブラリをrootの_app.tsxで呼び出す。
2.ApolloProviderでcomponentをラップ。
*/
