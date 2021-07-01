import { createClient, fetchExchange, dedupExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import useAuth from "./useAuth";
import { points as pointsQuery } from "@/queries.js";

const graphExchange = cacheExchange({
  updates: {
    Mutation: {
      createPoint: (result, _args, cache) => {
        cache.updateQuery({ query: pointsQuery }, (data) => ({
          points: [result.createPoint, ...data.points],
        }));
      },
      deletePoint: (result, _args, cache) => {
        cache.updateQuery({ query: pointsQuery }, (data) => ({
          points: data.points.filter(
            ({ _id }) => _id !== result.deletePoint._id
          ),
        }));
      },
      updatePoint: (result, args, cache) => {
        cache.updateQuery({ query: pointsQuery }, (data) => ({
          points: data.points.map((point) =>
            point._id === args._id ? result.updatePoint : point
          ),
        }));
      },
    },
  },

  optimistic: {
    createPoint: (vars) => ({
      __typename: "Point",
      _id: "temporary",
      title: vars.title,
      address: vars.address,
    }),
    deletePoint: (vars) => ({
      __typename: "Point",
      _id: vars._id,
    }),
    updatePoint: (vars) => ({
      __typename: "Point",
      _id: vars.point._id,
      title: vars.point.title,
      address: vars.point.address,
    }),
  },
});

const client = createClient({
  url: "/graphql",
  requestPolicy: "cache-and-network",
  fetchOptions: () => {
    const { data } = useAuth.getState();

    return {
      headers: { authorization: `Bearer ${data?.access_token}` },
    };
  },
  exchanges: [dedupExchange, graphExchange, fetchExchange],
});

export default client;
