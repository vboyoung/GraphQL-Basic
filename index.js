const express = require ('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema, parse } = require( 'graphql' );


// DB Modeling => type Query 입력값, 리턴 값 지정 
const schema = buildSchema(`  
    input ProductInput {
        name: String
        price: Int
        description : String
    }

    type Product {
        id: ID!
        name: String
        price: Int
        descrption: String
    }

    type Query {
        hello: String,
        nodejs : Int
        getProduct( id : ID! ) : Product  
    }

    type Mutation {
        addProduct(input : ProductInput) : Product
        updateProduct( id : ID! , input : ProductInput! ) : Product
        deleteProduct( id: ID! ) : String 
    }
`);


// 데이터 저장
const products = [{
    id: 1,
    name: '첫번째 작품',
    price: 2000,
    description: '하하하',
},
{   id: 2,
    name: '두번째 작품',
    price: 4000,
    description: '호호호',

}]


const root = {
    hello : () => `hello world`,
    nodejs : () => 20,
    getProduct : ({ id }) => products.find( product => product.id === parseInt(id)),
    addProduct :  ({input}) => {
        input.id = parseInt(products.length+1);
        products.push(input);
        return root.getProduct({id : input.id});
    },
    updateProduct : ({ id, input }) => {
        //id값을 통해 배열의 인덱싱값을 찾아 처리
        const index = products.findIndex( product => product.id == parseInt(id) )
        products[index] = {
            id : parseInt(id),
            ...input //객체가 펼쳐짐 (operate 연산자)
        }
        return products[index]; 
    },
    deleteProduct : ({ id }) => {
        const index = products.findIndex( product => product.id == parseInt(id) )
        products.splice( index, 1 )
        return "remove sucess"
    }
};


//graphql express 연동
const app = express();
app.use('/graphql', graphqlHTTP({
    schema : schema,
    rootValue: root,
    graphiql: true
}));

app.use('/static', express.static('static'));

app.listen( 4000, () => {
    console.log('running sever port 4000')
});