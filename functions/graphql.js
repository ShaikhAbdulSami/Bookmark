const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb"),
  q = faunadb.query


  var client = new faunadb.Client({
    secret: process.env.FAUNADB_ADMIN_SECRET,
  })

  const typeDefs = gql`
  type Query {
    bookmark: [Bookmark!]    
  }
  type Bookmark{
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(url: String!, title: String!) : Bookmark
    removeBookmark(id: ID!): Bookmark
  }
`

const resolvers = {
  Query: {
    bookmark: async (root, args, context)=> {
      try{
        var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("urls"))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map(d => {

          return {
            id: d.ref.id,
            url: d.data.url,
            title: d.data.title,
          }
        })
      }
      catch(err){
        console.log('err',err);
      }}},

      Mutation: {
        addBookmark: async (_, {url, title}) => {

          try {
            var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
            var result = await client.query(
              q.Create(
                q.Collection('Links'),
                { data: { 
                  url,
                  title,
                 } },
              )
    
            );
            return result.ref.data
    
          } 
          catch (error){
              console.log('Error: ');
              console.log(error);
          }
        },

        removeBookmark: async (_, {id}) => {

          console.log(id)
          try {
            var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
            var result = await client.query(

              q.Delete(q.Ref(q.Collection("Links"), id))
    
            );

            return result.ref.data
    
          } 
          catch (error){
              console.log('Error: ');
              console.log(error);
          }
        }
    },
  
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler();