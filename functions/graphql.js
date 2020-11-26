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
    bookmark: async (parent, args, {user}) => {
      if (!user){
        return [];
      }
      else{

        try{
        
        const results = await client.query(
          q.Paginate(q.Match(q.Index("demo-url"), user))
      )

      return results.data.map(([ref,url,title])=>({
        id: ref.id,
        url,
        title
      }))

    }
    catch(e){

      return e.toString() 
    }



    }
    }
  },
  Mutation:{
    addBookmark: async (_,{url,title},{user})=>{

        if (!user){
          throw new Error ("Must be authenticated to insert todos")
        }
        
        const results = await client.query(
          q.Create(q.Collection("Links"),{
          data:{
              url,
              title,
              owner: user
          } 
          })
      );


        return ({
          ...results.data,
          id: results.ref.id
        }
        )
      },
      removeBookmark: async (_, {id}) => {

        console.log(id)
        try {
          var client = new faunadb.Client({ secret: FAUNADB_ADMIN_SECRET });
          var result = await client.query(

            q.Delete(q.Ref(q.Collection("Links"), id))
  
          );

          return result.ref.data
  
        } 
        catch (error){
            console.log('Error: ',error);
        }
      }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({context})=>{
    if (context.clientContext.user){
      return(
        {
          user: context.clientContext.user.sub
        }
      )
    }

    else{
      return {};
    }
    
  },
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();