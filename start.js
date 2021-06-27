const { graphql, buildSchema } = require('graphql');


// DB Modeling
const schema = buildSchema(`
    type Query {
        hello: String,
        nodejs : Int
    }
`);

// 데이터 저장
const root = {
    hello : () => `hello world`,
    nodejs : () => 20
}

graphql(schema, `{ nodejs }`, root).then( (response) => {
    console.log(response);
})